truffle migrate --reset 

truffle migrate --reset --network bscTestnet
truffle run verify PricingChain --network bscTestnet

truffle migrate --reset --network avaxTestnet
truffle run verify PricingChain --network avaxTestnet

cd client/
./deploy.bat

