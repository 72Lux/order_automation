// This version of the code uses the mobile user agent and attempts to process the order using the mobile
// version of NM site.
// The pending issue has been with trying to select a color and size dropdowns since they aren't regular
// selects but rather have some javascript tied to the click that then probably does some sets
// and displays the selected value in a span.

// PRODUCTS USED FOR TESTING
// These products are examples of the different ways size and color is rendered on neimanmarcus.com

// COLOR.dropdown : YES
// SIZE.dropdown : YES
// http://www.neimanmarcus.com/p/Yves-Saint-Laurent-Tribtoo-Patent-Pump/prod139100403/?eVar4=You%20May%20Also%20Like%20RR

// COLOR.dropdown : NO
// SIZE.dropdown : YES
// http://www.neimanmarcus.com/p/Dolce-Gabbana-Martini-Stretch-Wool-Suit-Black/prod147270408_cat11940745__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.service%253FitemId%253Dcat11940745%2526pageSize%253D30%2526No%253D90%2526refinements%253D&eItemId=prod147270408&cmCat=product&ecid=NMALRv9jIDxMZD/A&CS_003=5630585

// COLOR.dropdown : YES
// SIZE.dropdown : NO
// http://www.neimanmarcus.com/p/Sisley-Paris-Hydrating-Long-Lasting-Lipstick/prod20521024/?eVar4=You%20May%20Also%20Like%20RR

// COLOR.dropdown : NO
// SIZE.dropdown : NO
// http://www.neimanmarcus.com/p/Hugo-Boss-Three-Piece-Plaid-Suit/prod150180164_cat11940745__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.service%253FitemId%253Dcat11940745%2526pageSize%253D30%2526No%253D90%2526refinements%253D&eItemId=prod150180164&cmCat=product&ecid=NMALRv9jIDxMZD/A&CS_003=5630585#mycart

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

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js"],
  onAlert: function () {
    casper.test.comment('an alert was triggered');  // this is used to test whether a size/color combo was actually chosen
    picit('alert');
  },
  verbose: false,
  logLevel: "debug"
});

// casper.on('remote.message', function(msg) {
//     this.echo('### DOM Msg ###: ' + msg);
// });

// SELECTORS END

var order = JSON.parse(casper.cli.args);
var auth = casper.cli.get('auth');
var commentUrl = casper.cli.get('comment-url');
var imageHome = casper.cli.get('image-home');

casper.test.comment('Order received! Id: ' + order.id + ' item count: ' + order.line_items.length + ' submitOrder: ' + order.submitOrder);

var lineItems = order.line_items;

casper.start();

// ADD ITEMS BEGIN

casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.each(lineItems, function(self, lineItem) {
  this.thenOpen(lineItem.affiliate_url, function() {

    casper.test.comment(this.getTitle());

    // picit(order.id + '-before-anything');

    casper.waitForSelector('.btn-addtocart', function() {


      var isSizeDropdownVisible = this.evaluate(function() { return $('.select-choice-size').length; });
      var isSizeDropdownDisabled = this.evaluate(function() { $('.select-choice-size').hasClass("ui-state-disabled"); });
      var sizeText = this.evaluate(function() { return $('.select-choice-size').parent().find('.ui-btn-text').text(); });

      var isColorDropdownVisible = this.evaluate(function() { return $('.select-choice-color').length; });
      var isColorDropdownDisabled = this.evaluate(function() { $('.select-choice-color').hasClass("ui-state-disabled"); });
      var colorText = this.evaluate(function() { return $('.select-choice-color').parent().find('.ui-btn-text').text(); });

      if (lineItem.color && lineItem.size) {

        casper.test.comment('Set / verify color and size dropdowns to: ' + lineItem.color + ' & ' + lineItem.size);

        if(isColorDropdownVisible && isSizeDropdownVisible) {

          // a product has both color and size

          casper.then(function () {

            // process size

            if(!isSizeDropdownDisabled && this.exists('.select-choice-size' + ' option[value="' + lineItem.size + '"]')) {

              // the size dropdown is not disabled, so attempt to set the input

              casper.test.comment('Size available');

              // this.evaluate(function (_option) {
              //   var $select = $('.select-choice-size');
              //   $select.val(_option);
              //   $select.change();
              // }, { _option : lineItem.size });

              // this.evaluate(function() {
              //   $('.select-choice-size').click();
              // });

              casper.click('.select-choice-size');

              picit('step1');

              // verify that the size get set correctly

              sizeText = this.evaluate(function() { return $('.select-choice-size').parent().find('.ui-btn-text').text(); });

              if(sizeText.toLowerCase().indexOf(lineItem.size.toLowerCase()) >= 0) {
                casper.test.comment('The size got set correctly for order.id: ' + order.id + ' size: ' + sizeText);
              } else {
                casper.test.comment('ERROR: Size was available but was not set for orderId: ' + order.id + ' size: ' + lineItem.size + ' for line_item_id: ' + lineItem.line_item_id + '. Exiting...');
                picit(order.id + '-1');
                this.exit(1);
              }

            } else if(isSizeDropdownDisabled && sizeText.toLowerCase().indexOf(lineItem.size.toLowerCase()) >= 0) {

              // the size dropdown is disabled, so just check to see that that selected size (which is in a separate span)
              // matches the lineItem size

              casper.test.comment('Size text matched for: ' + lineItem.size);

            } else {

              // error state
              // we have a color on the item but cannot find a match on the website

              casper.test.comment('ERROR: OrderId: ' + order.id + '. The size unavailable: ' + lineItem.size + '. Exiting...');
              picit(order.id + '-32');
              this.exit(32);
            }

            // process color

            // these need to be recalculated at this point since sometimes colors are limited
            // by the size you select and the color will become disabled

            isColorDropdownDisabled = this.evaluate(function() { $('.select-choice-color').hasClass("ui-state-disabled"); });
            colorText = this.evaluate(function() { return $('.select-choice-color').parent().find('.ui-btn-text').text(); });

            if(!isColorDropdownDisabled && this.exists('.select-choice-color' + ' option[value="' + lineItem.color + '"]')) {

              // the color dropdown is not disabled, so attempt to set the input

              casper.test.comment('Color available');

              this.evaluate(function (_option) {
                var $select = $('.select-choice-color');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.color });

              // verify that the color get set correctly

              colorText = this.evaluate(function() { return $('.select-choice-color').parent().find('.ui-btn-text').text(); });

              if(colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0) {
                casper.test.comment('The color got set correctly for order.id: ' + order.id + ' color: ' + colorText);
              } else {
                casper.test.comment('ERROR: OrderId: ' + order.id + ' color: ' + lineItem.color + ' for line_item_id: ' + lineItem.line_item_id + '. Exiting...');
                picit(order.id + '-1');
                this.exit(1);
              }

            } else if(isColorDropdownDisabled && colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0) {

              // the color dropdown is disabled, so just check to see that that selected color (which is in a separate span)
              // matches the lineItem color

              casper.test.comment('Color text matched for: ' + lineItem.color);

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color unavailable: ' + lineItem.color + ' for line_item_id: ' + lineItem.line_item_id + '. Exiting...');
              picit(order.id + '-32');
              this.exit(32);
            }

          });

        } else {

          casper.test.comment('ERROR: OrderId: ' + order.id + ' The color and size dropdowns are not available for line_item_id: ' + lineItem.line_item_id + '.Exiting...');

          picit(order.id + '-1');
          this.exit(1);
        }

      } else if (lineItem.color && !lineItem.size) {

        // eg: beauty
        // process color

        if(isColorDropdownVisible) {

          if(!isColorDropdownDisabled && this.exists('.select-choice-color' + ' option[value="' + lineItem.color + '"]')) {

            // the color dropdown is not disabled, so attempt to set the input

            casper.test.comment('Color available');

            this.evaluate(function (_option) {
              var $select = $('.select-choice-color');
              $select.val(_option);
              $select.change();
            }, { _option : lineItem.color });

            // verify that the color get set correctly

            colorText = this.evaluate(function() { return $('.select-choice-color').parent().find('.ui-btn-text').text(); });

            if(colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0) {
              casper.test.comment('The color got set correctly for order.id: ' + order.id + ' color: ' + colorText);
            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color: ' + lineItem.color + ' for line_item_id: ' + lineItem.line_item_id + '. Exiting...');
              picit(order.id + '-1');
              this.exit(1);
            }

          } else if(isColorDropdownDisabled && colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0) {

            // the color dropdown is disabled, so just check to see that that selected color (which is in a separate span)
            // matches the lineItem color

            casper.test.comment('Color text matched for: ' + lineItem.color);

          } else {
            casper.test.comment('ERROR: OrderId: ' + order.id + ' color unavailable: ' + lineItem.color + ' for line_item_id: ' + lineItem.line_item_id + '. Exiting...');
            picit(order.id + '-32');
            this.exit(32);
          }

        } else {
          // exit with error
          // casper.test.comment('ERROR : COLOR ONLY');
          casper.test.coment('ERROR: BAD! Color dropdown not found');
          picit(order.id + '-11');
          this.exit(11);

        }

      }

      // check for in stock
      // and set quantity

      casper.then(function () {

        casper.wait(2000, function () {
          var isInStock = this.evaluate(function checkForInstock() {
              return $('.stockStatus').length && $('.stockStatus').text().toLowerCase().indexOf('in stock') >= 0 ;
          });

          if(isInStock) {

            if(lineItem.qty) {
              casper.test.comment('Setting qty to: ' + lineItem.qty);
              this.evaluate(function setQuantity() {
                $('#quantity').val(lineItem.qty);
              });
            } else {
              casper.test.comment('qty is required');
              picit(order.id + '-42');
              this.exit(42);
            }

            casper.test.comment('add button found');
            casper.click('.btn-addtocart');

          } else {

            casper.test.comment('Product is not in stock');
            picit(order.id + '-31');
            this.exit(31);

          }
        });

      });

    }, function() {

      casper.test.comment('Timed out waiting for add to bag button');
      picit(order.id + '-12');
      this.exit(12);

    });

  });
});

// ADD ITEMS END

// HEAD TO CHECKOUT BEGIN

// verify link is available
casper.then(function () {
  casper.waitFor(function () {
    return this.evaluate(function () {
      return document.querySelectorAll('a[href="https://www.neimanmarcus.com/mcheckout.jsp"]').length;
    });
  },
  function () {
    casper.test.comment('Link to checkout visible');
  },
  function () {
    casper.test.comment('Timed out waiting for checkout link');
    picit(order.id + '-13');
    this.exit(13);
  });
});

// // click checkout link
casper.then(function () {
  casper.click('a[href="https://www.neimanmarcus.com/mcheckout.jsp"]');

});

// wait for cartContinue
casper.waitForSelector('#cartContinue', function() {

  casper.test.comment('cartContinue visible!');
  picit(order.id + '-0');
  this.exit(0);

}, function() {

  casper.test.comment('Timed out waiting for cartContinue...');
  picit(order.id + '-1');
  this.exit(1);

}, 60000);


// RUN IIIIIIIIIIIT!
casper.run();