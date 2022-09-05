App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
    //getting Permission to access. This is for when the user has new MetaMask
      window.ethereum.enable();
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);

    }else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
      web3 = new Web3(window.web3.currentProvider);
    // Acccounts always exposed. This is those who have old version of MetaMask

    } else {
    // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Certificados.json", function(certificados) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Certificados = TruffleContract(certificados);
      // Connect provider to interact with contract
      App.contracts.Certificados.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var certI;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Tu dirección de billetera: " + account);
      }
    });

    // Load contract data
    App.contracts.Certificados.deployed().then(function(instance) {
      certI = instance;
      return certI.contadorCert();
    }).then(function(contadorCert) {
      var valdiv = $("#validacion");
      
      valdiv.replaceWith("<form onsubmit='App.valCert();return false;'><label for='did' style='font-size: 25px; text-align: left;'>DID certificado:</label><input type='text' id='did' name='did' pattern='[a-zA-Z0-9._%+-=]+#[a-zA-Z0-9._%+-=]{2,}$' value='did:tel:' required>&nbsp;<label for='hash' style='font-size: 25px; text-align: left;'>Hash IPFS:</label><input type='text' id='hash' name='hash' required><hr/><input type='submit' style='font-size: 20px;' value='Validar'></form>");

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  validado: function(cidCert) { 

    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    var cosas = $("#cosas");
    cosas.replaceWith("<div><h2>Certificado validado, puede proceder a visualizarlo introduciendo el CID: "+cidCert+" de IPFS.</h2></hr><a href='index.html' style='vertical-align: text-top;font-size: 20px;'>Inicio</a></div>");

  },

  noValidado: function(cidCert) { 

    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    var cosas = $("#cosas");
    cosas.replaceWith("<div><h2>Certificado no validado, por favor compruebe que todo es correcto y vuelva a intentarlo.</h2></hr><a href='index.html' style='vertical-align: text-top;font-size: 20px;'>Inicio</a></div>");

  },




  comprobarCert: function(clavePub, hashIPFS, firma) {

    let hash2 = hashIPFS.split(" ").join("");

    let hash1 = hash2.toUpperCase();

    let charCodeArr = [];

    for(let i = 0; i < hash1.length; i++){
      let code = hash1.charCodeAt(i);
      charCodeArr.push(code);
    }

    let [aux1,aux2] = clavePub.split(",");

    let expP = parseInt(aux1);
    let modP = parseInt(aux2);

    let letrasDes = [];

    let aux = 0;

    let indF = "";

    for (var i = 0; i < firma.length; i++) {

      indF = App.expModRapida(firma[i],expP,modP);

      letrasDes.push(indF);

    }

    console.log(letrasDes);

    console.log(charCodeArr);
    
    if (JSON.stringify(letrasDes)==JSON.stringify(charCodeArr)) {
      return true;
    }
    else{
      return false;
    }

    
  },

  valCert: async function() { 

    let instance = await App.contracts.Certificados.deployed();

    let contadorCert = await instance.contadorCert();

    var didInt = document.getElementById('did').value;
    var hashIPFS = document.getElementById('hash').value;
    var flagExiste = false;
    var firmaCert = "";
    var result = false;

    for (var i = 1; i <= contadorCert; i++) {
      let certificado = await instance.certificados(i);
      if (didInt == certificado[1]) {
        firmaCert = await instance.getFirma(i);
        flagExiste = true;
        break;
      } 
    }

    let [clavePub,CID] = didInt.substring(8).split('#');

    // Con librería node-rsa
    /*
    const NodeRSA = require('node-rsa');
    const decryptionKey = new NodeRSA(clavePub);
    decryptionKey.setOptions({signingScheme: 'pkcs1-sha1'});

    let result = decryptionKey.verify(hashIPFS, firmaCert);
    */

    // Con algoritmo simple RSA

    if (flagExiste) {
      result = await App.comprobarCert(clavePub, hashIPFS, firmaCert);
    }
    else{
      result = false;
    }

    if (result) {
      App.validado(CID);
    }
    else{
      App.noValidado();
    }
  },

  expModRapida: function(a, b, n){
    a = a % n;
    var result = 1;
    var x = a;

    while(b > 0){
      var leastSignificantBit = b % 2;
      b = Math.floor(b / 2);

      if (leastSignificantBit == 1) {
        result = result * x;
        result = result % n;
      }

      x = x * x;
      x = x % n;
    }
    return result;
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});