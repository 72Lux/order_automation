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
  casper.test.assertExists('#topAddToCartButton');
});

// select size first
casper.then(function () {
  // this isn't properly selecting the option we want
  this.click('.lineItemOptionSelect select:nth-of-type(1) option[value="6.5/7.5D"]');
});

// did the 'in stock' icon pop up?
casper.waitFor(function () {
  return this.evaluate(function () {
    return document.querySelectorAll('.prodStatus img[src="/category/images/prod_stock1.gif"]') > 0;
  });
}, function then () {
  this.echo('product available in that size');

  this.click('#topAddToCartButton');
  // testing for an alert whether item is being added - and it isn't


}, function timeout () {
  this.echo('not available, may need to select a color');
});

// do we now have a single item in the shopping cart?
// (warning: should pop true if something already existed in cart)
casper.waitFor(function () {
  return this.evaluate(function () {
    // element is created when a product is placed into the shopping bag
    return document.querySelectorAll('.itemsincart').length > 0;
  });
}, function then () {
  this.echo('added to cart');
  // click and open the shopping cart
  casper.then(function () {
    this.click('a[href="#mycart"]');
  })
}, function timeout () {
  this.echo('was not added to cart');
  this.exit();
});



// NEXT PHASE, Still resolving add to bag issue

// go to checkout page
casper.thenOpen('https://www.neimanmarcus.com/checkout.jsp?perCatId=&catqo=&co=true');

// need to wait for button to render
casper.waitFor(function () {
  return this.evaluate(function () {
    return document.querySelectorAll('#anonSignInBtn') > 0;
  });
}, function then () {
  // make sure you are at the checkout page
  // check for the 'checkout as anon button'
  casper.test.assertExists('#anonSignInBtn');

}, function timeout () {
  this.echo('waitFor() timed out before a#anonSignInBtn was able to render');
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

// select color
//casper.then(function () {
//  this.click('.lineItemOptionSelect select:nth-of-type(2) option[value="BLACK"]');
//  // check if item is in stock, if not then check for colors
//  casper.waitFor(function checkForSizeAvailability () {
//    return this.evaluate(function () {
//      return document.querySelectorAll('.prodStatus img[src="/category/images/prod_stock1.gif"]').length;
//    });
//  }, function then () {
//    this.echo('product available in that size and color');
//  }, function timeout () {
//    this.echo('dont know whats going on');
//  });
//});

casper.run(function () {
  this.test.renderResults(true);
});