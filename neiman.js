var url = 'http://www.neimanmarcus.com/p/Yves-Saint-Laurent-Patent-Leather-Pointed-Toe-Pump-Pumps/prod146820188_cat39980735__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat39980735%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod146820188&cmCat=product';
casper = require('casper').create({
  //verbose: true,
  //logLevel: "debug"
});

casper.start(url, function () {
  casper.test.assertExists('#topAddToCartButton');
});

// STEP 1: Size & Color
// NOTE: Need to add select color given a SINGLE size
casper.then(function () {
  this.click('.lineItemOptionSelect select:nth-of-type(1) option[value="38.5B/8.5B"]');
});
casper.waitFor(function checkColorsForSize () {
  return this.evaluate(function () {
    return document.querySelectorAll('.lineItemOptionSelect select:nth-of-type(2) option').length > 1;
  });
}, function then () {
  // in stock in that size and there are multiple colors available
  this.click('.lineItemOptionSelect select:nth-of-type(2) option[value="BLACK"]');
  casper.waitFor(function checkStockForColor () {
    return this.evaluate(function () {
      return document.querySelectorAll('.prodStatus img[src="/category/images/prod_stock1.gif"]').length;
    });
  }, function then () {
    casper.test.assertExists('.prodStatus img[src="/category/images/prod_stock1.gif"]','Product is in stock at selected size and color!');
  }, function timeout () {
    this.echo('done-zo, no products available');
  });
}, function timeout () {
  // in stock in that size, no other color options
  casper.test.assertExists('.prodStatus img[src="/category/images/prod_stock1.gif"]','Product is in stock with no other color choices!');
});

casper.run(function () {
  this.test.renderResults(true);
});