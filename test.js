// to RUN, provide cookie file at cl :
// rm test.txt; casperjs --cookies-file=test.txt test.js

require("utils");


var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js","lux-client-utils.js"],
  verbose: false,
  logLevel: "debug"
});

casper.start();

casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.thenOpen('http://combinecouture.com/?orderNumber=123456', function() {

  casper.then(function() {
    var currentUrl = this.getCurrentUrl();

    if(currentUrl && currentUrl.indexOf('orderNumber=')) {
      var orderNumber = currentUrl.substring(currentUrl.indexOf('orderNumber=')+12);
      casper.test.comment('Nordstrom order number: ' + orderNumber);
    } else {
      casper.test.comment('Nordstrom order number not found.');
    }

  });

});

// RUN IIIIIIIIIIIT!
casper.run();