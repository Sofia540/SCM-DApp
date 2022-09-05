var Certificados = artifacts.require("./Certificados.sol");

contract("Certificados", function(accounts) {
  var certI;

  it("hacemos cosas con las unis", function() {
    return Certificados.deployed().then(function(instance) {
      certI = instance;
      return certI.certificados(1);
    }).then(function(certificado) {
      assert.equal(certificado[0], 1, "contains the correct id");
      assert.equal(certificado[1], "did:tel:3,253#QmUJtBJ3qmjh9sPQKbPEZ2HMeZ46XXDNXjseSyAodwzry3", "contains the correct name");
      assert.equal(certificado[2], 0, "contains the correct univ count");
    });
  });
});