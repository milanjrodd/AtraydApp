import fs from "fs";
import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import CollectionConfig from "./config/CollectionConfig";
import path from "path";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  "generate-root-hash",
  "Generates and prints out the root hash for the current whitelist",
  async () => {
    // Check configuration
    if (CollectionConfig.whitelistAddresses.length < 1) {
      throw new Error(
        "The whitelist is empty, please add some addresses to the configuration."
      );
    }

    // Build the Merkle Tree
    const leafNodes = CollectionConfig.whitelistAddresses.map((addr) =>
      keccak256(addr)
    );
    const merkleTree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });
    const rootHash = "0x" + merkleTree.getRoot().toString("hex");

    console.log(
      "The Merkle Tree root hash for the current whitelist is: " + rootHash
    );
  }
);

task(
  "generate-proof",
  "Generates and prints out the whitelist proof for the given address (compatible with block explorers such as Etherscan)",
  async (taskArgs: { address: string }) => {
    // Check configuration
    if (CollectionConfig.whitelistAddresses.length < 1) {
      throw new Error(
        "The whitelist is empty, please add some addresses to the configuration."
      );
    }

    // Build the Merkle Tree
    const leafNodes = CollectionConfig.whitelistAddresses.map((addr) =>
      keccak256(addr)
    );
    const merkleTree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });
    const proof = merkleTree
      .getHexProof(keccak256(taskArgs.address))
      .toString()
      .replace(/'/g, "")
      .replace(/ /g, "");

    console.log("The whitelist proof for the given address is: " + proof);
  }
).addPositionalParam("address", "The public address");

task(
  "rename-contract",
  "Renames the smart contract replacing all occurrences in source files",
  async (taskArgs: { newName: string }, hre) => {
    // Validate new name
    if (!/^([A-Z][A-Za-z0-9]+)$/.test(taskArgs.newName)) {
      throw new Error(
        "The contract name must be in PascalCase: https://en.wikipedia.org/wiki/Camel_case#Variations_and_synonyms"
      );
    }

    const oldContractFile = path.join(
      __dirname,
      "contracts",
      CollectionConfig.contractName + ".sol"
    );
    const newContractFile = path.join(
      __dirname,
      "contracts",
      taskArgs.newName + ".sol"
    );

    if (!fs.existsSync(oldContractFile)) {
      throw new Error(
        `Contract file not found: "${oldContractFile}" (did you change the configuration manually?)`
      );
    }

    if (fs.existsSync(newContractFile)) {
      throw new Error(
        `A file with that name already exists: "${oldContractFile}"`
      );
    }

    // Replace names in source files
    let rifPath = path.join(
      __dirname,
      "..",
      "minting-dapp",
      "src",
      "scripts",
      "lib",
      "NftContractType.ts"
    );
    replaceInFile(rifPath, CollectionConfig.contractName, taskArgs.newName);

    rifPath = path.join(__dirname, "config", "CollectionConfig.ts");
    replaceInFile(rifPath, CollectionConfig.contractName, taskArgs.newName);

    rifPath = path.join(__dirname, "lib", "NftContractProvider.ts");
    replaceInFile(rifPath, CollectionConfig.contractName, taskArgs.newName);

    replaceInFile(
      oldContractFile,
      CollectionConfig.contractName,
      taskArgs.newName
    );

    // Rename the contract file
    fs.renameSync(oldContractFile, newContractFile);

    console.log(
      `Contract renamed successfully from "${CollectionConfig.contractName}" to "${taskArgs.newName}"!`
    );

    // Rebuilding types
    await hre.run("typechain");
  }
).addPositionalParam("newName", "The new name");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    truffle: {
      url: "http://localhost:24012/rpc",
    },
    goerli: {
      url: process.env.NETWORK_GOERLI_URL,
      accounts: [process.env.GOERLI_PRIVATE_KEY!],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.GAS_REPORTER_COIN_MARKET_CAP_API_KEY,
  },
  etherscan: {
    apiKey: {
      // Ethereum
      goerli: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
    },
  },
};

// Setup "testnet" network
if (process.env.NETWORK_GOERLI_URL !== undefined) {
  console.log("Using Goerli network");

  config.networks!.testnet = {
    url: process.env.NETWORK_GOERLI_URL,
    accounts: [process.env.GOERLI_PRIVATE_KEY!],
  };
}

// Setup "mainnet" network
if (process.env.NETWORK_MAINNET_URL !== undefined) {
  console.log("Using main network");

  config.networks!.mainnet = {
    url: process.env.NETWORK_MAINNET_URL,
    accounts: [process.env.NETWORK_MAINNET_PRIVATE_KEY!],
  };
}

export default config;

/**
 * Replaces all occurrences of a string in the given file.
 */
function replaceInFile(file: string, search: string, replace: string): void {
  const fileContent = fs
    .readFileSync(file, "utf8")
    .replace(new RegExp(search, "g"), replace);

  fs.writeFileSync(file, fileContent, "utf8");
}
