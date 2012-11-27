// product that contains multiple sizes and multiple colors for size select option[value="38.5B/8.5B"]
//var url = 'http://www.neimanmarcus.com/p/Yves-Saint-Laurent-Patent-Leather-Pointed-Toe-Pump-Pumps/prod146820188_cat39980735__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat39980735%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod146820188&cmCat=product';

// product that contains multiple sizes and a single color option for size select option[value="6.5/7.5D"]
var url = 'http://www.neimanmarcus.com/p/Prada-Wing-Tip-Chelsea-Boot-Boots/prod146820012_cat6750735__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat6750735%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod146820012&cmCat=product';

casper = require('casper').create({
  //verbose: true,
  //logLevel: "debug",
  onAlert: function () {
    this.echo('an alert was triggered');  // this is used to test whether a size/color combo was actually chosen
  }
});

casper.start(url, function () {
  casper.test.assertExists('#topAddToCartButton', 'add to cart button exists');

  //console.log(document.querySelectorAll('.lineItemOptionSelect select:nth-of-type(1) option:nth-of-type(1)').getAttribute('value'));

});

casper.then(function () {
  casper.test.assertExists('.lineItemOptionSelect select:nth-of-type(1) option:nth-of-type(3)', 'select option(3) exists');
  //this.echo(document.querySelectorAll('.lineItemOptionSelect select:nth-of-type(1) option:nth-of-type(3)').getAttribute('value'));
  this.echo(document.querySelectorAll('.lineItemOptionSelect select:nth-of-type(1) option:nth-of-type(3)')[0].getAttribute('value'));  // works in inspector, doesn't here - something wrong with page load
});


casper.then(function () {
  this.click('.lineItemOptionSelect select:nth-of-type(1) option:nth-of-type(2)');
  this.mouseEvent('click', '.lineItemOptionSelect select:nth-of-type(1) option:nth-of-type(2)');  // hoping this triggers onchange attribute
  //document.querySelectorAll('.lineItemOptionSelect select:nth-of-type(1)').onchange();

  casper.waitFor(function () {
    return this.evaluate(function () {
      return document.querySelectorAll('.prodStatus img[src="/category/images/prod_stock1.gif"]')[0].length;
    });
  },
  function () {
    //this.echo(document.querySelectorAll('.prodStatus img')[0]);
    this.echo('image is present!');
  },
  function () {
    //this.echo(document.querySelectorAll('.prodStatus img')[0]);
    this.echo('timed out');
  });
});

// this is only takin a pic of page at initial rendering
// javascript changes are not showing up, however serves
// as a method to confirm that a new page has been opened
casper.then(function () {
  this.capture('results.png', {
    top: 0,
    left: 0,
    width: 1024,
    height: 1024
  });
});

casper.run(function () {
  this.test.renderResults(true);
});