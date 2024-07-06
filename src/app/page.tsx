'use client'

import { useMemo } from 'react'
import { zeroAddress } from 'viem'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useCapabilities, useSendCalls } from 'wagmi/experimental'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: availableCapabilities } = useCapabilities({
    account: account.address,
  })
  const { sendCalls } = useSendCalls()

  const capabilities = useMemo(() => {
    if (!availableCapabilities || !account.chainId) return {}
    const capabilitiesForChain = availableCapabilities[account.chainId]
    if (capabilitiesForChain['paymasterService'] && capabilitiesForChain['paymasterService'].supported) {
      return {
        paymasterService: {
          // url: process.env.NEXT_PUBLIC_PAYMASTER_URL,
          url: 'https://api.developer.coinbase.com/rpc/v1/base/R4cOTW9CeRvwgLbBQ80RMsoaGhnA_XDC',
        }
      }
    }
  }, [availableCapabilities])

  const handleMint = async () => {
    console.log(capabilities)
    sendCalls({
      calls: [
        {
          to: zeroAddress,
          value: BigInt(0),
        }
      ],
      capabilities
    })
  }

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      <div>
        <h2>Capabilities</h2>
        <div>{JSON.stringify(availableCapabilities)}</div>
      </div>

      <div>
        <h2>Mint</h2>
        <button
          onClick={handleMint}
          type="button"
        >
          Mint an NFT
        </button>
      </div>
    </>
  )
}

export default App
