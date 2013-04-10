require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = imageHome + filename + '.png' || 'default_screen_caps/results.png';
  casper.test.comment('Cheeeeeeese!');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 1024,
    height: 1024
  });
});

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js"],
  onAlert: function () {
    casper.test.comment('an alert was triggered');  // this is used to test whether a size/color combo was actually chosen
    picit('alert');
    exit(1);
  },
  verbose: false,
  logLevel: "debug"
});


casper.start();

casper.userAgent('Default UA');

casper.thenOpen('http://www.neimanmarcus.com/p/Yves-Saint-Laurent-Tribtoo-Patent-Pump/prod139100403/?eVar4=You%20May%20Also%20Like%20RR', function() {
  casper.test.comment(this.getTitle());
});

casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.then(function() {
  this.wait(10000, function() {
      this.echo("I've waited for ten seconds.");
  });
});

casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.thenOpen('http://www.neimanmarcus.com/p/Yves-Saint-Laurent-Tribtoo-Patent-Pump/prod139100403/?eVar4=You%20May%20Also%20Like%20RR', function() {
  casper.test.comment(this.getTitle());
});


// RUN IIIIIIIIIIIT!
casper.run();