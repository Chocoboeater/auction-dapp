App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
         App.web3Provider = web3.currentProvider
         web3 = new Web3(App.web3Provider);
     } else {
         App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545")
         web3 = new Web3(App.web3Provider);
     }
     console.log("init web3");
     return App.initContract();
  },

  initContract: function() {
    $.getJSON('SimpleAuction.json', function(data){
      App.contracts.SimpleAuction = TruffleContract(data);
      App.contracts.SimpleAuction.setProvider(App.web3Provider);
      App.startAuction();
      App.getInfo();
      // App.watchChanged();
      App.checkEvents();
      App.bidEvents();
      App.takeEvents();
      App.finishEvents();
    });

  },

  startAuction: function() {
    console.log("start Auction");
    $("#startBtn").click(function() {
        $("#loader").show();
        App.contracts.SimpleAuction.deployed().then(function(instance) {
          return instance.setSimpleAuction($("#name").val(), {gas: 5000000});
        }).then(function(result) {
          console.log("start" + result);
          return App.getInfo();
        } ).catch(function(err) {
          console.error(err);
        });
      });
  /*
    App.contracts.SimpleAuction.deployed().then(function(instance) {
      return instance.setSimpleAuction();
    }).then(function(result) {
      console.log("start" + result);
    }).catch(function(err) {
      console.error(err);
    });
    */
  },



  getInfo: function() {
    console.log("getinfo");
    App.contracts.SimpleAuction.deployed().then(function(instance) {
      return instance.checkInfo.call();
    }).then(function(result) {
      console.log("Lot: " + result[0] + " Time left:  " + result[1]);
      $("#loader").hide();
      $("#info").html("Lot: " + result[0]);
      $("#details").html("Index: " + result[2] + "   Time left:  " + result[1] + "   HighestBid:  " + result[3]);
      console.log(result);
    }).catch(function(err) {
      $("#loader").hide();
      console.error(err);
    });
  },

  checkEvents: function() {
    console.log("button check");
    $("#checkBtn").click(function() {
        $("#loader").show();
        console.log("check button");
        App.contracts.SimpleAuction.deployed().then(function(instance) {
          console.log(instance);
          return instance.changeNow({gas: 600000});
        }).then(function(result) {
          return App.getInfo();
        }).catch(function(err) {
          $("#loader").hide();
          console.error(err);
        });
      });
  },

  findOwner: function() {
    console.log("find");
    App.contracts.SimpleAuction.deployed().then(function(instance) {
      var inp = window.prompt();
      return instance.checkToken.call(inp);
    }).then(function(result) {
      console.log(result);
    }).catch(function(err) {
      console.error(err);
    });
  },

  bidEvents: function() {
    console.log("want to bid");
    $("#bidBtn").click(function() {
        $("#loader").show();
        console.log("bid button");
        App.contracts.SimpleAuction.deployed().then(function(instance) {
          return instance.bid({gas: 700000, value: ($("#price").val())});
        }).then(function(result) {
          return App.getInfo();
        } ).catch(function(err) {
          $("#loader").hide();
          console.log("bid failed");
          console.error(err);
        });
      });
  },

  takeEvents: function() {
    console.log("want to take my money back");
    $("#takeMoneyBtn").click(function() {
        $("#loader").show();
        console.log("money button");
        App.contracts.SimpleAuction.deployed().then(function(instance) {
          return instance.withdraw({gas: 800000});
        }).then(function(result) {
          return App.getInfo();
        } ).catch(function(err) {
          $("#loader").hide();
          console.log("take money failed");
          console.error(err);
        });
      });
  },

  finishEvents: function() {
    console.log("want to finish this auction");
    $("#finishBtn").click(function() {
        $("#loader").show();
        console.log("finish button");
        App.contracts.SimpleAuction.deployed().then(function(instance) {
          return instance.auctionEnd({gas: 4000000});
        }).then(function(result) {
          return App.getInfo();
        } ).catch(function(err) {
          $("#loader").hide();
          console.log("finish failed");
          console.error(err);
        });
      });
  },
/*
  watchChanged: function() {
    console.log("watching you");
    App.contracts.SimpleAuction.deployed().then(function(instance) {
      var infoEvent = instance.LogUint();
      return infoEvent.watch(function(err, result) {
        if (!err) {
          $("#loader").hide();
          console.log("I see " + result.args.s + result.args.x);
          $("#info").html(result.args.s + result.args.x);
        }
        else {
          console.log(err);
        }
      });
    });
  }
*/
  }



$(function(){
  $(window).load(function() {
      App.init();
  });
});
