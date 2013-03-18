require("utils");

// product that contains multiple sizes and a single color option for size select option[value="7/8D"]
// var url = 'http://www.neimanmarcus.com/p/Prada-Wing-Tip-Chelsea-Boot-Boots/prod146820012_cat6750735__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat6750735%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod146820012&cmCat=product';
// var option_value = "7/8D";

// capture a snapshot
picit = (function (filename) {
  filename = 'screen_caps/' + filename + '.png' || 'screen_caps/results.png';
  casper.test.comment('Cheeeeeeese!');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 1024,
    height: 1024
  });
});

// test whether any error messages popped up
testForm = (function () {
  return casper.then(function () {
    casper.waitFor(function () {
      return this.evaluate(function () {
        return document.querySelectorAll('table.coErrorMessageClass').length;
      });
    },
    function () {
      casper.test.comment('Error present:');
      casper.test.comment(this.evaluate(function () {
        return $('table.coErrorMessageClass td.text').text();
      }));
      picit();
      casper.test.comment('Exiting...');
      casper.exit(1);
    },
    function () {
      casper.test.comment('timed out - no error messages');
    });
  });
});

casper = require('casper').create({
  clientScripts: ["jquery-1.8.3.min.js"],
  onAlert: function () {
    casper.test.comment('an alert was triggered');  // this is used to test whether a size/color combo was actually chosen
  }
});

casper.on('remote.message', function(msg) {
    this.echo('from within remote page DOM' + msg);
});

// order from workflow
var order = JSON.parse(casper.cli.args);

casper.test.comment('Order received! Id: ' + order.id + ' item count: ' + order.line_items.length);
//TODO: validate order or is the validation in the controller enough?

for (var i = 0; i < order.line_items.length; i++) {

  var item = order.line_items[i];
  var lineItemId = order.line_items[i].line_item_id;
  var url = item.affiliate_url;

  casper.test.comment('item url: ' + url);

  casper.start(url, function () {
    casper.test.assertExists('#topAddToCartButton', 'add to cart button exists');
  });

  if(item.size) {

    casper.test.comment('item size: ' + item.size);

    // Select size option
    casper.then(function () {
      casper.test.assertExists('.lineItemOptionSelect select:nth-of-type(1) option[value="' + item.size + '"]', 'select option[value="' + item.size + '"] exists');
      this.evaluate(function (_option) {
        var $select = $('.lineItemOptionSelect select:nth-of-type(1)');
        $select.val(_option);
        $select.change();
      }, { _option : item.size });
    });
  }
  // check if item is in stock at particular size
  casper.then(function () {
    casper.waitForResource('prod_stock1.gif',
    function () {
      casper.test.comment('product is in stock!');
    },
    function () {
      casper.test.comment('timed out, product is either out of stock or a color needs to be selected');

      casper.test.assertExists('.lineItemOptionSelect select:nth-of-type(2) option[value="BLACK"]', 'select option[value="BLACK"] exists');
      this.evaluate(function () {
        var $select = $('.lineItemOptionSelect select:nth-of-type(2)');
        var _option = 'BLACK';
        $select.val(_option);
        $select.change();
      });

      casper.waitForResource('prod_stock1.gif',
      function () {
        casper.test.comment('product is in stock!');
      },
      function () {
        casper.test.comment('Timed out.  Exiting.');
        picit();
        casper.exit(1);
      });

    });
  });

  // add to cart
  casper.then(function () {
    casper.click('#topAddToCartButton');
  });

}

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
    casper.test.comment('timed out waiting for checkout link');
    this.exit(1);
  });
});

// click into checkout
casper.then(function () {
  casper.click('a[href="https://www.neimanmarcus.com/checkout.jsp?perCatId=&catqo=&co=true"]');
});

// make sure the anonCheckout button is there
casper.then(function () {
  casper.test.assertExists('#anonSignInBtn', 'Can anonymously check out');
  casper.click('#anonSignInBtn');
});

//check for samples pop-up
casper.then(function () {

  if(this.exists('#samplesNoButton')) {
    picit(order.id + '-' + lineItemId + 'samples-before');
    casper.click('#samplesNoButton');
    casper.test.comment('Samples pop-up appeared');
  } else {
    casper.test.comment('No samples pop-up');
  }
    picit(order.id + '-' + lineItemId + 'samples-after');
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
    casper.test.comment('timed out waiting for shipping form');
    this.exit(1);
  });
});

// start filling out the shipping form
casper.then(function () {

  //casper.test.assertExists('select#saTitleCode_se', 'Title select exists');
  //casper.test.assertExists('input#saFirstName_se', 'First Name input field exists');
  //casper.test.assertExists('input#saLastName_se', 'Last Name input field exists');
  //casper.test.assertExists('select#country_se', 'Country select exists');
  //casper.test.assertExists('input#saAddressLine1_se', 'Address Line 1 input field exists');
  //casper.test.assertExists('input#saAddressLine2_se', 'Address Line 2 input field exists');
  //casper.test.assertExists('input#saCity_se', 'City input field exists');
  casper.test.assertExists('select#state_se', 'State select exists');
  //casper.test.assertExists('input#saZip_se', 'Zip input field exists');
  //casper.test.assertExists('select#saPhoneType_se', 'Phone Type select exists');
  //casper.test.assertExists('input#saDayTelephone_se', 'Phone input exists');
  //casper.test.assertExists('input#addr_po_true_se', 'Use as POBox radio exists');
  //casper.test.assertExists('input#addr_po_false_se', 'Do not use as POBox radio exists');
  //casper.test.assertExists('input#useAsBillingFlag_se', 'Use As Billing checkbox exists');

  var sa = order.shipping_address;

  // this.evaluate(function(shipping_state) {
  //     document.querySelector('#state_se').value = shipping_state;
  // }, sa.short_state);

  // this.evaluate(function () {
  //   var $select = $('select#saTitleCode_se');
  //   var _option = 'F';
  //   // select Dr
  //   $select.val(_option);
  //   $select.change();
  // });

  // casper.test.comment('SHIPPING STATE: ' + sa.short_state.toString());

  this.evaluate(function () {
    var $select = $('select#country_se');
    var _option = 'US';
    $select.val(_option);
    $select.change();
  });

  this.evaluate(function () {
    var $select = $('select#state_se');
    var _option = sa.short_state;
    $select.val(_option);
    $select.change();
  });

  picit(order.id + '-' + lineItemId + 'sa-short-state');

  this.evaluate(function () {

    var $select = $('select#saPhoneType_se');
    var _option = sa.phone;
    // select other
    $select.val(_option);
    $select.change();
  });

  this.evaluate(function () {
    var $select = $('select.shippingmethod');
    var _option = 'SL3';
    // ship via standard
    $select.val(_option);
    $select.change();
  });

  var formValues = {
    'input#saFirstName_se' : sa.first_name,
    'input#saLastName_se' : sa.last_name,
    'input#saAddressLine1_se' : sa.street1,
    'input#saAddressLine2_se' : sa.street2,
    'input#saCity_se' : sa.city,
    'input#saZip_se' : sa.postal_code,
    'input#saDayTelephone_se' : sa.phone
  };

  // This is for situations where form inputs have no name attribute
  this.evaluate(function (fields) {
    for (var selector in fields) {
      document.querySelector(selector).value = fields[selector];
    }
  }, { fields : formValues });

  casper.then(function () {

    if(this.exists('#saDeliveryTelephone_se')) {

      var optionalFormValues = {
        'input#saDeliveryTelephone_se' : sa.phone
      };

      this.evaluate(function (fields) {
        for (var selector in fields) {
          document.querySelector(selector).value = fields[selector];
        }
      }, { fields : optionalFormValues });

      picit(order.id + '-' + lineItemId + 'optional-delivery-phone');

      casper.test.comment('Optional delivery telephone.');

    } else {
      casper.test.comment('Optional delivery telephone not needed.');
    }
  });

  // Fill in that one radio selection
  this.fill('form#shippingForm_se', {
    'poBox' : 'false'
  }, false);

  // Check/uncheck useAsBillingFlag_se
  this.evaluate(function () {
    document.querySelector('#useAsBillingFlag_se').checked = false;
  });

});

// click NEXT step
casper.then(function () {
  casper.test.assertExists('span#shippingContinue_se', 'Continue to next step button exists');

  casper.wait(2000, function () {
    casper.click('span#shippingContinue_se');
  });

});

testForm();

// check for billing form
casper.then(function () {
  casper.waitFor(function () {
    return this.evaluate(function () {
      return document.querySelectorAll('form#billingForm').length;
    });
  },
  function () {
    casper.test.comment('Billing form present, begin filling it out!');
  },
  function () {
    casper.test.comment('Timed out, no billing form present, exiting...');
    picit(order.id + '-' + lineItemId + 'no-billing-form');
    casper.exit(1);
  });
});

casper.then(function () {
  // test each of the fields
  //casper.test.assertExists('input#emailAddress', 'Email Address input exists');
  //casper.test.assertExists('select#billingAddrTitle', 'Title select exists');
  //casper.test.assertExists('input#billingAddrFirstName', 'First name input exists');
  //casper.test.assertExists('input#billingAddrLastName', 'Last name input exists');
  //casper.test.assertExists('select#billingAddrCountry', 'Country select exists');
  //casper.test.assertExists('input#billingAddrLine1', 'Address line 1 exists');
  //casper.test.assertExists('input#billingAddrLine2', 'Address line 2 exists');
  //casper.test.assertExists('input#billingAddrCity', 'City input exists');
  //casper.test.assertExists('select#billingAddrState', 'State select exists');
  //casper.test.assertExists('input#billingAddrZipCode', 'Zip Code input exists');
  //casper.test.assertExists('select#billingAddrPhoneType', 'Phone type select exists');
  //casper.test.assertExists('input#billingAddrDayPhone', 'Day phone input exists');
  //casper.test.assertExists('select#cardtype', 'Card type select exists');
  //casper.test.assertExists('input#cardnumber', 'Card number input exists');
  //casper.test.assertExists('input#securitycode', 'Security code input exists');
  //casper.test.assertExists('input#cardExpMonth', 'Card expiration month input exists');
  //casper.test.assertExists('input#cardExpYear', 'Card expiration year input exists');

  var ba = order.billing_address;
  var pi = order.payment;

  this.evaluate(function () {
    var $select = $('select#bilingAddrTitle');
    var _option = 'F';
    // select Dr
    $select.val(_option);
    $select.change();
  });
  this.evaluate(function () {
    var $select = $('select#billingAddrCountry');
    var _option = 'US';
    // select US
    $select.val(_option);
    $select.change();
  });
  this.evaluate(function () {
    var $select = $('select#billingAddrState');
    var _option = ba.short_state;
    // select NY
    $select.val(_option);
    $select.change();
  });
  picit(order.id + '-' + lineItemId + 'ba-short-state');
  this.evaluate(function () {
    var $select = $('select#billingAddrPhoneType');
    var _option = ba.phone;
    // select other
    $select.val(_option);
    $select.change();
  });
  this.evaluate(function () {
    var $select = $('select#cardtype');
    var _option = pi.card_type;
    $select.val(_option);
    $select.change();
  });

  var formValues = {
    'input#emailAddress' : ba.email,
    'input#billingAddrFirstName' : ba.first_name,
    'input#billingAddrLastName' : ba.last_name,
    'input#billingAddrLine1' : ba.street1,
    'input#billingAddrLine2' : ba.street2,
    'input#billingAddrCity' : ba.city,
    'input#billingAddrZipCode' : ba.postal_code,
    'input#billingAddrDayPhone' : ba.phone,
    'input#cardnumber' : pi.card_number,
    'input#securitycode' : pi.cvv,
    'input#cardExpMonth' : pi.expiry_month,
    'input#cardExpYear' : pi.expiry_year
  };

  // This is for situations where form inputs have no name attribute
  this.evaluate(function (fields) {
    for (var selector in fields) {
      document.querySelector(selector).value = fields[selector];
    }
  }, { fields : formValues });

});

// click next to review
casper.then(function () {
  casper.test.assertExists('span#paymentSave', 'Save payment button exists');

  casper.wait(2000, function () {
    casper.click('span#paymentSave');
  });
});

// test to see if any errors popped
testForm();

// confirm address
casper.then(function () {
  casper.waitFor(function (){
    return this.evaluate(function () {
      return document.querySelector('#avAddressList form').length;
    });
  },
  function (){
    casper.test.comment('Need to verify address');
    casper.click('span#verificationButton');
  },
  function (){
    casper.test.comment('No need to verify address');
  });
});

casper.then(function () {
  casper.wait(2000, function () {
    picit(order.id);  // take a snapshot right before exit
    casper.exit(0);
  });
});

casper.run();