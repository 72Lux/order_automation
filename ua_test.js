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

casper.userAgent('Default UA');

casper.thenOpen('http://click.linksynergy.com/link?id=v9jIDxMZD/A&u1=&type=15&offerid=279712&murl=http%3A%2F%2Fwww.neimanmarcus.com%2Fp%2FEberjey-Gisele-Short-Pajamas-Eggplant-Pink%2Fprod152510464_cat10360732__%2F%3Ficid%3D%26searchType%3DEndecaDrivenCat%26rte%3D%25252Fcategory.service%25253FitemId%25253Dcat10360732%252526pageSize%25253D30%252526No%25253D60%252526refinements%25253D%26eItemId%3Dprod152510464%26cmCat%3Dproduct', function() {
  this.wait(5000, function() {
    casper.test.comment(this.getTitle());
  });
});

casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.thenOpen('http://click.linksynergy.com/link?id=v9jIDxMZD/A&u1=&type=15&offerid=279712&murl=http%3A%2F%2Fwww.neimanmarcus.com%2Fp%2FEberjey-Gisele-Short-Pajamas-Eggplant-Pink%2Fprod152510464_cat10360732__%2F%3Ficid%3D%26searchType%3DEndecaDrivenCat%26rte%3D%25252Fcategory.service%25253FitemId%25253Dcat10360732%252526pageSize%25253D30%252526No%25253D60%252526refinements%25253D%26eItemId%3Dprod152510464%26cmCat%3Dproduct', function() {
  this.wait(5000, function() {
    casper.test.comment(this.getTitle());
  });

  // casper.then(function() {
  //   casper.waitForSelector('.btn-addtocart', function() {
  //     picit('before');

  //     this.fill('form', {'select-choice-size': 'LARGE/10-12'}, false);

  //     picit('after');
  //   }, function() {
  //     casper.test.comment('Timed out waiting for add to bag button');
  //     picit('error');
  //     this.exit(1);
  //   });
  // });

});

// RUN IIIIIIIIIIIT!
casper.run();