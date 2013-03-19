require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = 'screen_caps/' + filename + '.png' || 'screen_caps/results.png';
  casper.test.comment('Cheeeeeeese!');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 1024,
    height: 1024
  });
});

// test whether any error messages popped up
testForm = (function () {
  return casper.then(function () {
    casper.waitFor(function () {
      return this.evaluate(function () {
        return document.querySelectorAll('table.coErrorMessageClass').length;
      });
    },
    function () {
      casper.test.comment('Error present:');
      casper.test.comment(this.evaluate(function () {
        return $('table.coErrorMessageClass td.text').text();
      }));
      picit();
      casper.test.comment('Exiting...');
      casper.exit(1);
    },
    function () {
      casper.test.comment('timed out - no error messages');
    });
  });
});

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js"],
  onAlert: function () {
    casper.test.comment('an alert was triggered');  // this is used to test whether a size/color combo was actually chosen

    this.wait(5000, function() {
      casper.test.comment("Waiting for five seconds...");
      picit('alert');
    });
  },
  // verbose: true,
  logLevel: "info"
});

var order = JSON.parse(casper.cli.args);
casper.test.comment('Order received! Id: ' + order.id + ' item count: ' + order.line_items.length);

var lineItems = order.line_items;

casper.start();

casper.each(lineItems, function(self, lineItem) {
  this.thenOpen(lineItem.affiliate_url, function() {

    this.echo(this.getTitle());
    casper.waitForSelector('#topAddToCartButton', function() {

      if(lineItem.size) {

        casper.test.comment('item size: ' + lineItem.size);

        // Select size option
        casper.then(function () {
          if(casper.exists('.lineItemOptionSelect select:nth-of-type(1) option[value="' + lineItem.size + '"]')) {
            this.evaluate(function (_option) {
              var $select = $('.lineItemOptionSelect select:nth-of-type(1)');
              $select.val(_option);
              $select.change();
            }, { _option : lineItem.size });
          } else {
            casper.test.comment('size not found / not available');
            casper.exit(1);
          }
        });
      }


      // casper.then(function () {
      //   casper.waitForResource('prod_stock1.gif',
      //   function () {
      //     casper.test.comment('product is in stock after size select!');
      //   },
      //   function () {
      //     casper.test.comment('timed out, product is either out of stock or a color needs to be selected');

      //     casper.test.assertExists('.lineItemOptionSelect select:nth-of-type(2) option[value="' + lineItem.color + '"]', 'select option[value="' + lineItem.color + '"] exists');
      //     this.evaluate(function (color) {
      //       var $select = $('.lineItemOptionSelect select:nth-of-type(2)');
      //       var _option = color;
      //       $select.val(_option);
      //       $select.change();
      //     }, lineItem.color);

      //     casper.waitForResource('prod_stock1.gif',
      //     function () {
      //       casper.test.comment('product is in stock after color!');
      //     },
      //     function () {
      //       casper.test.comment('Timed out.  Exiting.');
      //       picit();
      //       casper.exit(1);
      //     });

      //   });
      // });

      // IF SIZE is available
      // - check if dropdown (.variationDD) is visible and set (then check in-stock)
      // - or div (#dd1NonSelect) contains lineItem.size text && (check in-stock)
      // - else exit with error
      // NO ELSE

      // IF COLOR is available
      // - check if dropdown (.variationDD) is visible and set (then check in-stock)
      // - or div (#prod**NonSelect) contains lineItem.size text
      // - else exit with error
      // NO ELSE

      // QTY is always required
      // exit with error if not available

      if(lineItem.qty) {
        casper.test.comment('attempting size fill...');
        this.fill('form#lineItemsForm', {
          'qty0': lineItem.qty
        }, false);
      } else {
        casper.test.comment('qty is required');
        casper.exit(1);
      }

      casper.test.comment('add button found');
      casper.click('#topAddToCartButton');

    }, function() {

      casper.test.comment('timed out waiting for add button');
      this.exit(1);

    });

  });
});

casper.then(function () {
  casper.waitFor(function () {
    return this.evaluate(function () {
      return document.querySelectorAll('a[href="https://www.neimanmarcus.com/checkout.jsp?perCatId=&catqo=&co=true"]').length;
    });
  },
  function () {
    casper.test.comment('link to checkout visible');
    picit('end');
  },
  function () {
    casper.test.comment('timed out waiting for checkout link');
    this.exit(1);
  });
});

casper.run();