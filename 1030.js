require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = imageHome + filename + '.png' || 'default_screen_caps/results.png';
  this.echo('### ' + 'Saving screen capture [' + filename + ']');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 480,
    height: 2000
  });
});

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js","lux-client-utils.js"],
  onAlert: function () {
    this.echo('### ' + 'an alert was triggered');  // this is used to test whether a size/color combo was actually chosen
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

this.echo('### ' + 'Order id [' + order.id + '] item count [' + order.line_items.length + '] submitOrder [' + order.submitOrder + ']');

var lineItems = order.line_items;

// if quantity on any of the items is greater than 1
// change it to 1 and add new lineItems to the array for the originalQty-1 items

casper.start();

casper.then(function() {
  this.echo('### ' + 'Lineitem count [' + lineItems.length + ']');
});

casper.then(function() {
  this.echo('### Lineitem count [' + lineItems.length + ']');
});

casper.then(function() {
  for(var n = 0; n < lineItems.length; n++) {

    var qty = lineItems[n].qty;

    if(qty > 1) {
      lineItems[n].qty = 1;
      for(var m = 0; m < qty-1; m++) {
        lineItems.push(lineItems[n]);
      }
    }
  }
});

casper.then(function() {
  this.echo('### ' + 'Total product quantity [' + lineItems.length + ']');
});


// ADD ITEMS BEGIN

// set user agent to mobile
casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.each(lineItems, function(self, lineItem) {

  this.thenOpen(lineItem.affiliate_url, function() {

    this.echo('### ' + this.getTitle());

    // picit(order.id + '-before-anything');

    casper.waitForSelector('#buyButtonSubmit', function() {

      if (lineItem.size) {

        this.echo('### ' + 'Set size to [' + lineItem.size + ']');

        casper.then(function() {

          isSizeAvailable = this.evaluate(function(size) {

            var result = false;

            $('#dimension1_1 a').each(function(index, value) {

              if(normalizeString($(this).attr('id')).indexOf(normalizeString(size)) >= 0) {

                // check if color is available
                if(!$(this).hasClass('unavailable')) {
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
          this.echo('### ' + 'Size availability [' + isSizeAvailable + ']');
        });

        casper.then(function() {
          if(isSizeAvailable) {
              this.clickLabel(lineItem.size, 'a');
          } else {
            this.echo('### ERROR ### ' + 'OrderId: ' + order.id + '. The size unavailable: ' + lineItem.size + '. Exiting...');
            picit(order.id + '-32');
            this.exit(32);
          }
        });
      }

      if (lineItem.color) {

        // eg: beauty
        // process color

        casper.then(function() {

          this.echo('### ' + 'Set color to [' + lineItem.color + ']');

          isColorAvailable = this.evaluate(function(color) {

            var result = false;

            $('#dimension2_1 span').each(function() {

              if(normalizeString($(this).text()).indexOf(normalizeString(color)) >= 0) {

                var _parent = $(this).closest('a');

                // check if color is available
                if(!_parent.hasClass('unavailable')) {

                  result = true;
                  return;
                }
              }
            });

            // the color was not found
            return result;

          }, lineItem.color);
        });

        casper.then(function() {
          this.echo('### ' + 'Color availability [' + isColorAvailable + ']');
        });

        casper.then(function() {
          if(isColorAvailable) {
              this.clickLabel(lineItem.color, 'span');
          } else {
            this.echo('### ERROR ### ' + 'OrderId: ' + order.id + '. The color unavailable: ' + lineItem.color + '. Exiting...');
            picit(order.id + '-32');
            this.exit(32);
          }
        });
      }

      casper.then(function() {
        this.echo('### ' + 'Clicking on [Buy Button]');
        this.click('#buyButtonSubmit');
      });

    }, function() {

      this.echo('### ERROR ### ' + 'Buy Button available [false]');
      picit(order.id + '-12');
      this.exit(12);

    });

  });

});

// ADD ITEMS END

// HEAD TO CHECKOUT BEGIN

casper.thenOpen('https://msecure.nordstrom.com/Account/GuestCheckout', function() {

  casper.then(function() {
    this.wait(10000, function() {
      picit(order.id + '-after-checkout');
    });
  });

  casper.then(function() {
    casper.waitForSelector('#EmailAddress', function then() {
      this.echo('### ' + 'Shipping form available [true]');
    },
    function () {
      this.echo('### ERROR ### ' + 'Shipping form available [false]');
      picit(order.id + '-15');
      casper.exit(15);
    }, 30000);
  });

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

casper.then(function() {
  this.echo('### ' + 'Clicking on [Save and Continue]');
  this.click('#Submit1');
});

casper.then(function() {
  //field-validation-error
  casper.waitForSelector('.field-validation-error', function () {
      this.echo('### ERROR ### ' + 'Validation errors for customer info [true]');
      picit(order.id + '-34');
      this.exit(34);
    }, function() {
      this.echo('### ' + 'Validation errors for customer info [false]');
    }, 30000);
});

casper.then(function() {
  casper.waitForSelector('#CreditCardId', function () {
      this.echo('### ' + 'Address confirmation needed [false]');
    }, function() {
      this.echo('### ' + 'Address confirmation needed [true]');
      picit(order.id + '-address-confirmation');
      casper.then(function() {
        this.evaluate(function() { $('input[name="actionMode"][value="Use"]').click();
      });

    }, 30000);
  });
});

casper.then(function() {
  casper.waitForSelector('form[action="/OrderReview/SubmitOrder"]', function() {
    this.echo('### ' + 'Payment form available [true]');
  }, function() {
    this.echo('### ERROR ### ' + 'Payment form available [false]');
    picit(order.id + '-1');
    this.exit(1);
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

casper.then(function () {
  casper.waitForSelector('#submitButton', function () {

      this.echo('### ' + 'SubmitOrder is set to [' + order.submitOrder + ']');

      if(order.submitOrder) {
        // TODO: OMG! ARE YOU READY FOR THIS?
        casper.click('#submitButton');
        this.echo('### ' + 'Submit button [CLICKED!]');
      } else {
        this.echo('### ' + 'Submit Button is [VISIBLE]');
      }

    }, function() {
      this.echo('### ERROR ### ' + 'Submit order button not available');
      picit(order.id + '-18');
      casper.exit(18);
    }, 30000);
});

casper.then(function() {
  this.wait(10000, function() {
    picit(order.id + '-0');
  });
});

casper.then(function () {

  // check for success or errors
  if(order.submitOrder) {

    //TODO: extract confirmation number
    casper.waitForText('Thank you', function () {

      var confirmationMsg = 'Nordstrom order number : ';

      casper.then(function() {
        var currentUrl = this.getCurrentUrl();

        if(currentUrl && currentUrl.indexOf('orderNumber=')) {
          var orderNumber = currentUrl.substring(currentUrl.indexOf('orderNumber=')+12);
          confirmationMsg += orderNumber;
        } else {
          confirmationMsg += 'not found.';
        }

        this.echo('### ' + confirmationMsg);
      });

      if(!confirmationMsg) {
        casper.then(function() {
          this.echo('### ERROR ### ' + 'Order was submitted but could not find order confirmation text.');
          picit(order.id + '-20');
          casper.exit(20);
        });
      }

      if(auth && commentUrl) {

        casper.then(function() {
          this.echo('### ' + 'Sending confirmation comment to order with id [' + order.id + ']');
        });

        casper.open(commentUrl, {
            method: 'post',
            data:   {
              'comment': confirmationMsg
            },
            headers: {
              'Authorization' : auth
            }
        });

        casper.then(function() {
          this.echo('### ' + 'Order id [' + order.id + ' Nordstrom order number [' + confirmationMsg + ']');
        });

        } else {
          casper.then(function() {
            this.echo('### ' + 'Could not post confirmation comment. Auth or comment-url unavailable.');
          });
        }

      }, function() {
        casper.then(function() {
          this.echo('### ERROR ### ' + 'Order was submitted but could not find order confirmation text.');
          picit(order.id + '-20');
          casper.exit(20);
        });
      }, 30000);

  } else {

    if(auth && commentUrl) {
      casper.then(function() {
        this.echo('### ' + 'Sending confirmation comment to order with id [' + order.id + ']');
      });

      casper.open(commentUrl, {
          method: 'post',
          data:   {
            'comment': 'submitOrder set to false, so no Nordstrom order number for you!'
          },
          headers: {
            'Authorization' : auth
          }
      });

      casper.then(function() {
        this.echo('### ' + 'SubmitOrder set to [false], so no [Nordstrom order number] for you!');
      });

    } else {
      casper.then(function() {
        this.echo('### ' + 'Could not post confirmation comment. Auth or comment-url unavailable.');
      });
    }
  }
});


// RUN IIIIIIIIIIIT!
casper.run();