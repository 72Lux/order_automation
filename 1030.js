  require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = imageHome + filename + '.png' || 'default_screen_caps/results.png';
  casper.test.comment('Cheeeeeeese!');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 480,
    height: 5000
  });
});

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js"],
  onAlert: function () {
    casper.test.comment('an alert was triggered');  // this is used to test whether a size/color combo was actually chosen
    picit('alert');
  },
  verbose: true,
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
var isSizeAvailable = false;
var isColorAvailable = false;

casper.test.comment('Order received! Id: ' + order.id + ' item count: ' + order.line_items.length + ' submitOrder: ' + order.submitOrder);

var lineItems = order.line_items;

casper.start();

// ADD ITEMS BEGIN

// set user agent to mobile
casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.each(lineItems, function(self, lineItem) {
  this.thenOpen(lineItem.affiliate_url, function() {

    casper.test.comment(this.getTitle());

    picit(order.id + '-before-anything');

    casper.waitForSelector('#buyButtonSubmit', function() {

      // var isSizeDropdownVisible = this.evaluate(function() { return $('.select-choice-size').length; });
      // var isSizeDropdownDisabled = this.evaluate(function() { $('.select-choice-size').hasClass("ui-state-disabled"); });
      // var sizeText = this.evaluate(function() { return $('.select-choice-size').parent().find('.ui-btn-text').text(); });

      // var isColorDropdownVisible = this.evaluate(function() { return $('.select-choice-color').length; });
      // var isColorDropdownDisabled = this.evaluate(function() { $('.select-choice-color').hasClass("ui-state-disabled"); });
      // var colorText = this.evaluate(function() { return $('.select-choice-color').parent().find('.ui-btn-text').text(); });

      if (lineItem.size) {

        casper.test.comment('Set size to: ' + lineItem.size);
        casper.test.comment('length: ' + lineItem.size.length);

        // var sizeExists = this.evaluate(function(size) { return document.getElementById(size).length; }, lineItem.size);
        // casper.test.comment('sizeExists: ' + sizeExists);

        // var sizeText = this.evaluate(function(size) { return size; }, lineItem.size);
        // casper.test.comment('sizeText: ' + sizeText);

        // if(sizeExists) {

        //   casper.then(function() { casper.click('#'+lineItem.size); });
        //   picit(order.id + '-after-size-click');

        //   // verify size got selected

        //   var sizeSelection = this.evaluate(function(size) { return $('#' + size).hasClass('selected'); }, lineItem.size);

        //   if(!sizeSelection) {
        //     casper.test.comment('ERROR: Size selection failed for orderId: ' + order.id + ' for size: ' + lineItem.size + '. Exiting...');
        //     picit(order.id + '-1');
        //     this.exit(1);
        //   }

        // } else {
        //   casper.test.comment('ERROR: OrderId: ' + order.id + '. The size unavailable: ' + lineItem.size + '. Exiting...');
        //   picit(order.id + '-32');
        //   this.exit(32);
        // }
        casper.then(function() {

          isSizeAvailable = this.evaluate(function(size) {

                                            var result = false;

                                            $('#dimension1_1 a').each(function(index, value) {

                                              if($(this).attr('id').toLowerCase().indexOf(size.toLowerCase()) >= 0) {

                                                // check if color is available
                                                if(!$(this).hasClass('unavailable')) {
                                                  // color found, click it!
                                                  // $(this).click();
                                                  // // verify the
                                                  // result = $(this).hasClass('selected');
                                                  result = true;
                                                  return;
                                                }
                                              }
                                            });

                                            // the color was not found
                                            return result;

                                          }, lineItem.size);

        });

        casper.then(function() {
          casper.test.comment('isSizeAvailable: ' + isSizeAvailable);
        });

        casper.then(function() {
          if(isSizeAvailable) {
              this.clickLabel(lineItem.size, 'a');
          } else {
            casper.test.comment('ERROR: OrderId: ' + order.id + '. The size unavailable: ' + lineItem.size + '. Exiting...');
            picit(order.id + '-32');
            this.exit(32);
          }
        });

        casper.then(function() {
          picit(order.id +  '-' + new Date().getTime() +'-after-size-click');
        });
      }

      if (lineItem.color) {

        casper.test.comment('Set color to: ' + lineItem.color);

        // eg: beauty
        // process color

        casper.then(function() {

          isColorAvailable = this.evaluate(function(color) {

                                          var result = false;

                                          $('#dimension2_1 span').each(function() {

                                            // console.log('this text: ' + $(this).text());
                                            // console.log('color text: ' + color);

                                            if($(this).text().toLowerCase().indexOf(color.toLowerCase()) >= 0) {

                                              // console.log('found!');

                                              var _parent = $(this).closest('a');

                                              // check if color is available
                                              if(!_parent.hasClass('unavailable')) {

                                                // console.log('parent does not have unavailable');
                                                // console.log('value: ' + _parent.attr('value'));
                                                // color found, click it!
                                                //TODO: this click isn't working so setting value directly in hidden input.
                                                // _parent.click();
                                                // $('#selectedSku').val(_parent.attr('value'));
                                                // verify the
                                                // alter result based on how we set the sku
                                                // result = _parent.hasClass('selected');
                                                // result = $('#selectedSku').val();

                                                // console.log(result);
                                                result = true;
                                                return;
                                              }
                                              // else {
                                              //   console.log('parent has unavailable');
                                              // }

                                            }
                                            //  else {
                                            //   console.log('not found');
                                            // }
                                          });

                                          // the color was not found
                                          return result;

                                        }, lineItem.color);
        });

        casper.then(function() {
          casper.test.comment('isColorAvailable: ' + isColorAvailable);
        });

        casper.then(function() {
          if(isColorAvailable) {
              this.clickLabel(lineItem.color, 'span');
          } else {
            casper.test.comment('ERROR: OrderId: ' + order.id + '. The color unavailable: ' + lineItem.color + '. Exiting...');
            picit(order.id + '-32');
            this.exit(32);
          }
        });

        casper.then(function() {
          picit(order.id +  '-' + new Date().getTime() +'-after-color-click');
        });

      }

      // TODO set QUANTITIES
      // casper.then(function() {
      //   var itemNumber = this.fetchText('.item .sub');

      //   casper.test.comment('ITEM NUMBER: ' + itemNumber);
      // });

      casper.test.comment('Clicking on add button...');
      casper.then(function() {
        this.click('#buyButtonSubmit');
      });

      casper.then(function() {
        picit(order.id +  '-' + new Date().getTime() +'-after-add-click');
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

// https://msecure.nordstrom.com/shoppingbag/

// casper.thenOpen('https://msecure.nordstrom.com/shoppingbag/', function() {
//   this.wait(2000, function() {
//     picit(order.id + '-shopping-bag');
//   });
// });

// HEAD TO CHECKOUT END

casper.then(function() {
  this.click('#proceed-to-checkout');
});

casper.then(function() {
  this.wait(10000, function() {
    picit(order.id + '-proceed-to-checkout');
  });
});

// NoThanksButton

casper.then(function () {
  casper.waitForSelector('#NoThanksButton', function () {

      casper.test.comment('Samples screen appeared');
      this.click('#NoThanksButton');

      // casper.open('http://m.nordstrom.com//samples/nothanks', {
      //     method: 'post',
      //     data:   {
      //         'postaction': ''
      //     }
      // });

    }, function() {
      casper.test.comment('No samples screen');
    }, 30000);
});


// Continue to Checkout

casper.then(function() {
  this.clickLabel('Continue to Checkout', 'a');
});

casper.then(function() {
  this.wait(10000, function() {
    picit(order.id + '-after-checkout');
  });
});

// casper.thenOpen('https://msecure.nordstrom.com/Address/ContactInformation', function() {
//   this.wait(10000, function() {
//     picit(order.id + '-customer-info');
//     this.exit(0);
//   });
// });

casper.then(function() {
  casper.waitForSelector('#EmailAddress', function then() {
    casper.test.comment('Begin filling out shipping form');
  },
  function () {
    casper.test.comment('Timed out, no shipping form present, exiting...');
    picit(order.id + '-15');
    casper.exit(15);
  }, 30000);
});

casper.then(function() {

  var sa = order.shipping_address;
  var ba = order.billing_address;
  var pi = order.payment;

  // action="/Address/ContactInformation"

  this.fill('form[action="/Address/ContactInformation"]', {

    'EmailAddress': ba.email,
    'ConfirmEmailAddress': ba.email,
    'PhoneNumber':   sa.phone,

    'IsSubscribed': false,

    'BillingAddress.FirstName' : ba.first_name,
    'BillingAddress.LastName' : ba.last_name,
    'BillingAddress.AddressLine1' : ba.street1,
    'BillingAddress.AddressLine2' : ba.street2,
    'BillingAddress.City' : ba.city,
    // 'BillingAddress.StateId' : ba.postal_code,
    'BillingAddress.PostalCode' : ba.postal_code,

    'ShippingAddress.FirstName' : sa.first_name,
    'ShippingAddress.LastName' : sa.last_name,
    'ShippingAddress.AddressLine1' : sa.street1,
    'ShippingAddress.AddressLine2' : sa.street2,
    'ShippingAddress.City' : sa.city,
    // 'ShippingAddress.StateId' : sa.postal_code,
    'ShippingAddress.PostalCode' : sa.postal_code

  }, false);
});

casper.then(function() {
  this.wait(10000, function() {
    picit(order.id + '-after-fill');
  });
});

casper.then(function() {
  casper.test.comment('Clicking on Save and Continue');
  this.click('#Submit1');
});

casper.then(function() {
  //field-validation-error
  casper.waitForSelector('.field-validation-error', function () {
      casper.test.comment('Error found on Customer Information form.');
      picit(order.id + '-34');
    }, function() {
      casper.test.comment('All is well, no form-validation-errors found');
    }, 30000);
});

// RUN IIIIIIIIIIIT!
casper.run();
// RUN IIIIIIIIIIIT!
casper.run();