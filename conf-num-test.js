// to run from cli:
// rm cnum-test.txt; casperjs --cookies-file=cnum-test.txt cnum-test.js

require("utils");

// HELPER FUNCTIONS

// screen capture
picit = (function (filename) {
  if(!imageHome) { imageHome = '.'; }
  filename = imageHome + '/' + 'cnum-test' + '-' + filename + '.png' || 'default_screen_caps/results.png';
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

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js","lux-client-utils.js"],
  verbose: false,
  logLevel: "debug"
});

// casper.on('remote.message', function(msg) {
//     this.echo('### DOM Msg ###: ' + msg);
// });

// SELECTORS END

var order = {
  id: 'Test-test-' + new Date().getTime(),
  submitOrder: false,
  shipping_address: {
    first_name: 'Nick',
    last_name: 'Drake',
    street1: '5129 Papaya Dr',
    street2: '',
    city: 'Fair Oaks',
    state: 'California',
    short_state: 'CA',
    postal_code: '95628',
    phone: '1231231234'
  },
  billing_address: {
    email: 'test@test.com',
    first_name: 'Nick',
    last_name: 'Drake',
    street1: '5129 Papaya Dr',
    street2: '',
    city: 'Fair Oaks',
    state: 'California',
    short_state: 'CA',
    postal_code: '95628',
    phone: '1231231234'
  },
  payment: {
    card_type: 'Visa',
    card_number: '4111111111111111',
    cvv: '123',
    expiry_month: '12',
    expiry_year: '2020'
  }
};

var lineItems = [];

var item0 = {
    name: "Contour Jean Belt, Black",
    affiliate_url: 'http://click.linksynergy.com/link?id=v9jIDxMZD/A&u1=&type=15&offerid=279712&murl=http%3A%2F%2Fwww.neimanmarcus.com%2Fp%2FNeiman-Marcus-Contour-Jean-Belt-Black%2Fprod150910006_cat4300731__%2F%3Ficid%3D%26searchType%3DEndecaDrivenCat%26rte%3D%25252Fcategory.service%25253FitemId%25253Dcat4300731%252526pageSize%25253D30%252526No%25253D120%252526refinements%25253D%26eItemId%3Dprod150910006%26cmCat%3Dproduct',
    size: 'SMALL',
    color: 'BLACK',
    qty: 1
  };

lineItems.push(item0);

var item1 = {
  name: "Wing-Tip Chelsea Boot",
  affiliate_url: 'http://click.linksynergy.com/link?id=v9jIDxMZD/A&u1=&type=15&offerid=279712&murl=http%3A%2F%2Fwww.neimanmarcus.com%2Fp%2FPrada-Wing-Tip-Chelsea-Boot%2Fprod146820012_cat000550__%2F%3Ficid%3D%26searchType%3DEndecaDrivenCat%26rte%3D%25252Fcategory.service%25253FitemId%25253Dcat000550%252526pageSize%25253D30%252526No%25253D600%252526refinements%25253D%26eItemId%3Dprod146820012%26cmCat%3Dproduct',
  size: '7/8D',
  color: '',
  qty: 1
};

lineItems.push(item1);

// var item2 = {
//     name: "Classic Fit Heathered Pique Polo",
//     affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flacoste-classic-fit-heathered-pique-polo%252F2907429',
//     size: '7(xl)',
//     color: 'ARGENT GREY',
//     qty: 2
//   };

// lineItems.push(item2);

// var item3 = {
//     name: "'Tonique Douceur' Alcohol-Free Freshener (6.8 oz.)",
//     affiliate_url: 'http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flancome-tonique-douceur-alcohol-free-freshener-6-8-oz%252F2786742',
//     size: '6.8 oz',
//     color: '',
//     qty: 2
//   };

// lineItems.push(item3);

var auth = casper.cli.get('auth');
var commentUrl = casper.cli.get('comment-url');
var imageHome = casper.cli.get('image-home');

casper.start();

casper.start('http://combinecouture.com/confirmation-links.html', function() {
  this.echo("Confirmation page loaded.");
});


casper.then(function() {
  this.click('#n-conf-page');
});

casper.then(function() {
  picit('test');
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
      logMessage('Order Id [' + order.id + '] Nordstrom order number [' + confirmationMsg + ']');
    });


  }, function() {
    casper.then(function() {
      logError('Confirmation message found [false]');
      exitProcess(20);
    });
  }, 30000);
});

casper.then(function() {
  this.exit(0);
});
// ADD ITEMS BEGIN


// RUN IIIIIIIIIIIT!
casper.run();