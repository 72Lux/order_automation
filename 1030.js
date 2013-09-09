// to run from cli:
// rm 1030.txt; casperjs --cookies-file=1030.txt 1030.js

require("utils");

// HELPER FUNCTIONS

// screen capture
picit = (function (filename) {
  if(!imageHome) { imageHome = '/tmp/order_automation'; }
  filename = imageHome + '/' + retailerId + '-' + filename + '.png' || 'default_screen_caps/results.png';
  logMessage('Saving screen capture [' + filename + ']');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 480,
    height: 2000
  });
});

// remove spaces and replace accented characters with corresponding regular ones
// used when search for string using indexOf
// the same functions exists in client-utils.js for injection onto client page
// to make it available for this.evaluate

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

// Nordstrom specific credit card mappings

mappedCreditCardType = (function (ccType) {

  logMessage('Incoming ccType [' + ccType + ']');

  var mappedCreditCardTypes = {
    'Mastercard': 'MasterCard',
    'Discover': 'DiscoverNovus',
    'American Express': 'AmericanExpress'
  };

  if (ccType in mappedCreditCardTypes) {
    logMessage('Returning ccType [' + mappedCreditCardTypes[ccType] + ']');
    return mappedCreditCardTypes[ccType];
  }

  logMessage('Returning ccType [' + ccType + ']');
  return ccType;

});

logMessage = (function (msg) {
  casper.echo(msg);
});

logError = (function (msg) {
  casper.echo(msg);
});

// log exit code
// take screen capture
// exit process
exitProcess = (function (code) {
  if(!code && (code !== 0)) {
    logError('Exit code not provided. Setting it to 1.');
    code = 1;
  }
  logMessage('Exiting with code [' + code + ']');
  if(code) {
    picit(order.id + '-' + code);
  }
  casper.exit(code);
});

getSizeRangeLabel = (function (outerIndex) {

  return casper.evaluate(function(outerIndex) {
    var label = '';

    $('.size-range .itemNumberPriceRow').each(function(index) {

      console.log('outerIndex: ' + outerIndex + ' index: ' + index);

      if(outerIndex === index) {
        label = $(this).attr('filtervalue');
        console.log('label: ' + label + ' index: ' + index);
        return false;
      } else {
        console.log('no-match');
      }

    });

    return label;
  }, outerIndex);
});

checkSizeVisibility = (function (size) {

  return casper.evaluate(function(size) {

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

    return result;

  }, size);
});

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js","lux-client-utils.js"],
  onAlert: function () {
    logMessage('an alert was triggered');  // this is used to test whether a size/color combo was actually chosen
    picit('alert');
  },
  verbose: false,
  logLevel: "debug"
});

// TEST DATA BEGIN

var testLineItems = [];

var item0 = {
    title: "'Le Lipstique' LipColoring Stick with Brush",
    affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flancome-le-lipstique-lipcoloring-stick-with-brush%252F2786535',
    size: 'One Size',
    color: 'AMANDELLE',
    qty: 1
  };

testLineItems.push(item0);

// var item1 = {
//     title: "'Le Lipstique' LipColoring Stick with Brush",
//     affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flancome-le-lipstique-lipcoloring-stick-with-brush%252F2786535',
//     size: 'One Size',
//     color: 'BRONZELLE',
//     qty: 1
//   };

// testLineItems.push(item1);

// var item2 = {
//     title: "Trim Fit Slubbed V-Neck T-Shirt (Men)",
//     affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Fjohn-varvatos-star-usa-trim-fit-slubbed-v-neck-t-shirt-men%252F3031069',
//     size: 'Large',
//     color: 'DARK FATIGUE',
//     qty: 2
//   };

// testLineItems.push(item2);

// var item3 = {
//     title: "'Tonique Douceur' Alcohol-Free Freshener (6.8 oz.)",
//     affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flancome-tonique-douceur-alcohol-free-freshener-6-8-oz%252F2786742',
//     size: '6.8 oz',
//     color: '',
//     qty: 2
//   };

// testLineItems.push(item3);

// var item4 = {
//   name: "'Joelle' Pantyhose",
//   affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Foroblu-joelle-pantyhose%252F3340590',
//   size: 'Medium',
//   color: 'BLACK',
//   qty: 1
// };

// testLineItems.push(item4);

// var item5 = {
//   name: "'Joelle' Pantyhose",
//   affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Foroblu-joelle-pantyhose%252F3340590',
//   size: 'Large',
//   color: 'NUDE',
//   qty: 1
// };

// testLineItems.push(item5);

var testOrder = {
  id: '1030-test-' + new Date().getTime(),
  submitOrder: false,
  shipping_address: {
    first_name: 'First',
    last_name: 'Last',
    street1: '1 Market St',
    street2: '',
    city: 'San Francisco',
    state: 'California',
    short_state: 'CA',
    postal_code: '94108',
    phone: '1231231234'
  },
  billing_address: {
    email: 'test@test.com',
    first_name: 'First',
    last_name: 'Last',
    street1: '1 Market St',
    street2: '',
    city: 'San Francisco',
    state: 'California',
    short_state: 'CA',
    postal_code: '94108',
    phone: '1231231234'
  },
  payment: {
    card_type: 'Mastercard',
    card_number: '5555555555554444',
    cvv: '1231',
    expiry_month: '09',
    expiry_year: '2020'
  },
  line_items: testLineItems
};

// TEST DATA END

var retailerId = '1030';

var order = casper.cli.get('order');
var auth = casper.cli.get('auth');
var commentUrl = casper.cli.get('comment-url');
var imageHome = casper.cli.get('image-home');

// if order is made available on the command line, make sure the other required options are present as well.
// if there is no --order option available, use the testOrder [the testOrder will not be submitted; order.submitOrder = false]


if(order) {
  if(!auth || !commentUrl || !imageHome) {
    logError('--auth, --comment-url, --image-home are required for a real order to be processed.');
    exit(1);
  }
  order = JSON.parse(order);
  logMessage('Using --order');
} else {
  order = testOrder;
  logMessage('Using testOrder');
}

var formErrorMsg = '';
var confirmationMsg = '';
var confirmationUrl = '';
var sa = order.shipping_address;
var ba = order.billing_address;
var pi = order.payment;
// For the Nordstrom dropdown 'American Express' needs to be 'AmericanExpress'
pi.card_type = pi.card_type.replace(/ /g,'');
pi.expiry_month = parseInt(pi.expiry_month, 10);
var lineItems = order.line_items;

// Nordstrom uses these numeric codes for the states dropdown.
var awesomeStateCodes = {AL : 73, AK : 16, AZ : 70, AR : 75, CA : 71, CO : 72, CT : 67, DE : 69, DC : 68, FL : 65, GA : 66, HI : 62, ID : 63, IL : 58, IN : 59, IA : 60, KS : 55, KY : 56, LA : 57, ME : 52, MD : 50, MA : 51, MI : 47, MN : 48, MS : 49, MO : 44, MT : 45, NE : 46, NV : 41, NH : 42, NJ : 43, NM : 38, NY : 39, NC : 40, ND : 35, OH : 36, OK : 37, OR : 32, PA : 34, RI : 30, SC : 31, SD : 26, TN : 27, TX : 28, UT : 23, VT : 24, VA : 25, WA : 21, WV : 22, WI : 17, WY : 18};

var isSizeAvailable = false;
var isColorAvailable = false;

casper.start();

var originalLineItemCount = order.line_items.length;

// instead of having to rely on searching through the shopping bag to adjust item quantity
// we create new lineitem entries when the qty for a product is set to greater than 1

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
  logMessage('Order Id [' + order.id + '] Retailer Id [' + retailerId + '] Item Count [' + order.line_items.length + '] Submit Order [' + order.submitOrder + ']');
});

casper.then(function() {
  logMessage('Item quantity total [' + lineItems.length + ']');
});

// set user agent to mobile
casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

// loop through all lineitems, set size and color, and add to bag

casper.each(lineItems, function(self, lineItem) {

  casper.then(function() {
    logMessage('Opening [' + lineItem.affiliate_url + ']');
  });

  this.thenOpen(lineItem.affiliate_url, function() {

    logMessage(this.getTitle());

    casper.waitForSelector('#buyButtonSubmit', function() {

      logMessage('Buy Button available [true]');

      if (lineItem.size) {

        if(this.exists('.size-range')) {

          logMessage('Size range available [true]');

          var rangeCount = this.evaluate(function() { return $('.size-range .itemNumberPriceRow').length; });

          logMessage('Number of size range options [' + rangeCount + ']');

          for (var i = 0; i < rangeCount; i++) {

            var label = getSizeRangeLabel(i);

            logMessage('Clicking on size range option [' + label + ']');

            this.clickLabel(label);

            var isSizeVisible = checkSizeVisibility(lineItem.size);

            logMessage('Size visible after clicking on [' + label + '] [' + isSizeVisible + ']');

            if(isSizeVisible) { i = rangeCount; }

          }

        } else {
          logMessage('Size range available [false]');
        }

        casper.then(function() {

          // logMessage('Lineitem size [' + lineItem.size + ']');

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

            return result;

          }, lineItem.size);

        });

        casper.then(function() {
          logMessage('Size [' + lineItem.size + '] available [' + isSizeAvailable + ']');
        });

        casper.then(function() {
          if(isSizeAvailable) {
              this.clickLabel(lineItem.size, 'a');
          } else {
            logError('OrderId [' + order.id + '] UNAVAILABLE size [' + lineItem.size + ']');
            exitProcess(32);
          }
        });

        casper.then(function() {
          var currentSize = this.evaluate(function() { return $('#dimension1_1 .selected').text(); });
          if(normalizeString(lineItem.size) === normalizeString(currentSize)) {
            logMessage('Size [' + lineItem.size + '] set [true]');
          } else {
            logMessage('Size [' + lineItem.size + '] set [false]');
            exitProcess(1);
          }
        });

      }

      if (lineItem.color) {

        // some of our colors are not uppercase
        // they need to be for nordstrom mobile
        lineItem.color = lineItem.color.toUpperCase();

        // eg: beauty
        // process color

        casper.then(function() {

          // logMessage('Lineitem color [' + lineItem.color + ']');

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
          logMessage('Lineitem color [' + lineItem.color + '] available [' + isColorAvailable + ']');
        });

        casper.then(function() {
          if(isColorAvailable) {
              this.clickLabel(lineItem.color, 'span');
          } else {
            logError('Order Id [' + order.id + '] UNAVAILABLE color [' + lineItem.color + ']');
            exitProcess(32);
          }
        });

        casper.then(function() {
          var currentColor = this.evaluate(function() { return $('#dimension2_1 .selected').text(); });
          if(normalizeString(lineItem.color) === normalizeString(currentColor)) {
            logMessage('Color [' + lineItem.color + '] set [true]');
          } else {
            logMessage('Color [' + lineItem.color + '] set [false]');
            exitProcess(1);
          }
        });

      }

      casper.then(function() {
        logMessage('Clicking on [Buy Button]');
      });

      casper.then(function() {
        this.click('#buyButtonSubmit');
      });

      // casper.then(function() {
      //   casper.waitForSelector('a.title', function() {

      //     logMessage('Shopping bag available [true]');

      //     if(normalizeString(casper.fetchText('.title')).indexOf(normalizeString(lineItem.title)) >= 0) {
      //       logMessage('Item name [' + lineItem.title + '] found in shopping bag [true]');
      //     } else {
      //       logError('Item name [' + normalizeString(lineItem.title) + '] found in shopping bag [false] shopping bag text [' + normalizeString(casper.fetchText('.title')) + ']');
      //       exitProcess(1);
      //     }

      //   }, function() {

      //     logError('Shopping bag available [false]');
      //     exitProcess(1);

      //   }, 15000);

      // });

    }, function() {
      logError('Buy Button available [false]');
      exitProcess(12);
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
      logMessage('Shipping form available [true]');
    },
    function () {
      logError('Shipping form available [false]');
      exitProcess(15);
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
  logMessage('Clicking on [Save and Continue]');
  this.click('#Submit1');
});

casper.then(function() {
  //field-validation-error
  casper.waitForSelector('.field-validation-error', function () {

      casper.then(function() {
        logError('Valid customer info [false]');
      });

      casper.then(function() {
        formErrorMsg = this.fetchText('.field-validation-error');
      });

    }, function() {
      logMessage('Valid customer info [true]');
    }, 30000);
});

casper.then(function() {
  if(formErrorMsg) {
    casper.thenOpen(commentUrl, {
      method: 'post',
      data:   {
        'comment': 'There was an error found when submitting the customer information form for order id [' + order.id + ']. Error message: ' + formErrorMsg
      },
      headers: {
        'Authorization' : auth
      }
    }, function() {
        logMessage('Comment posted [' + formErrorMsg + ']');
        exitProcess(34);
    });
  }
});

casper.then(function() {
  casper.waitForSelector('#CreditCardId', function () {
      logMessage('Address confirmation needed [false]');
    }, function() {
      logMessage('Address confirmation needed [true]');
      picit(order.id + '-address-confirmation');
      casper.then(function() {
        this.evaluate(function() { $('input[name="actionMode"][value="Use"]').click();
      });

    }, 30000);
  });
});

casper.then(function() {
  casper.waitForSelector('form[action="/OrderReview/SubmitOrder"]', function() {
    logMessage('Payment form available [true]');
  }, function() {
    logError('Payment form available [false]');
    exitProcess(1);
  }, 30000);
});

casper.then(function() {

  this.fill('form[action="/OrderReview/SubmitOrder"]', {
    'CreditCardType': pi.card_type
  }, false);
});

casper.then(function() {

  this.fill('form[action="/OrderReview/SubmitOrder"]', {
    'CreditCardNumber': pi.card_number,
    'cci': pi.cvv,
    'ExpMonth': pi.expiry_month,
    'ExpYear' : pi.expiry_year
  }, false);
});

casper.then(function () {
  casper.waitForSelector('#submitButton', function () {

    casper.then(function() {
      logMessage('Submit Order [' + order.submitOrder + ']');
    });

    casper.then(function() {

      if(order.submitOrder) {
        // TODO: OMG! ARE YOU READY FOR THIS?
        casper.then(function() {
          casper.click('#submitButton');
        });
        casper.then(function() {
          logMessage('Submit Button [CLICKED!]');
        });

        casper.then(function() {
          casper.waitFor(function() {
            return this.getCurrentUrl().indexOf('orderNumber=') >= 0;
          }, function () {

            casper.then(function() {
              confirmationUrl = this.getCurrentUrl();
            });

            casper.then(function() {
              if(confirmationUrl && confirmationUrl.indexOf('orderNumber=')) {
                var orderNumber = confirmationUrl.substring(confirmationUrl.indexOf('orderNumber=')+12);
                confirmationMsg = 'Nordstrom order number: ' + orderNumber;
              } else {
                confirmationMsg = 'Nordstrom order number not found. Full URL: ' + confirmationUrl;
              }
            });

            casper.then(function() {
              picit(order.id + '-0');
            });

            casper.then(function() {
              logMessage('Sending confirmation comment to order with id [' + order.id + ']');
            });

            casper.thenOpen(commentUrl, {
              method: 'post',
              data:   {
                'comment': confirmationMsg
              },
              headers: {
                'Authorization' : auth
              }
            });

            casper.then(function() {
              logMessage('Order Id [' + order.id + '] Nordstrom order number [' + confirmationMsg + ']');
            });


          }, function() {
            casper.then(function() {
              logError('Confirmation message found [false]');
              exitProcess(20);
            });
          }, 30000);
        });


      } else {
        casper.then(function() {
          logMessage('Submit Button is [VISIBLE]');
          picit(order.id + '-0');
        });

        casper.then(function() {
          logMessage('Sending confirmation comment to order with id [' + order.id + ']');
        });

        casper.then(function() {

          if(auth && commentUrl) {
            casper.thenOpen(commentUrl, {
                method: 'post',
                data:   {
                  'comment': 'submitOrder set to false, so no Nordstrom order number for you!'
                },
                headers: {
                  'Authorization' : auth
                }
            });
          } else {
            casper.then(function() {
              logMessage('Could not post confirmation comment. Auth or comment-url unavailable.');
            });
          }
        });

      }

    });

  }, function() {
    logError('Submit button available [false]');
    exitProcess(18);
  }, 30000);
});

casper.then(function() {
  logMessage('Exiting process for Order Id [' + order.id + '] Retailer Id [' + retailerId + '] Item Count [' + order.line_items.length + '] Submit Order [' + order.submitOrder + ']');
  exitProcess(0);
});

// RUN IIIIIIIIIIIT!
casper.run();
