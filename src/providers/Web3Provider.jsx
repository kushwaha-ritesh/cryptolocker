// Temporary no-op Web3Provider to avoid loading heavy wallet libraries during UI debugging.
// Revert this file to the Wagmi + RainbowKit provider once the simple UI is confirmed working.
import React from 'react'

export function Web3Provider({ children }) {
  return <>{children}</>
}

