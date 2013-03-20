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
  verbose: false,
  logLevel: "debug"
});

// casper.on('remote.message', function(msg) {
//     this.echo('### DOM Msg ###: ' + msg);
// });

var order = JSON.parse(casper.cli.args);
casper.test.comment('Order received! Id: ' + order.id + ' item count: ' + order.line_items.length);

var lineItems = order.line_items;

casper.start();

casper.each(lineItems, function(self, lineItem) {
  this.thenOpen(lineItem.affiliate_url, function() {

    casper.test.comment(this.getTitle());
    casper.waitForSelector('#topAddToCartButton', function() {

      var adLength = this.evaluate(function() { return $('#adColor').length; });

      if(!adLength) {
        casper.test.comment('ERROR: dropdowns not available yet. Exiting...');
        this.exit(1);
      }

      casper.test.comment("Dropdowns available!!! Run!");

      var isColorDropdownVisible = this.evaluate(function() { return $('#adColor .variationDD').is(":visible"); });
      var isSizeDropdownVisible = this.evaluate(function() { return $('#adSize .variationDD').is(":visible"); });

      var colorDropdownOptionText = this.evaluate(function() { return $('#adColor .variationDD option:first').text(); });
      var sizeDropdownOptionText = this.evaluate(function() { return $('#adSize .variationDD option:first').text(); });

      var colorText = this.evaluate(function() { return $('.nsStyle').text(); });
      var sizeText = this.evaluate(function() { return $('#dd1NonSelect').text(); });

      // casper.test.comment('isColorDropdownVisible: ' + isColorDropdownVisible);
      // casper.test.comment('isSizeDropdownVisible: ' + isSizeDropdownVisible);

      // casper.test.comment('colorDropdownOptionText: ' + colorDropdownOptionText);
      // casper.test.comment('sizeDropdownOptionText: ' + sizeDropdownOptionText);

      // casper.test.comment('colorText: ' + colorText);
      // casper.test.comment('sizeText: ' + sizeText);

      if (lineItem.color && lineItem.size) {

        // eg: clothes and shoes

        if(isColorDropdownVisible && isSizeDropdownVisible && (sizeDropdownOptionText === 'First, Select Size') && (colorDropdownOptionText === 'Then, Select Color')) {
          // TWO visible dropdowns
          // set both dropdowns
          // casper.test.comment('STEP1 : COLOR & SIZE');
          casper.test.comment('Set both color and size dropdowns to: ' + lineItem.color + ' & ' + lineItem.size);

          casper.then(function () {
            if(this.exists('#adSize .variationDD option[value="' + lineItem.size + '"]') && this.exists('#adColor .variationDD option[value="' + lineItem.color + '"]')) {

              casper.test.comment('Size and color available');

              this.evaluate(function (_option) {
                var $select = $('#adSize .variationDD');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.size });

              this.evaluate(function (_option) {
                var $select = $('#adColor .variationDD');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.color });

              // INSTOCK AND QTY REPEAT BEGIN
              casper.then(function () {
                casper.waitForResource('prod_stock1.gif',
                function () {
                  casper.test.comment('product is in stock!');

                  if(lineItem.qty) {
                    casper.test.comment('Attempting quantity fill');
                    this.fill('form#lineItemsForm', {
                      'qty0': lineItem.qty
                    }, false);
                  } else {
                    casper.test.comment('qty is required');
                    casper.exit(1);
                  }

                  casper.test.comment('add button found');
                  casper.click('#topAddToCartButton');

                },
                function () {
                  casper.test.comment('Product is not in stock');
                  picit();
                });
              });
              // INSTOCK AND QTY REPEAT END

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color or size unavailable: ' + lineItem.color + ' / ' + lineItem.size + '. Exiting...');
              exit(1);
            }
          });

        } else if(!isColorDropdownVisible && isSizeDropdownVisible && (sizeDropdownOptionText === 'First, Select Size') && (colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0 )) {
          // set visible color dropdown
          // casper.test.comment('STEP2 : COLOR & SIZE');
          casper.test.comment('Set size dropdown to: ' + lineItem.size);
          casper.test.comment('Color text matched for: ' + lineItem.color);

          casper.then(function () {
            if(this.exists('#adSize .variationDD option[value="' + lineItem.size + '"]')) {

              casper.test.comment('Size available');

              this.evaluate(function (_option) {
                var $select = $('#adSize .variationDD');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.size });

              // INSTOCK AND QTY REPEAT BEGIN
              casper.then(function () {
                casper.waitForResource('prod_stock1.gif',
                function () {
                  casper.test.comment('product is in stock!');

                  if(lineItem.qty) {
                    casper.test.comment('Attempting quantity fill');
                    this.fill('form#lineItemsForm', {
                      'qty0': lineItem.qty
                    }, false);
                  } else {
                    casper.test.comment('qty is required');
                    casper.exit(1);
                  }

                  casper.test.comment('add button found');
                  casper.click('#topAddToCartButton');

                },
                function () {
                  casper.test.comment('Product is not in stock');
                  picit();
                });
              });
              // INSTOCK AND QTY REPEAT END

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color unavailable: ' + lineItem.color + '. Exiting...');
              exit(1);
            }
          });

        } else if(!isColorDropdownVisible && !isSizeDropdownVisible && (sizeDropdownOptionText === 'First, Select Size') && (colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0 ) && (sizeText.toLowerCase().indexOf(lineItem.size.toLowerCase()) >= 0 )) {
          // nothing to set
          // casper.test.comment('STEP3 : COLOR & SIZE');
          casper.test.comment('No dropdowns to set!');
          casper.test.comment('Color & size text matched for: ' + lineItem.color + ' & ' + lineItem.size);
          // INSTOCK AND QTY REPEAT BEGIN
          casper.then(function () {
            casper.waitForResource('prod_stock1.gif',
            function () {
              casper.test.comment('product is in stock!');

              if(lineItem.qty) {
                casper.test.comment('Attempting quantity fill');
                this.fill('form#lineItemsForm', {
                  'qty0': lineItem.qty
                }, false);
              } else {
                casper.test.comment('qty is required');
                casper.exit(1);
              }

              casper.test.comment('add button found');
              casper.click('#topAddToCartButton');

            },
            function () {
              casper.test.comment('Product is not in stock');
              picit();
            });
          });
          // INSTOCK AND QTY REPEAT END

        } else {
          // exit with error
          // casper.test.comment('ERROR : COLOR & SIZE');
          casper.test.comment('BAD! No conditions matched for: ' + lineItem.color + ' & ' + lineItem.size);
          this.exit(1);

        }

      } else if (lineItem.color && !lineItem.size) {

        // eg: beauty
        // the color select shows up in the #adSize div when there is no size to be selected
        // so using size select instead of color

       if(sizeDropdownOptionText === 'Please Select Color') {
          // set color
          // casper.test.comment('STEP1 : COLOR ONLY');
          casper.test.comment('Set color dropdown to: ' + lineItem.color);
          casper.then(function () {
            if(this.exists('#adSize .variationDD option[value="' + lineItem.color + '"]')) {

              casper.test.comment('Color available');

              this.evaluate(function (_option) {
                var $select = $('#adSize .variationDD');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.color });

              // INSTOCK AND QTY REPEAT BEGIN
              casper.then(function () {
                casper.waitForResource('prod_stock1.gif',
                function () {
                  casper.test.comment('product is in stock!');

                  if(lineItem.qty) {
                    casper.test.comment('Attempting size fill');
                    this.fill('form#lineItemsForm', {
                      'qty0': lineItem.qty
                    }, false);
                  } else {
                    casper.test.comment('qty is required');
                    casper.exit(1);
                  }

                  casper.test.comment('add button found');
                  casper.click('#topAddToCartButton');

                },
                function () {
                  casper.test.comment('Product is not in stock');
                  picit();
                });
              });
              // INSTOCK AND QTY REPEAT END

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color unavailable: ' + lineItem.color + '. Exiting...');
              exit(1);
            }
          });

        } else {
          // exit with error
          // casper.test.comment('ERROR : COLOR ONLY');
          casper.test.coment('BAD ERROR! Color dropdown not found');
          this.exit(1);

        }

      } else {
        // exit with error
        // casper.test.comment('ERROR : NO SIZE OR COLOR');
        casper.test.comment('SUPER BAD ERROR: No size or color on lineItem. How did *that* happen for orderId: ' + order.id);
        this.exit(1);
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