var Universidades = artifacts.require("./Universidades.sol");

contract("Universidades", function(accounts) {
  var univI;

  it("miramos si va la baja", function() {
    return Universidades.deployed().then(function(instance) {
      univI = instance;
      univID = 1;
      return univI.darBaja(univID, { from: accounts[0] });
    })});

  it("hacemos cosas con las unis", function() {
    return Universidades.deployed().then(function(instance) {
      univI = instance;
      return univI.universidades(1);
    }).then(function(universidad) {
      assert.equal(universidad[0], 1, "contains the correct id");
      assert.equal(universidad[1], "UIB", "contains the correct name");
      assert.equal(universidad[2], 0, "contains the correct univ count");
      return univI.universidades(2);
    }).then(function(universidad) {
      assert.equal(universidad[0], 2, "contains the correct id");
      assert.equal(universidad[1], "UNED", "contains the correct name");
      assert.equal(universidad[2], 0, "contains the correct univ count");
    });
  });
});