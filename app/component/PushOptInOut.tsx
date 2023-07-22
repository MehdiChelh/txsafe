'use client'
import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { ethers } from 'ethers';

import { useEffect, useState } from 'react';
// import { getUserAddress } from '@/utils/eth';

import { useAccount, useConnect, useDisconnect, useWalletClient } from 'wagmi'

import { useWeb3React } from "@web3-react/core";



// any other web3 ui lib is also acceptable
// import { useWeb3React, Web3ReactProvider} from "@web3-react/core";
// import { Web3Provider } from "@ethersproject/providers";

function Child(){
    return (
        <></>
    )
}

  

const usePushSubscriptions = (address: any, isConnected: any) => {
    const [subscriptions, setSubscriptions] = useState();

    useEffect(() => {
        if (isConnected){
            const subscriptions = PushAPI.user.getSubscriptions({
                user: `eip155:5:${address}`, // user address in CAIP
                env: ENV.STAGING,
            }).then((subscriptions) => {
                setSubscriptions(subscriptions);
            })
        }
    }, [isConnected, address])

    const { data: walletClient, isError, isLoading } = useWalletClient()

    const { account, library, chainId } = useWeb3React();
    const signer = library.getSigner(account);
    // walletClient
    console.log({walletClient})
    const optIn = async () => {
        await PushAPI.channels.subscribe({
            signer: walletClient?.signTypedData,
            channelAddress: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681', // channel address in CAIP
            userAddress: `eip155:5:${address}`, // user address in CAIP
            onSuccess: () => {
            console.log('opt in success');
            },
            onError: () => {
            console.error('opt in error');
            },
            env: ENV.STAGING
        })
    }
    return [subscriptions, optIn];
}


export default function MyComponent() {
    const { address, isConnected } = useAccount()
    
    const [subscriptions, optIn] = usePushSubscriptions(address, isConnected);



    return (
        <div>
            <button onClick={optIn}>Opt In</button>
            {/* Your other component content */}
        </div>
    );
}

// export default async function PushOptInOut () {
//     // Request access to the user's Ethereum accounts
// //   window?.ethereum.request({ method: 'eth_requestAccounts' })
// //   .then(accounts => {
// //     // 'accounts' is an array containing the user's Ethereum addresses
// //     if (accounts.length > 0) {
// //       const userAddress = accounts[0];
// //       console.log('User address:', userAddress);
// //       // You can use the userAddress for further interactions with the blockchain
// //     } else {
// //       console.log('No accounts found. Please make sure you have an Ethereum wallet connected.');
// //     }
// //   })
// //   .catch(error => {
// //     console.error('Error fetching user address:', error);
// //   });
// if (typeof window !== 'undefined' && window.ethereum) {
//     // Request access to the user's Ethereum accounts
//     await window.ethereum.request({ method: 'eth_requestAccounts' });
//     // Initialize ethers.js with the provider
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     // Get the signer (user's account) from the provider
//     const signer = provider.getSigner();
//     // Get the user's Ethereum address
//     const userAddress = await signer.getAddress();
//     return userAddress;
//   } else {
//     throw new Error('Ethereum provider not found. Please install MetaMask or use an Ethereum-enabled browser.');
//   }
    
//     return (
//         // <Web3ReactProvider getLibrary={getLibrary}>
//         <></>
//         // </Web3ReactProvider>
//     )
// }