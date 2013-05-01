// to run from cli:
// rm size-range-test.txt; casperjs --cookies-file=cnum-size-range-test.txt size-range-test.js

require("utils");

// HELPER FUNCTIONS

// screen capture
picit = (function (filename) {
  if(!imageHome) { imageHome = '.'; }
  filename = imageHome + '/' + 'size-range-test' + '-' + filename + '.png' || 'default_screen_caps/results.png';
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

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js","lux-client-utils.js"],
  verbose: false,
  logLevel: "debug"
});

// casper.on('remote.message', function(msg) {
//     this.echo('### DOM Msg ###: ' + msg);
// });

// SELECTORS END

var testLineItems = [];

var item0 = {
  name: "Light Support Control Top Sheer Hose (3 for $30)",
  affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Fnordstrom-light-support-control-top-sheer-hose-3-for-30%252F2819403',
  size: 'A',
  color: 'ALMOST BLACK',
  qty: 1
};

testLineItems.push(item0);

var item1 = {
  name: "Light Support Control Top Sheer Hose (3 for $30)",
  affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Fnordstrom-light-support-control-top-sheer-hose-3-for-30%252F2819403',
  size: 'Plus',
  color: 'MEDIUM BEIGE',
  qty: 1
};

testLineItems.push(item1);

// var item2 = {
//     name: "Classic Fit Heathered Pique Polo",
//     affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flacoste-classic-fit-heathered-pique-polo%252F2907429',
//     size: '7(xl)',
//     color: 'ARGENT GREY',
//     qty: 2
//   };

// testLineItems.push(item2);

// var item3 = {
//     name: "'Tonique Douceur' Alcohol-Free Freshener (6.8 oz.)",
//     affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flancome-tonique-douceur-alcohol-free-freshener-6-8-oz%252F2786742',
//     size: '6.8 oz',
//     color: '',
//     qty: 2
//   };

// testLineItems.push(item3);

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
    card_type: 'American Express',
    card_number: '378282246310005',
    cvv: '1231',
    expiry_month: '09',
    expiry_year: '2020'
  },
  line_items: testLineItems
};

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
            picit('range-selected-' + label);

            var isSizeVisible = this.evaluate(function(size) {

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

            logMessage('Size visible after clicking on [' + label + '] [' + isSizeVisible + ']');

            if(isSizeVisible) { i = rangeCount; }

          }

        } else {
          logMessage('Size range available [false]');
        }

        casper.then(function() {

          // logMessage('Lineitem size [' + lineItem.size + ']');

          logMessage('processing color');

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

    }, function() {
      logError('Buy Button available [false]');
      exitProcess(12);
    });

  });

});

// ADD ITEMS END

// HEAD TO CHECKOUT BEGIN
casper.then(function() {
  picit('test-size-range');
});

casper.then(function() {
  this.exit(0);
});
// ADD ITEMS BEGIN


// RUN IIIIIIIIIIIT!
casper.run();