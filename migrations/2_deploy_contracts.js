const MyToken = artifacts.require("MyToken");

module.exports = function(deployer) {
    const initialSupply = 10000000;
    deployer.deploy(MyToken, initialSupply);
};
