import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PricingChainABI from "../contracts/PricingChain.json";
import { notify } from "./toast"

// console.log("PricingChainABI", PricingChainABI.abi.filter(v => v.type == 'event').map(v => v.name))

export const connectContract = createAsyncThunk(
    'connectContract',
    async (args, thunkAPI) => {
        try {
            let web3 = thunkAPI.getState().web3Store.web3;
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = PricingChainABI.networks[networkId];
            const contract = new web3.eth.Contract(
                PricingChainABI.abi,
                deployedNetwork && deployedNetwork.address,
            );
            let owner = null;
            if (contract)
                owner = await contract.methods.owner().call();
            return { contract, owner };
        } catch (error) {
            console.error(error)
            thunkAPI.dispatch(notify(error.message))
            return { contract: null, owner: null };
        }
    }
)

export const getProducts = createAsyncThunk(
    'getProducts',
    async (args, thunkAPI) => {
        try {
            // let web3 = thunkAPI.getState().web3Store.web3;
            let contract = thunkAPI.getState().PricingChain.contract
            let data = await contract.methods.getProducts().call();
            return data.ipfsIDs.map((value, index) => {
                return {
                    id: index,
                    name: data.names[index],
                    price: data.prices[index],
                    ipfsID: value,
                }
            })
        } catch (error) {
            console.error('error ', error)
            return []
        }
    }
)

export const getSessions = createAsyncThunk(
    'getSessions',
    async (args, thunkAPI) => {
        // console.log('getSessions')
        try {
            // let web3 = thunkAPI.getState().web3Store.web3;
            let contract = thunkAPI.getState().PricingChain.contract
            let data = await contract.methods.getSessions().call();
            // console.log('getSessions', data);
            return data.sessionIDs.map((sessionID, index) => {
                return {
                    id: parseInt(index),
                    ipfsID: data.ipfsIDs[index],
                    name: data.names[index],
                    price: parseInt(data.prices[index]),
                    productID: parseInt(data.productIDs[index]),
                    sessionID: parseInt(sessionID),
                    state: parseInt(data.states[index]),
                    timeStarted: parseInt(data.timeStarteds[index]),
                    timeout: parseInt(data.timeouts[index]),
                }
            })
        } catch (error) {
            console.error('error ', error)
            return []
        }
    }
)

export const dosomething = createAsyncThunk(
    'dosomething',
    async (args, thunkAPI) => {
        // console.log(args, thunkAPI.getState())
        let d = 1;
        setTimeout(() => { d = 2 }, 2000);
        return d;
    }
)
export const PricingChainlice = createSlice({
    name: 'PricingChain',
    initialState: {
        contract: null,
        products: [],
        sessions: [],
        owner: null,
        address: null,
        something: 1,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(connectContract.fulfilled, (state, action) => {
            state.contract = action.payload.contract
            state.owner = action.payload.owner;
            // console.log(state, action.payload);
        })

        builder.addCase(getSessions.fulfilled, (state, action) => {
            state.sessions = action.payload;
            // console.log('getSessions: ', action.payload);
        })

        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.products = action.payload;
            // console.log('getProducts: ', action.payload);
        })

        builder.addCase(dosomething.fulfilled, (state, action) => {
            state.something += action.payload;
        })
    },
})

export const { } = PricingChainlice.actions;

export default PricingChainlice.reducer;

// console.log('PricingChainlice', PricingChainlice.reducer)
