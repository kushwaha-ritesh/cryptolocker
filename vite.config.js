import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['wagmi', '@rainbow-me/rainbowkit'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('@rainbow-me')) return 'rainbowkit'
          if (id.includes('@walletconnect') || id.includes('walletconnect')) return 'walletconnect'
          if (id.includes('@coinbase')) return 'coinbase'
          if (id.includes('@metamask') || id.includes('metaMask')) return 'metamask'
          if (id.includes('wagmi') || id.includes('@wagmi')) return 'wagmi'
          if (id.includes('viem') || id.includes('@viem')) return 'viem'
          if (id.includes('ethers')) return 'ethers'

          return 'vendor'
        },
      },
    },
  },
})



