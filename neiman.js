// contains a select for size
// will need one for color
var url = 'http://www.neimanmarcus.com/p/Yves-Saint-Laurent-Patent-Leather-Pointed-Toe-Pump-Pumps/prod146820188_cat39980735__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat39980735%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod146820188&cmCat=product';
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

// STEP 1: Select the size and assert that the item is in stock
casper.then(function () {
  this.click('.lineItemOptionSelect select:nth-of-type(1) option[value="38.5B/8.5B"]');
}).waitFor(function checkSizeAvailability () {
  return this.evaluate(function () {
    return document.querySelectorAll('.prodStatus img[src="/category/images/prod_stock1.gif"]').length || document.querySelectorAll('.lineItemOptionSelect select:nth-of-type(1) option').length > 1;
  });
}, function then () {
  casper.test.assertExists('.prodStatus img[src="/category/images/prod_stock1.gif"]','Product is in stock at the indicated size!');
}, function timeout () {
  this.echo('timed out');

  // this shouldn't be here, because when a size is chosen
  // then a color is 'selected' and THEN the inventory test
  // is performed.
  casper.test.assertExists('.prodStatus img[src="/common/images/shim.gif"]','Product does not appear in stock at that size');
});

// STEP 2: Select the color and assert that the item is in stock
//casper.then(function () {
//  this.click('.lineItemOptionSelect select:nth-of-type(2) option[value="BLACK"]');
//}).waitFor(function checkColorAvailability () {
//  return this.evaluate(function () {
//    return document.querySelectorAll('.prodStatus img[src="/category/images/prod_stock1.gif"]').length;
//  });
//}, function then () {
//  casper.test.assertExists('.prodStatus img[src="/category/images/prod_stock1.gif"]','Product is in stock at the indicated size AND color!');
//}, function timeout () {
//  this.echo('timed out');
//});

// STEP 3: Check if that shim is still there (it shouldn't if in stock)
casper.then(function () {
  casper.test.assertExists('.prodStatus img[src="/common/images/shim.gif"]','Product does not appear in stock');
});

casper.run(function () {
  this.test.renderResults(true);
});