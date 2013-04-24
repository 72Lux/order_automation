// to RUN, provide cookie file at cl :
// rm test.txt; casperjs --cookies-file=test.txt test.js

require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = '/tmp/order_automation/screen_caps/' + filename + '.png' || 'default_screen_caps/results.png';
  casper.test.comment('Cheeeeeeese!');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 1024,
    height: 1024
  });
});

// test whether any error messages popped up
testForm = (function (orderId, formType) {
  return casper.then(function () {
    casper.waitFor(function () {
      return this.evaluate(function () {
        return document.querySelectorAll('table.coErrorMessageClass').length;
      });
    },
    function () {
      casper.test.comment('Error present in ' + formType + ' form.');
      casper.test.comment(this.evaluate(function () {
        return $('table.coErrorMessageClass td.text').text();
      }));
      if(formType && (formType === 'shipping')) {
        picit(orderId + '-34');
        this.exit(34);
      } else {
        picit(orderId + '-35');
        this.exit(35);
      }
    },
    function () {
      casper.test.comment('No errors found on form');
    });
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

casper.then(function() {
  casper.test.comment('Order received! Id: ' + order.id + ' item count: ' + lineItems.length + ' submitOrder: ' + order.submitOrder);
});
casper.then(function() {
  this.echo('Order received! Id: ' + order.id + ' item count: ' + lineItems.length + ' submitOrder: ' + order.submitOrder);
});
casper.then(function() {
  this.exit(0);
});
// ADD ITEMS BEGIN


// RUN IIIIIIIIIIIT!
casper.run();