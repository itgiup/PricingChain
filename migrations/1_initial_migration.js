var contract = artifacts.require("./PricingChain.sol");

module.exports = function (deployer) {
  deployer.deploy(contract);
};
