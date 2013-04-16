  require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = imageHome + filename + '.png' || 'default_screen_caps/results.png';
  casper.test.comment('Cheeeeeeese!');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 480,
    height: 2000
  });
});

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js"],
  onAlert: function () {
    casper.test.comment('an alert was triggered');  // this is used to test whether a size/color combo was actually chosen
    picit('alert');
  },
  verbose: false,
  logLevel: "debug"
});

// casper.on('remote.message', function(msg) {
//     this.echo('### DOM Msg ###: ' + msg);
// });

// SELECTORS END

var order = JSON.parse(casper.cli.args);
var sa = order.shipping_address;
var ba = order.billing_address;
var pi = order.payment;

// Nordstrom uses these numeric codes for the states dropdown.
var awesomeStateCodes = {AL : 73, AK : 16, AZ : 70, AR : 75, CA : 71, CO : 72, CT : 67, DE : 69, DC : 68, FL : 65, GA : 66, HI : 62, ID : 63, IL : 58, IN : 59, IA : 60, KS : 55, KY : 56, LA : 57, ME : 52, MD : 50, MA : 51, MI : 47, MN : 48, MS : 49, MO : 44, MT : 45, NE : 46, NV : 41, NH : 42, NJ : 43, NM : 38, NY : 39, NC : 40, ND : 35, OH : 36, OK : 37, OR : 32, PA : 34, RI : 30, SC : 31, SD : 26, TN : 27, TX : 28, UT : 23, VT : 24, VA : 25, WA : 21, WV : 22, WI : 17, WY : 18};

var auth = casper.cli.get('auth');
var commentUrl = casper.cli.get('comment-url');
var imageHome = casper.cli.get('image-home');
var isSizeAvailable = false;
var isColorAvailable = false;

casper.test.comment('Order received! Id: ' + order.id + ' item count: ' + order.line_items.length + ' submitOrder: ' + order.submitOrder);

var lineItems = order.line_items;

casper.start();

// ADD ITEMS BEGIN

// set user agent to mobile
casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.each(lineItems, function(self, lineItem) {
  this.thenOpen(lineItem.affiliate_url, function() {

    casper.test.comment(this.getTitle());

    // picit(order.id + '-before-anything');

    casper.waitForSelector('#buyButtonSubmit', function() {

      if (lineItem.size) {

        casper.test.comment('Set size to: ' + lineItem.size);
        casper.test.comment('length: ' + lineItem.size.length);

        casper.then(function() {

          isSizeAvailable = this.evaluate(function(size) {

                                            var result = false;

                                            $('#dimension1_1 a').each(function(index, value) {

                                              if($(this).attr('id').toLowerCase().indexOf(size.toLowerCase()) >= 0) {

                                                // check if color is available
                                                if(!$(this).hasClass('unavailable')) {
                                                  // color found, click it!
                                                  // $(this).click();
                                                  // // verify the
                                                  // result = $(this).hasClass('selected');
                                                  result = true;
                                                  return;
                                                }
                                              }
                                            });

                                            // the color was not found
                                            return result;

                                          }, lineItem.size);

        });

        casper.then(function() {
          casper.test.comment('isSizeAvailable: ' + isSizeAvailable);
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

        // casper.then(function() {
        //   picit(order.id +  '-' + new Date().getTime() +'-after-size-click');
        // });
      }

      if (lineItem.color) {

        casper.test.comment('Set color to: ' + lineItem.color);

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
          casper.test.comment('isColorAvailable: ' + isColorAvailable);
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

        // casper.then(function() {
        //   picit(order.id +  '-' + new Date().getTime() +'-after-color-click');
        // });

      }

      // TODO set QUANTITIES
      // casper.then(function() {
      //   var itemNumber = this.fetchText('.item .sub');

      //   casper.test.comment('ITEM NUMBER: ' + itemNumber);
      // });

      casper.test.comment('Clicking on add button...');
      casper.then(function() {
        this.click('#buyButtonSubmit');
      });

      // casper.then(function() {
      //   picit(order.id +  '-' + new Date().getTime() +'-after-add-click');
      // });

    }, function() {

      casper.test.comment('Timed out waiting for add to bag button');
      picit(order.id + '-12' + '-' + new Date().getTime());
      this.exit(12);

    });

  });

});

// ADD ITEMS END

// HEAD TO CHECKOUT BEGIN

// https://msecure.nordstrom.com/shoppingbag/

// casper.thenOpen('https://msecure.nordstrom.com/shoppingbag/', function() {
//   this.wait(2000, function() {
//     picit(order.id + '-shopping-bag');
//   });
// });

// HEAD TO CHECKOUT END

casper.then(function() {
  casper.test.comment('To the checkout!');
  this.click('#proceed-to-checkout');
});

// casper.then(function() {
//   this.wait(10000, function() {
//     picit(order.id + '-proceed-to-checkout');
//   });
// });

// NoThanksButton

casper.then(function () {
  casper.waitForSelector('#NoThanksButton', function () {

      casper.test.comment('Samples screen appeared');
      // this.click('#NoThanksButton');

      casper.open('http://m.nordstrom.com//samples/nothanks', {
          method: 'post',
          data:   {
              'postaction': ''
          }
      });

    }, function() {
      casper.test.comment('No samples screen');
    }, 30000);
});


// Continue to Checkout

casper.then(function() {
  this.clickLabel('Continue to Checkout', 'a');
});

// casper.then(function() {
//   this.wait(10000, function() {
//     picit(order.id + '-after-checkout');
//   });
// });

// casper.thenOpen('https://msecure.nordstrom.com/Address/ContactInformation', function() {
//   this.wait(10000, function() {
//     picit(order.id + '-customer-info');
//     this.exit(0);
//   });
// });

casper.then(function() {
  casper.waitForSelector('#EmailAddress', function then() {
    casper.test.comment('Begin filling out shipping form');
  },
  function () {
    casper.test.comment('Timed out, no shipping form present, exiting...');
    picit(order.id + '-15' + '-' + new Date().getTime());
    casper.exit(15);
  }, 30000);
});

casper.then(function() {

  // action="/Address/ContactInformation"

  this.fill('form[action="/Address/ContactInformation"]', {

    'EmailAddress': ba.email,
    'ConfirmEmailAddress': ba.email,
    'PhoneNumber':   sa.phone,

    'IsSubscribed': false,

    'BillingAddress.FirstName' : ba.first_name,
    'BillingAddress.LastName' : ba.last_name,
    'BillingAddress.AddressLine1' : ba.street1,
    'BillingAddress.AddressLine2' : ba.street2,
    'BillingAddress.City' : ba.city,
    'BillingAddress.StateId' : awesomeStateCodes[ba.short_state],
    'BillingAddress.PostalCode' : ba.postal_code,

    'ShippingAddress.FirstName' : sa.first_name,
    'ShippingAddress.LastName' : sa.last_name,
    'ShippingAddress.AddressLine1' : sa.street1,
    'ShippingAddress.AddressLine2' : sa.street2,
    'ShippingAddress.City' : sa.city,
    'ShippingAddress.StateId' : awesomeStateCodes[sa.short_state],
    'ShippingAddress.PostalCode' : sa.postal_code

  }, false);
});

// casper.then(function() {
//   this.wait(10000, function() {
//     picit(order.id + '-checkout-page');
//   });
// });

casper.then(function() {
  casper.test.comment('Clicking on Save and Continue');
  this.click('#Submit1');
});

casper.then(function() {
  //field-validation-error
  casper.waitForSelector('.field-validation-error', function () {
      casper.test.comment('Error found on Customer Information form.');
      picit(order.id + '-34' + '-' + new Date().getTime());
      this.exit(34);
    }, function() {
      casper.test.comment('All is well, no form-validation-errors found');
    }, 30000);
});

casper.then(function() {
  casper.waitForSelector('#CreditCardId', function () {
      casper.test.comment('No address confirmation page. Moving on!');
      // picit(new Date().getTime() + '-payment-page');
    }, function() {
      casper.test.comment('Address needs to be confirmed...');
      picit(order.id + '-36' + '-' + new Date().getTime());
      casper.exit(36);
    }, 30000);
});

casper.then(function() {
  this.fill('form[action="/OrderReview/SubmitOrder"]', {
    'CreditCardType': pi.card_type,
    'CreditCardNumber': pi.card_number,
    'cci': pi.cvv,
    'ExpMonth': pi.expiry_month,
    'ExpYear' : pi.expiry_year
  }, false);
});

// casper.then(function() {
//   this.wait(10000, function() {
//     picit(new Date().getTime() + '-after-payment-info');
//   });
// });

casper.then(function () {
  casper.waitForSelector('#submitButton', function () {

      casper.test.comment('order.submitOrder set to: ' + order.submitOrder);

      if(order.submitOrder) {
        // TODO: OMG! ARE YOU READY FOR THIS?
        casper.click('#submitButton');
        casper.test.comment('Submit button CLICKED!');
      } else {
        casper.test.comment('SubmitButton is VISIBLE!');
      }

    }, function() {
      casper.test.comment('ERROR: Submit order button not available');
      picit(order.id + '-18' + '-' + new Date().getTime());
      casper.exit(18);
    }, 30000);
});

casper.then(function() {
  this.wait(10000, function() {
    casper.test.comment('Submit button clicked');
    picit(order.id + '-0' + '-' + new Date().getTime());
  });
});

// check for success or errors
if(order.submitOrder) {

  casper.then(function () {

    //TODO: extract confirmation number
    casper.waitForSelector('#confirmSummary', function () {

      casper.then(function() {
        var confirmationMsg = this.evaluate(function parseConfirmationMsg() { return $('#confirmSummary').html();});
      });

      if(!confirmationMsg) {
        casper.then(function() {
          casper.test.comment('ERROR: Order was submitted but could not find order confirmation text.');
          picit(order.id + '-20' + '-' + new Date().getTime());
          casper.exit(20);
        });
      }

      if(auth && commentUrl) {

        casper.then(function() {
          casper.test.comment('Sending confirmation comment to order with id: ' + order.id);
        });

        casper.open(commentUrl, {
            method: 'post',
            data:   {
              'comment': 'CONFIRMATION #: ' + confirmationMsg
            },
            headers: {
              'Authorization' : auth
            }
        });

        casper.then(function() {
          casper.test.comment('Confirmation # posted!');
        });

        } else {
          casper.then(function() {
            casper.test.comment('Could not post confirmation comment. Auth or comment-url unavailable.');
          });
        }

      }, function() {
        casper.then(function() {
          casper.test.comment('ERROR: Order was submitted but could not find order confirmation text.');
          picit(order.id + '-20' + '-' + new Date().getTime());
          casper.exit(20);
        });
      }, 30000);
  });
} else {
  casper.then(function() {
    if(auth && commentUrl) {
      casper.then(function() {
        casper.test.comment('Sending confirmation comment to order with id: ' + order.id);
      });

      casper.open(commentUrl, {
          method: 'post',
          data:   {
            'comment': 'CONFIRMATION #: ' + confirmationMsg
          },
          headers: {
            'Authorization' : auth
          }
      });

      casper.then(function() {
        casper.test.comment('Confirmation # posted!');
      });
    } else {
      casper.then(function() {
        casper.test.comment('Could not post confirmation comment. Auth or comment-url unavailable.');
      });
    }
  });
}


// RUN IIIIIIIIIIIT!
casper.run();