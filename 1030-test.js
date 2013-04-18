// to RUN, provide cookie file at cl :
// rm 1030-test.txt; casperjs --cookies-file=1030-test.txt 1030-test.js

require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = '/tmp/order_automation/' + filename + '.png';
  casper.test.comment('Cheeeeeeese!');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 480,
    height: 2000
  });
});

normalizeString = (function (s) {
  var r = s.toLowerCase();

  r = r.replace(new RegExp("\\s", 'g'), "");
  r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
  r = r.replace(new RegExp("æ", 'g'), "ae");
  r = r.replace(new RegExp("ç", 'g'), "c");
  r = r.replace(new RegExp("[èéêë]", 'g'), "e");
  r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
  r = r.replace(new RegExp("ñ", 'g'), "n");
  r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
  r = r.replace(new RegExp("œ", 'g'), "oe");
  r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
  r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
  r = r.replace(new RegExp("\\W", 'g'), "");

  return r;
});

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js"],
  verbose: false,
  logLevel: "debug"
});

// Nordstrom uses these numeric codes for the states dropdown.
var awesomeStateCodes = {AL : 73, AK : 16, AZ : 70, AR : 75, CA : 71, CO : 72, CT : 67, DE : 69, DC : 68, FL : 65, GA : 66, HI : 62, ID : 63, IL : 58, IN : 59, IA : 60, KS : 55, KY : 56, LA : 57, ME : 52, MD : 50, MA : 51, MI : 47, MN : 48, MS : 49, MO : 44, MT : 45, NE : 46, NV : 41, NH : 42, NJ : 43, NM : 38, NY : 39, NC : 40, ND : 35, OH : 36, OK : 37, OR : 32, PA : 34, RI : 30, SC : 31, SD : 26, TN : 27, TX : 28, UT : 23, VT : 24, VA : 25, WA : 21, WV : 22, WI : 17, WY : 18};

var order = {id: 'test-' + new Date().getTime()};

var lineItems = [];

var item0 = {
    name: "'Le Lipstique' LipColoring Stick with Brush",
    affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flancome-le-lipstique-lipcoloring-stick-with-brush%252F2786535',
    size: 'One Size',
    color: 'AMANDELLE',
    qty: 1
  };

lineItems.push(item0);

var item1 = {
    name: "'Le Lipstique' LipColoring Stick with Brush",
    affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flancome-le-lipstique-lipcoloring-stick-with-brush%252F2786535',
    size: 'One Size',
    color: 'BRONZELLE',
    qty: 1
  };

lineItems.push(item1);

var item2 = {
    name: "Classic Fit Heathered Pique Polo",
    affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flacoste-classic-fit-heathered-pique-polo%252F2907429',
    size: '7(xl)',
    color: 'ARGENT GREY',
    qty: 2
  };

lineItems.push(item2);

var item3 = {
    name: "'Tonique Douceur' Alcohol-Free Freshener (6.8 oz.)",
    affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flancome-tonique-douceur-alcohol-free-freshener-6-8-oz%252F2786742',
    size: '6.8 oz',
    color: '',
    qty: 2
  };

lineItems.push(item3);

// casper.test.comment('lineItem count BEFORE flattening: ' + lineItems.length);

var originalLineItemCount = lineItems.length;

for(var n = 0; n < lineItems.length; n++) {

  // casper.test.comment('qty: ' + lineItems[n].qty);

  var qty = lineItems[n].qty;
  if(qty > 1) {
    lineItems[n].qty = 1;
    for(var m = 0; m < qty-1; m++) {
      lineItems.push(lineItems[n]);
    }
  }
}

// casper.test.comment('lineItem count AFTER flattening: ' + lineItems.length);

// for(var n = 0; n < lineItems.length; n++) {
//   casper.test.comment('qty: ' + lineItems[n].qty);
// }

casper.start();

casper.then(function() {
  this.test.assert(lineItems.length === 6, 'Number of lineitems after flattening is 6.');
});

casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.each(lineItems, function(self, lineItem) {

  this.thenOpen(lineItem.affiliate_url, function() {

    casper.then(function() {
      this.test.assert(normalizeString(this.getTitle()).indexOf(normalizeString(lineItem.name)) >= 0, 'Item name [' + lineItem.name + '] found in page title');
    });
    // picit(order.id + '-before-anything');

    casper.waitForSelector('#buyButtonSubmit', function() {

      if (lineItem.size) {

        // casper.test.comment('Set size to: ' + lineItem.size);
        // casper.test.comment('length: ' + lineItem.size.length);

        casper.then(function() {

          isSizeAvailable = this.evaluate(function(size) {

                                            var result = false;

                                            $('#dimension1_1 a').each(function(index, value) {

                                              if($(this).attr('id').toLowerCase().indexOf(size.toLowerCase()) >= 0) {

                                                // check if color is available
                                                if(!$(this).hasClass('unavailable')) {
                                                  result = true;
                                                  return;
                                                }
                                              }
                                            });

                                            return result;

                                          }, lineItem.size);

        });

        casper.then(function() {
          // casper.test.comment('isSizeAvailable: ' + isSizeAvailable);
          this.test.assert(isSizeAvailable, 'Size [' + lineItem.size + '] available');
        });

        casper.then(function() {
          if(isSizeAvailable) {
              this.clickLabel(lineItem.size, 'a');
          } else {
            casper.test.comment('ERROR: OrderId: ' + order.id + '. The size unavailable: ' + lineItem.size + '. Exiting...');
            picit(order.id + '-32' + '-' + new Date().getTime());
            this.exit(32);
          }
        });

        casper.then(function() {
          var currentSize = this.evaluate(function() { return $('#dimension1_1 .selected').text(); });
          this.test.assert(normalizeString(lineItem.size) === normalizeString(currentSize), 'Size [' + currentSize + '] set successfully');
        });
        // casper.then(function() {
        //   picit(order.id +  '-' + new Date().getTime() +'-after-size-click');
        // });
      }

      if (lineItem.color) {

        // casper.test.comment('Set color to: ' + lineItem.color);

        // eg: beauty
        // process color

        casper.then(function() {

          isColorAvailable = this.evaluate(function(color) {

                                          var result = false;

                                          $('#dimension2_1 span').each(function() {

                                            // console.log('this text: ' + $(this).text());
                                            // console.log('color text: ' + color);

                                            if($(this).text().toLowerCase().indexOf(color.toLowerCase()) >= 0) {

                                              // console.log('found!');

                                              var _parent = $(this).closest('a');

                                              // check if color is available
                                              if(!_parent.hasClass('unavailable')) {

                                                // console.log('parent does not have unavailable');
                                                // console.log('value: ' + _parent.attr('value'));
                                                // color found, click it!
                                                //TODO: this click isn't working so setting value directly in hidden input.
                                                // _parent.click();
                                                // $('#selectedSku').val(_parent.attr('value'));
                                                // verify the
                                                // alter result based on how we set the sku
                                                // result = _parent.hasClass('selected');
                                                // result = $('#selectedSku').val();

                                                // console.log(result);
                                                result = true;
                                                return;
                                              }
                                              // else {
                                              //   console.log('parent has unavailable');
                                              // }

                                            }
                                            //  else {
                                            //   console.log('not found');
                                            // }
                                          });

                                          // the color was not found
                                          return result;

                                        }, lineItem.color);
        });

        casper.then(function() {
          // casper.test.comment('isColorAvailable: ' + isColorAvailable);
          this.test.assert(isColorAvailable, 'Color [' + lineItem.color + '] available');
        });

        casper.then(function() {
          if(isColorAvailable) {
              this.clickLabel(lineItem.color, 'span');
          } else {
            casper.test.comment('ERROR: OrderId: ' + order.id + '. The color unavailable: ' + lineItem.color + '. Exiting...');
            picit(order.id + '-32' + '-' + new Date().getTime());
            this.exit(32);
          }
        });

        casper.then(function() {
          var currentColor = this.evaluate(function() { return $('#dimension2_1 .selected').text(); });
          this.test.assert(normalizeString(lineItem.color) === normalizeString(currentColor), 'Color [' + currentColor + '] set successfully');
        });

        // casper.then(function() {
        //   picit(order.id +  '-' + new Date().getTime() +'-after-color-click');
        // });

      }

      // TODO set QUANTITIES
      // casper.then(function() {
      //   var itemNumber = this.fetchText('.item .sub');

      //   casper.test.comment('ITEM NUMBER: ' + itemNumber);
      // });

      casper.then(function() {
        this.click('#buyButtonSubmit');
      });

      casper.then(function() {
        this.test.assert(normalizeString(casper.fetchText('.title')).indexOf(normalizeString(lineItem.name)) >= 0, 'Item name [' + lineItem.name + '] found in shopping bag');
      });

    }, function() {

      casper.test.comment('Timed out waiting for add to bag button');
      picit(order.id + '-12' + '-' + new Date().getTime());
      this.exit(12);

    });

  });

});

casper.then(function() {
  this.wait(10000, function() {
    picit(order.id + '-' + new Date().getTime() + '-shopping-bag');
  });
});

casper.then(function() {
  var itemCount = this.evaluate(function() { return $('input[type="tel"][id ^=updateQty]').size(); });
  this.test.assert(originalLineItemCount === itemCount, 'Count of products added matches original lineItem count');
});

//CHECKOUT BEGIN

casper.then(function() {
  this.test.assertExists('#proceed-to-checkout', 'Checkout button is visible');
});

casper.then(function() {
  // casper.test.comment('Clicking on checkout');
  this.click('#proceed-to-checkout');
});

// casper.then(function() {
//   this.wait(10000, function() {
//     picit(new Date().getTime() + '-proceed-to-checkout');
//   });
// });

// NoThanksButton

casper.then(function () {
  casper.waitForSelector('#NoThanksButton', function () {

      // casper.test.comment('Samples screen appeared');
      casper.open('http://m.nordstrom.com//samples/nothanks', {
          method: 'post',
          data:   {
              'postaction': ''
          }
      });

    }, function() {
      // casper.test.comment('No samples screen');
    }, 30000);
});

// casper.then(function() {
//   this.wait(10000, function() {
//     picit(new Date().getTime() + '-after-no-thanks-checkout');
//   });
// });

// Continue to Checkout

casper.then(function() {
  this.test.assertTextExists('Continue to Checkout', 'Continue to Checkout is visible');
});

casper.then(function() {
  // casper.test.comment('Clicking on anon checkout');
  this.clickLabel('Continue to Checkout', 'a');
});

// casper.then(function() {
//   this.wait(10000, function() {
//     picit(new Date().getTime() + '-after-checkout');
//   });
// });

casper.then(function() {
  casper.waitForSelector('#EmailAddress', function then() {
    // casper.test.comment('Begin filling out shipping form');
  },
  function () {
    casper.test.comment('Timed out, no shipping form present, exiting...');
    picit(new Date().getTime() + '-15');
    casper.exit(15);
  }, 30000);
});

casper.then(function() {

  // action="/Address/ContactInformation"

  this.fill('form[action="/Address/ContactInformation"]', {

    'EmailAddress': 'test@test.com',
    'ConfirmEmailAddress': 'test@test.com',
    'PhoneNumber':   '1231231234',

    'IsSubscribed': false,

    'BillingAddress.FirstName' : 'ba.first_name',
    'BillingAddress.LastName' : 'ba.last_name',
    'BillingAddress.AddressLine1' : '5137 papaya dr',
    'BillingAddress.AddressLine2' : '',
    'BillingAddress.City' : 'Fair Oaks',
    'BillingAddress.StateId' : awesomeStateCodes['CA'],
    'BillingAddress.PostalCode' : '95628',

    'ShippingAddress.FirstName' : 'sa.first_name',
    'ShippingAddress.LastName' : 'sa.last_name',
    'ShippingAddress.AddressLine1' : '5137 papaya dr',
    'ShippingAddress.AddressLine2' : '',
    'ShippingAddress.City' : 'Fair Oaks',
    'ShippingAddress.StateId' : awesomeStateCodes['CA'],
    'ShippingAddress.PostalCode' : '95628'

  }, false);
});

casper.then(function() {

  // contact info

  this.test.assertEval(function() {
    return $('input[name="EmailAddress"]').val().length > 0;
  }, 'EmailAddress populated');

  this.test.assertEval(function() {
    return $('input[name="ConfirmEmailAddress"]').val().length > 0;
  }, 'ConfirmEmailAddress populated');

  this.test.assertEval(function() {
    return $('input[name="PhoneNumber"]').val().length > 0;
  }, 'PhoneNumber populated');

  // billing

  this.test.assertEval(function() {
    return $('input[name="BillingAddress.FirstName"]').val().length > 0;
  }, 'BillingAddress.FirstName populated');

  this.test.assertEval(function() {
    return $('input[name="BillingAddress.LastName"]').val().length > 0;
  }, 'BillingAddress.LastName populated');

  this.test.assertEval(function() {
    return $('input[name="BillingAddress.AddressLine1"]').val().length > 0;
  }, 'BillingAddress.AddressLine1 populated');

  this.test.assertEval(function() {
    return $('input[name="BillingAddress.City"]').val().length > 0;
  }, 'BillingAddress.City populated');

  this.test.assertEval(function() {
    return $('select[name="BillingAddress.StateId"]').val().length > 0;
  }, 'BillingAddress.StateId populated');

  this.test.assertEval(function() {
    return $('input[name="BillingAddress.PostalCode"]').val().length > 0;
  }, 'BillingAddress.PostalCode populated');

  // shipping

  this.test.assertEval(function() {
    return $('input[name="ShippingAddress.FirstName"]').val().length > 0;
  }, 'ShippingAddress.FirstName populated');

  this.test.assertEval(function() {
    return $('input[name="ShippingAddress.LastName"]').val().length > 0;
  }, 'ShippingAddress.LastName populated');

  this.test.assertEval(function() {
    return $('input[name="ShippingAddress.AddressLine1"]').val().length > 0;
  }, 'ShippingAddress.AddressLine1 populated');

  this.test.assertEval(function() {
    return $('input[name="ShippingAddress.City"]').val().length > 0;
  }, 'ShippingAddress.City populated');

  this.test.assertEval(function() {
    return $('select[name="ShippingAddress.StateId"]').val().length > 0;
  }, 'ShippingAddress.StateId populated');

  this.test.assertEval(function() {
    return $('input[name="ShippingAddress.PostalCode"]').val().length > 0;
  }, 'ShippingAddress.PostalCode populated');

});

casper.then(function() {
  this.wait(10000, function() {
    picit(new Date().getTime() + '-info-screen');
  });
});

casper.then(function() {
  this.test.assertSelectorExists('#Submit1', 'Save and Continue exists');
});

casper.then(function() {
  // casper.test.comment('Clicking on Save and Continue');
  this.click('#Submit1');
});

casper.then(function() {
  this.test.assertDoesntExist('.field-validation-error', 'No errors found on form submit');
});

casper.then(function() {
  //field-validation-error
  casper.waitForSelector('.field-validation-error', function () {
      casper.test.comment('Error found on Customer Information form.');
      picit(new Date().getTime() + '-34');
      casper.exit(34);
    }, function() {
      // casper.test.comment('All is well, no form-validation-errors found');
    }, 30000);
});

casper.then(function() {
  casper.waitForSelector('#CreditCardId', function () {
      // casper.test.comment('No address confirmation page. Moving on!');
      picit(new Date().getTime() + '-payment-page');
    }, function() {
      casper.test.comment('Address needs to be confirmed...');
      picit(new Date().getTime() + '-address-confirmation');
      casper.exit(34);
    }, 30000);
});

casper.then(function() {
  this.fill('form[action="/OrderReview/SubmitOrder"]', {
    'CreditCardType': 'VISA',
    'CreditCardNumber': '4111111111111111',
    'cci':   '123',
    'ExpMonth': '1',
    'ExpYear' : '2014'
  }, false);
});

casper.then(function() {
  this.wait(10000, function() {
    picit(new Date().getTime() + '-final-screen');
  });
});

casper.then(function() {
  this.test.assertExists('#submitButton', 'Final submit order button VISIBLE!');
});

// casper.then(function () {
//   casper.waitForSelector('#submitButton', function () {

//       casper.test.comment('SubmitButton VISIBLE!');

//     }, function() {
//       casper.test.comment('SubmitButton NOT visible.');
//     }, 30000);
// });

// RUN IIIIIIIIIIIT!
casper.run();