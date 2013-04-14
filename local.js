//provide cookie file at cl : casperjs --cookies-file=2.txt ua_test.js

require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = 'default_screen_caps/' + filename + '.png';
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
  verbose: false,
  logLevel: "debug"
});

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

casper.thenOpen('http://click.linksynergy.com/fs-bin/click?id=v9jIDxMZD/A&u1=&subid=0&tmpid=8156&type=10&offerid=21855&RD_PARM1=http%253A%252F%252Fshop.nordstrom.com%252Fs%252Flacoste-classic-fit-heathered-pique-polo%252F2907429', function() {
  this.wait(2000, function() {
    picit(new Date().getTime() + '-before-anything');
  });
});

casper.then(function() {
  this.clickLabel('7(xl)', 'a');
});

casper.then(function() {
  picit(new Date().getTime() + '-after-size-click');
});

casper.then(function() {
  this.clickLabel('ARGENT GREY', 'span');
});

casper.then(function() {
  picit(new Date().getTime() + '-after-color-click');
});


casper.then(function() {
  var itemNumber = this.fetchText('.item');
  casper.test.comment('ITEM NUMBER: ' + itemNumber);
});

casper.then(function() {
  // Click on 1st result link
  this.click('#buyButtonSubmit');
});

casper.then(function() {
  picit(new Date().getTime() + '-after-add-click');
});


// RUN IIIIIIIIIIIT!
casper.run();