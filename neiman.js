// contains a select for size
// will need one for color
var url = 'http://www.neimanmarcus.com/p/Ferragamo-Reversible-Leather-Belt-Black-Brown/prod154930114_cat13230731__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.service%253FitemId%253Dcat13230731%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod154930114&cmCat=product';
casper = require('casper').create({
  //verbose: true,
  //logLevel: "debug"
});

// initial test whether can even add to cart
// although you can't add to cart until size
// and color and chosen
casper.start(url, function () {
  casper.test.assertExists('#topAddToCartButton');
});

// select the size and assert that item is in stock
casper.then(function () {
  this.click('.lineItemOptionSelect select:nth-of-type(1)');
}).waitFor();

// get something here to make sure the select options are there

casper.then(function () {
  this.click('.lineItemOptionSelect select:nth-of-type(1) option[value="34"]')
}).waitFor(function checkSizeAvailability () {
  return this.evaluate(function () {
    return document.querySelectorAll('.prodStatus img[src="/category/images/prod_stock1.gif"]').length;
  });
}, function then () {
  casper.test.assertExists('.prodStatus img[src="/category/images/prod_stock1.gif"]');
}, function timeout () {
  this.echo('timed out/out of stock');
  casper.test.assertExists('.prodStatus img[src="/common/images/shim.gif"]');
});



casper.run(function () {
  this.test.renderResults(true);
});