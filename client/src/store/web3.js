import { createSlice } from "@reduxjs/toolkit";
import Web3 from "web3";

export const web3Slice = createSlice({
    name: "web3",
    initialState: {
        web3: null,
        accounts: [],
    },
    reducers: {
        connectWeb3: async (state) => {
            // Wait for loading completion to avoid race conditions with web3 injection timing.
            // Modern dapp browsers...
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                // Request account access if needed
                await window.ethereum.enable();
                // Accounts now exposed
                state.web3 = web3;
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                // Use Mist/MetaMask's provider.
                const web3 = window.web3;
                // console.log("Injected web3 detected.");
                state.web3 = web3;
            }
            // Fallback to localhost; use dev console port by default...
            else {
                const provider = new Web3.providers.HttpProvider(
                    "http://127.0.0.1:8545"
                );
                const web3 = new Web3(provider);
                // console.log("No web3 instance injected, using Local web3.");
                state.web3 = web3;
            }
            state.accounts = await state.web3.eth.getAccounts();
        },
        getAccounts: async (state) => {
            state.accounts = await state.web3.eth.getAccounts();
        }
    }
})
// console.log(web3Slice.reducers)
export const { connectWeb3, getAccounts } = web3Slice.actions;

export default web3Slice.reducer;