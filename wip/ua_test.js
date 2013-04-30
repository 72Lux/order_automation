// to RUN, provide cookie file at cl :
// rm ua_test.txt; casperjs --cookies-file=ua_test.txt ua_test.js

require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = 'default_screen_caps/' + filename + '.png';
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
  verbose: false,
  logLevel: "debug"
});

casper.start();

casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.thenOpen('http://click.linksynergy.com/link?id=v9jIDxMZD/A&u1=&type=15&offerid=279712&murl=http%3A%2F%2Fwww.neimanmarcus.com%2Fp%2FNeiman-Marcus-Contour-Jean-Belt-Black%2Fprod150910006_cat4300731__%2F%3Ficid%3D%26searchType%3DEndecaDrivenCat%26rte%3D%25252Fcategory.service%25253FitemId%25253Dcat4300731%252526pageSize%25253D30%252526No%25253D120%252526refinements%25253D%26eItemId%3Dprod150910006%26cmCat%3Dproduct', function() {
  this.wait(2000, function() {
    casper.test.comment('Title: ' + casper.getTitle());
    casper.test.comment('URL: ' + casper.getCurrentUrl());
  });
});

// RUN IIIIIIIIIIIT!
casper.run();