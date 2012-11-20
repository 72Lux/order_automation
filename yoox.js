

var url = 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&subid=&offerid=119970.1&type=10&tmpid=2678&RD_PARM1=http%3a%2f%2fwww.yoox.com%2fitem.asp%3fcod10%3d34017181%26tskay%3d3FD17CD7';

var casper = require('casper').create();

casper.start(url, function() {
  casper.test.assertExists('#addToCart', 'the button exists');
});

casper.then(function() {
    // Click to add to shopping bag
    this.click('#addToCart');
});

casper.then(function() {
    console.log('Added to cart ok, new location is ' + this.getCurrentUrl());
});

casper.then(function() {
        this.clickLabel('Procees to purchase', 'a');

//    casper.test.assertExists('#ctl00_mainContentPlaceHolder_shoppingBagTotals_proceedToCheckoutButton2Panel > a', 'the checkout buttons exists');
});

// casper.then(function() {
//     // Click to add to proceed to checkout
//     this.click('#ctl00_mainContentPlaceHolder_shoppingBagTotals_proceedToCheckoutButton2Panel > a');
// });

casper.then(function() {
    console.log('Proceeded to checkout ok, new location is ' + this.getCurrentUrl());
});



casper.run(function() {
    // echo results in some pretty fashion
    this.exit();
});