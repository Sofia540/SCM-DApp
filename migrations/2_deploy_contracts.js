var Universidades = artifacts.require("./Universidades.sol");
var Certificados = artifacts.require("./Certificados.sol");

module.exports = function(deployer) {
  deployer.deploy(Universidades);
  deployer.deploy(Certificados);
};