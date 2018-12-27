var auction = artifacts.require("./SimpleAuction.sol");
module.exports = function(deployer) {
  deployer.deploy(auction);
};
