import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./app";

// From react 18 we should use createRoot instead of ReactDOM
const container = document.getElementById("minting-dapp");
const root = ReactDOM.createRoot(container!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
