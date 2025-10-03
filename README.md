# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Wallets and bundle size

This project uses Wagmi + RainbowKit for wallet connections. To keep the initial bundle small, the Connect UI is lazy-loaded:

- `src/components/LazyConnectButton.jsx` dynamically imports RainbowKit's `ConnectButton`.
- `Header` and the app's `WalletButton` use this lazy wrapper so heavy wallet SDKs (WalletConnect, Coinbase, MetaMask SDKs) are only downloaded when the user opens the connect UI.

If you add more wallets or SDKs, prefer dynamic imports or manualChunks in `vite.config.js` to avoid increasing the initial bundle size.

To further reduce size, consider loading specific wallet SDKs only when the user selects them.
