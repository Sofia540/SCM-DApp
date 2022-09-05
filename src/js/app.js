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
    $.getJSON("Universidades.json", function(universidades) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Universidades = TruffleContract(universidades);
      // Connect provider to interact with contract
      App.contracts.Universidades.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var univI;
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
    App.contracts.Universidades.deployed().then(function(instance) {
      univI = instance;
      return univI.contadorUniv();
    }).then(function(contadorUniv) {
      var listauniversidades = $("#listauniversidades");
      listauniversidades.empty();
      for (var i = 1; i <= contadorUniv; i++) {
        univI.universidades(i).then(function(universidad) {
          var id = universidad[0];
          var name = universidad[1];
          var dir = universidad[2];
          var estado = universidad[3];

          if (estado == "ALTA") {
            // Render candidate Result
          var univTemplate = "<tr><th class='text-center' style='font-size: larger;'>" + id + "</th><td class='text-center' style='font-size: larger;'>" + name + "</td><td class='text-center' style='font-size: larger;'>" + dir + "</td><td class='text-center' style='font-size: larger;'>" + estado + "</td><td class='text-center' style='font-size: larger;'> <button onclick='App.darBaja("+ id +")'> Dar de baja </button> </td></tr>"
          }
          else{
            var univTemplate = "<tr><th class='text-center' style='font-size: larger;'>" + id + "</th><td class='text-center' style='font-size: larger;'>" + name + "</td><td class='text-center' style='font-size: larger;'>" + dir + "</td><td class='text-center' style='font-size: larger;'>" + estado + "</td><td class='text-center' style='font-size: larger;'> <button onclick='App.darAlta("+ id +")'> Dar de alta </button> </td></tr>"
          }
          listauniversidades.append(univTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  darAlta: function(aux) {
    App.contracts.Universidades.deployed().then(function(instance) {
      return instance.darAlta(aux, { from: App.account });
    }).then(function(result) {
      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  },

  darBaja: function(aux) {
    App.contracts.Universidades.deployed().then(function(instance) {
      return instance.darBaja(aux, { from: App.account });
    }).then(function(result) {
      App.render();
    }).catch(function(err) {
      console.error(err);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});