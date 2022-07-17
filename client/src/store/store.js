import { configureStore } from '@reduxjs/toolkit'
import web3Reducer from './web3Store'
import toastReducer from './toast'
import PricingChainReducer from './PricingChain'

// console.log(PricingChainReducer,web3Reducer)

export default configureStore({
    reducer: {
        web3Store: web3Reducer,
        toastReducer,
        PricingChain: PricingChainReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
