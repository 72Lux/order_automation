// to RUN, provide cookie file at cl :
// casperjs --cookies-file=local-nordstrom.txt local-nordstrom.js

require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = '/home/vivekdhar/screen_caps/' + filename + '.png';
  casper.test.comment('Cheeeeeeese!');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 480,
    height: 3000
  });
});

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js"],
  verbose: true,
  logLevel: "debug"
});

var awesomeStateCodes = {AL : 73, AK : 16, AZ : 70, AR : 75, CA : 71, CO : 72, CT : 67, DE : 69, DC : 68, FL : 65, GA : 66, HI : 62, ID : 63, IL : 58, IN : 59, IA : 60, KS : 55, KY : 56, LA : 57, ME : 52, MD : 50, MA : 51, MI : 47, MN : 48, MS : 49, MO : 44, MT : 45, NE : 46, NV : 41, NH : 42, NJ : 43, NM : 38, NY : 39, NC : 40, ND : 35, OH : 36, OK : 37, OR : 32, PA : 34, RI : 30, SC : 31, SD : 26, TN : 27, TX : 28, UT : 23, VT : 24, VA : 25, WA : 21, WV : 22, WI : 17, WY : 18};

// casper.on('resource.requested', function(resource) {
//   for (var obj in resource.headers) {
//     var name = resource.headers[obj].name;
//     var value = resource.headers[obj].value;
//     if (name == "User-Agent"){
//       casper.echo(value);
//     }
//   }
// });

casper.start();

casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.thenOpen('http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flancome-le-lipstique-lipcoloring-stick-with-brush%252F2786535', function() {
  this.wait(2000, function() {
    picit(new Date().getTime() + '-before-anything');
  });
});

// casper.then(function() {
//   this.clickLabel('7(xl)', 'a');
// });

// casper.then(function() {
//   picit(new Date().getTime() + '-after-size-click');
// });

casper.then(function() {
  this.clickLabel('AMANDELLE', 'span');
});

casper.then(function() {
  picit(new Date().getTime() + '-after-color-click');
});


// casper.then(function() {
//   var itemNumber = this.fetchText('.item');
//   casper.test.comment('ITEM NUMBER: ' + itemNumber);
// });

casper.then(function() {
  // Click on 1st result link
  this.click('#buyButtonSubmit');
});

casper.then(function() {
  picit(new Date().getTime() + '-after-add-click');
});

casper.then(function() {
  this.click('#proceed-to-checkout');
});

casper.then(function() {
  this.wait(10000, function() {
    picit(new Date().getTime() + '-proceed-to-checkout');
  });
});

// NoThanksButton

casper.then(function () {
  casper.waitForSelector('#NoThanksButton', function () {
      // selectedSamples

      // // this.click('.samplecheckbox');

      // picit(new Date().getTime() + '-after-sample-click');

      casper.test.comment('Samples screen appeared');
      // casper.click('input[type="button"][value="Skip"]');

      // this.click('#NoThanksButton');
      // this.evaluate(function(){ $('#NoThanksButton').click(); });

      casper.open('http://m.nordstrom.com//samples/nothanks', {
          method: 'post',
          data:   {
              'postaction': ''
          }
      });


      // http://m.nordstrom.com//samples/nothanks?postaction=

    }, function() {
      casper.test.comment('No samples screen');
    }, 30000);
});

casper.then(function() {
  this.wait(10000, function() {
    picit(new Date().getTime() + '-after-no-thanks-checkout');
  });
});

// Continue to Checkout

casper.then(function() {
  this.clickLabel('Continue to Checkout', 'a');
});

casper.then(function() {
  this.wait(10000, function() {
    picit(new Date().getTime() + '-after-checkout');
  });
});

casper.then(function() {
  casper.waitForSelector('#EmailAddress', function then() {
    casper.test.comment('Begin filling out shipping form');
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
  this.wait(10000, function() {
    picit(new Date().getTime() + '-after-fill');
  });
});

casper.then(function() {
  casper.test.comment('Clicking on Save and Continue');
  this.click('#Submit1');
});

casper.then(function() {
  //field-validation-error
  casper.waitForSelector('.field-validation-error', function () {
      casper.test.comment('Error found on Customer Information form.');
      picit(new Date().getTime() + '-34');
    }, function() {
      casper.test.comment('All is well, no form-validation-errors found');
    }, 30000);
});

casper.then(function() {
  casper.waitForSelector('#CreditCardId', function () {
      casper.test.comment('No address confirmation page. Moving on!');
      picit(new Date().getTime() + '-payment-page');
    }, function() {
      casper.test.comment('Address needs to be confirmed...');
      picit(new Date().getTime() + '-address-confirmation');
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
    picit(new Date().getTime() + '-after-payment-info');
  });
});

casper.then(function () {
  casper.waitForSelector('#submitButton', function () {

      casper.test.comment('SubmitButton VISIBLE!');

    }, function() {
      casper.test.comment('SubmitButton NOT visible.');
    }, 30000);
});

// RUN IIIIIIIIIIIT!
casper.run();