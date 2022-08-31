const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

// address: 0x78298fA25eBf614A994041Df199c28bc637804d5
const mnemonic = `ad888e1d74cf790c3f855d5f01bc3d53b61d3c831a050661e24a21aeb988bcc9`;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      quiet: true,
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/663e07aa698c45429baf9d7978e9440d`),
      network_id: 4,       // Ropsten's id
      // gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    ethereum: {
      provider: () => new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/663e07aa698c45429baf9d7978e9440d`),
      network_id: 1,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    avax: {
      provider: () => new HDWalletProvider(mnemonic, `https://api.avax.network/ext/bc/C/rpc`),
      network_id: 43114,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    avaxTestnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://api.avax-test.network/ext/bc/C/rpc`),
      network_id: 43113,
      confirmations: 2,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    polygon: {
      provider: () => new HDWalletProvider(mnemonic, `https://polygon-rpc.com/`),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    polygonTestnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      networkCheckTimeout: 1000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `wss://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bscTestnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      networkCheckTimeout: 1000000,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
    },
  },
      "viaIR": true,
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: 'EC1CPUSM1E3RS54R85ZX1STAS7QGD6RVF9',
    bscscan: 'HZMVMUYDGBZDEM8WMGX74SGXBKEC6UBZVV',
    // optimistic_etherscan: 'MY_API_KEY',
    // arbiscan: 'MY_API_KEY',
    snowtrace: 'U4TPA2P44U2WFGF8DQ7MB43MTWBFQUBU5Y',
    // polygonscan: 'MY_API_KEY',
    // ftmscan: 'MY_API_KEY',
    // hecoinfo: 'MY_API_KEY',
    // moonscan: 'MY_API_KEY',
    // bttcscan: 'MY_API_KEY',
    // aurorascan: 'MY_API_KEY',
    // cronoscan: 'MY_API_KEY'
  },
};