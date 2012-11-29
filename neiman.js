// product that contains multiple sizes and multiple colors for size select option[value="38.5B/8.5B"]
//var url = 'http://www.neimanmarcus.com/p/Yves-Saint-Laurent-Patent-Leather-Pointed-Toe-Pump-Pumps/prod146820188_cat39980735__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat39980735%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod146820188&cmCat=product';

// product that contains multiple sizes and a single color option for size select option[value="6.5/7.5D"]
var url = 'http://www.neimanmarcus.com/p/Prada-Wing-Tip-Chelsea-Boot-Boots/prod146820012_cat6750735__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat6750735%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod146820012&cmCat=product';

casper = require('casper').create({
  //verbose: true,
  //logLevel: "debug",
  clientScripts: ["jquery-1.8.3.min.js"],
  onAlert: function () {
    casper.test.comment('an alert was triggered');  // this is used to test whether a size/color combo was actually chosen
  }
});

casper.start(url, function () {
  casper.test.assertExists('#topAddToCartButton', 'add to cart button exists');
});

casper.then(function () {
  casper.test.assertExists('.lineItemOptionSelect select:nth-of-type(1) option[value="6.5/7.5D"]', 'select option[value="6.5/7.5D"]');
  this.evaluate(function () {
    var $select = $('.lineItemOptionSelect select:nth-of-type(1)');
    var _option = '6.5/7.5D';
    $select.val(_option);
    $select.change();
  });
});

// check if item is in stock at particular size
casper.then(function () { // casper.then() not necessary, still works successfully going to keep the casper.then() more for educational purposes
  casper.waitFor(function () {
    return this.evaluate(function () {
      return document.querySelectorAll('.prodStatus img[src="/category/images/prod_stock1.gif"]').length;
    });
  },
  function () {
    casper.test.comment('product is in stock!');
  },
  function () {
    casper.test.comment('timed out, product is either out of stock or a color needs to be selected');
    this.exit();
    // skipping this logic and going into adding to cart/checkout
  });
});

// add to cart
casper.then(function () {
  this.click('#topAddToCartButton');
});

// open cart and check for checkout button
casper.then(function () {
  casper.waitFor(function () {
    return this.evaluate(function () {
      return document.querySelectorAll('a[href="https://www.neimanmarcus.com/checkout.jsp?perCatId=&catqo=&co=true"]').length;
    });
  },
  function () {
    casper.test.comment('link to checkout visible');
  },
  function () {
    casper.test.comment('timed out');
    this.exit();
  });
});

// click into checkout
casper.then(function () {
  this.click('a[href="https://www.neimanmarcus.com/checkout.jsp?perCatId=&catqo=&co=true"]');
});

// make sure the anonCheckout button is there
// else it may have already signed in anonly
casper.then(function () {
  // this is failing?  could the anonSignInBtn need a .waitFor() or perhaps
  // another test in case directing immediately to shipping form
  casper.test.assertExists('#anonSignInBtn', 'Can anonymously check out');
  casper.click('#anonSignInBtn');
});

// check for shipping form
casper.then(function () {
  casper.waitFor(function () {
    return this.evaluate(function () {
      return document.querySelectorAll('#shippingForm_se').length;
    });
  },
  function () {
    casper.test.comment('Begin filling out shipping form');
  },
  function () {
    casper.test.comment('timed out');
    this.exit();
  });
});

// start filling out the shipping form
casper.then(function () {

  casper.test.assertExists('select#saTitleCode_se', 'Title select exists');
  casper.test.assertExists('input#saFirstName_se', 'First Name input field exists');
  casper.test.assertExists('input#saLastName_se', 'Last Name input field exists');
  casper.test.assertExists('select#country_se', 'Country select exists');
  casper.test.assertExists('input#saAddressLine1_se', 'Address Line 1 input field exists');
  casper.test.assertExists('input#saAddressLine2_se', 'Address Line 2 input field exists');
  casper.test.assertExists('input#saCity_se', 'City input field exists');
  casper.test.assertExists('select#state_se', 'State select exists');
  casper.test.assertExists('input#saZip_se', 'Zip input field exists');
  casper.test.assertExists('select#saPhoneType_se', 'Phone Type select exists');
  casper.test.assertExists('input#saDayTelephone_se', 'Phone input exists');
  casper.test.assertExists('input#addr_po_true_se', 'Use as POBox radio exists');
  casper.test.assertExists('input#addr_po_false_se', 'Do not use as POBox radio exists');
  casper.test.assertExists('input#useAsBillingFlag_se', 'Use As Billing checkbox exists');
  casper.test.assertExists('span#shippingContinue_se', 'Continue to next step button exists');

  // Select <select> <option>
  this.evaluate(function () {
    var $select = $('select#saTitleCode_se');
    var _option = 'F'; // need to create an array mapping for various titles to their option[value]
    // select Dr
    $select.val(_option);
    $select.change();
  });
  this.evaluate(function () {
    var $select = $('select#country_se');
    var _option = 'US'; // need to create an array mapping for various titles to their option[value]
    $select.val(_option);
    $select.change();
  });
  this.evaluate(function () {
    var $select = $('select#saPhoneType_se');
    var _option = 'O';
    // select other
    $select.val(_option);
    $select.change();
  });

  // fill out form but do not hit submit
  //this.fill('#shippingForm_se.shippingForm', {
  //  '#saFirstName_se' : 'Ed',
  //  '#saLastName_se' : 'Bast'
  //}, false);

});

// this is only takin a pic of page at initial rendering
// javascript changes are not showing up, however serves
// as a method to confirm that a new page has been opened
casper.then(function () {
  casper.test.comment('Cheeeeeeese!');
  this.capture('results.png', {
    top: 0,
    left: 0,
    width: 1024,
    height: 1024
  });
});

// beginning to hang sometimes, see if this can force an exit
casper.then(function () {
  casper.exit();
});

casper.run(function () {
  this.test.renderResults(true);
});