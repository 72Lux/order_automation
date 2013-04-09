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

// test whether any error messages popped up
testForm = (function (orderId, formType) {

  return true;

  // var errorLength = casper.evaluate(function() {
  //   return $('#errmsg').length;
  // });

  // if(errorLength) {

  //   casper.test.comment('Error present in ' + formType + ' form.');
  //   casper.test.comment(casper.evaluate(function () {
  //     return $('#errmsg').text();
  //   }));
  //   if(formType && (formType === 'shipping')) {
  //     picit(orderId + '-34');
  //     casper.exit(34);
  //   } else {
  //     picit(orderId + '-35');
  //     casper.exit(35);
  //   }

  // } else {
  //   casper.test.comment('No errors found on ' +  formType + ' form');
  // }

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

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31');

// ADD ITEMS BEGIN

casper.each(lineItems, function(self, lineItem) {
  this.thenOpen(lineItem.affiliate_url, function() {

    casper.test.comment(this.getTitle());

    // picit(order.id + '-before-anything');

    casper.waitForSelector('#topAddToCartButton', function() {

      var isSizeDropdownVisible = this.evaluate(function() { return $('[id ^=prod][id $=DD1]').is(":visible"); });
      var isColorDropdownVisible = this.evaluate(function() { return $('[id ^=prod][id $=DD2]').is(":visible"); });

      var sizeDropdownOptionText = this.evaluate(function() { return $('[id ^=prod][id $=DD1]' + ' option:first').text(); });
      var colorDropdownOptionText = this.evaluate(function() { return $('[id ^=prod][id $=DD2]' + ' option:first').text(); });

      var colorText = this.evaluate(function() { return $('.lineItemOptionSelect .nsStyle').text(); });
      var sizeText = this.evaluate(function() { return $('.lineItemOptionSelect #dd1NonSelect').text(); });

      if (lineItem.color && lineItem.size) {

        // eg: clothes and shoes

        if(isColorDropdownVisible && isSizeDropdownVisible && (sizeDropdownOptionText === 'First, Select Size') && (colorDropdownOptionText === 'Then, Select Color')) {
          // TWO visible dropdowns
          // set both dropdowns
          // casper.test.comment('STEP1 : COLOR & SIZE');
          casper.test.comment('Set both color and size dropdowns to: ' + lineItem.color + ' & ' + lineItem.size);

          casper.then(function () {
            if(this.exists('[id ^=prod][id $=DD1]' + ' option[value="' + lineItem.size + '"]')) {

              casper.test.comment('Size available');

              this.evaluate(function (_option) {
                var $select = $('[id ^=prod][id $=DD1]');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.size });

              // these need to be recalculated at this point since sometimes colors are limited
              // by the size you select and the color dropdown dissappears on select

              isColorDropdownVisible = this.evaluate(function() { return $('[id ^=prod][id $=DD2]').is(":visible"); });
              colorText = this.evaluate(function() { return $('.lineItemOptionSelect .nsStyle').text(); });

              if(isColorDropdownVisible && this.exists('[id ^=prod][id $=DD2]' + ' option[value="' + lineItem.color + '"]')) {

                casper.test.comment('Color available');

                this.evaluate(function (_option) {
                  var $select = $('[id ^=prod][id $=DD2]');
                  $select.val(_option);
                  $select.change();
                }, { _option : lineItem.color });

              } else if(colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0) {
                casper.test.comment('Color text matched for: ' + lineItem.color);
              } else {
                casper.test.comment('ERROR: OrderId: ' + order.id + ' color unavailable: ' + lineItem.color + ' for size: ' + lineItem.size + '. Exiting...');
                picit(order.id + '-32');
                this.exit(32);
              }

              // INSTOCK AND QTY REPEAT BEGIN
              casper.then(function () {

                casper.wait(2000, function () {
                  var inStockVisible = this.evaluate(function checkForInstock() {
                      return $('.prodStatus img').attr('src').indexOf('stock') >= 0 ;
                  });

                  if(inStockVisible) {

                    if(lineItem.qty) {
                      casper.test.comment('Setting qty to: ' + lineItem.qty);
                      this.fill('#lineItemsForm', {
                        'qty0': lineItem.qty
                      }, false);
                    } else {
                      casper.test.comment('qty is required');
                      picit(order.id + '-42');
                      this.exit(42);
                    }

                    casper.test.comment('add button found');
                    casper.click('#topAddToCartButton');

                  } else {

                    casper.test.comment('Product is not in stock');
                    picit(order.id + '-31');
                    this.exit(31);

                  }
                });

              });
              // INSTOCK AND QTY REPEAT END

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color or size unavailable: ' + lineItem.color + ' / ' + lineItem.size + '. Exiting...');
              picit(order.id + '-32');
              this.exit(32);
            }
          });

        } else if(!isColorDropdownVisible && isSizeDropdownVisible && (sizeDropdownOptionText === 'First, Select Size') && (colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0)) {
          // set visible color dropdown
          // casper.test.comment('STEP2 : COLOR & SIZE');
          casper.test.comment('Set size dropdown to: ' + lineItem.size);
          casper.test.comment('Color text matched for: ' + lineItem.color);

          casper.then(function () {

            if(this.exists('[id ^=prod][id $=DD1]' + ' option[value="' + lineItem.size + '"]')) {

              casper.test.comment('Size available');

              this.evaluate(function (_option) {
                var $select = $('[id ^=prod][id $=DD1]');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.size });

              // INSTOCK AND QTY REPEAT BEGIN
              casper.then(function () {


                casper.wait(2000, function () {
                  var inStockVisible = this.evaluate(function checkForInstock() {
                      return $('.prodStatus img').attr('src').indexOf('stock') >= 0 ;
                  });

                  if(inStockVisible) {

                    if(lineItem.qty) {
                      casper.test.comment('Setting qty to: ' + lineItem.qty);
                      this.fill('#lineItemsForm', {
                        'qty0': lineItem.qty
                      }, false);
                    } else {
                      casper.test.comment('qty is required');
                      picit(order.id + '-42');
                      this.exit(42);
                    }

                    casper.test.comment('add button found');
                    casper.click('#topAddToCartButton');

                  } else {

                    casper.test.comment('Product is not in stock');
                    picit(order.id + '-31');
                    this.exit(31);

                  }
                });

              });
              // INSTOCK AND QTY REPEAT END

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color unavailable: ' + lineItem.color + '. Exiting...');
              picit(order.id + '-33');
              this.exit(33);
            }
          });

        } else if(!isColorDropdownVisible && !isSizeDropdownVisible && (sizeDropdownOptionText === 'First, Select Size') && (colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0 ) && (sizeText.toLowerCase().indexOf(lineItem.size.toLowerCase()) >= 0 )) {
          // nothing to set
          // casper.test.comment('STEP3 : COLOR & SIZE');
          casper.test.comment('No dropdowns to set!');
          casper.test.comment('Color & size text matched for: ' + lineItem.color + ' & ' + lineItem.size);
          // INSTOCK AND QTY REPEAT BEGIN
          casper.then(function () {

            casper.wait(2000, function () {
              var inStockVisible = this.evaluate(function checkForInstock() {
                  return $('.prodStatus img').attr('src').indexOf('stock') >= 0 ;
              });

              if(inStockVisible) {

                if(lineItem.qty) {
                  casper.test.comment('Setting qty to: ' + lineItem.qty);
                  this.fill('#lineItemsForm', {
                    'qty0': lineItem.qty
                  }, false);
                } else {
                  casper.test.comment('qty is required');
                  picit(order.id + '-42');
                  this.exit(42);
                }

                casper.test.comment('add button found');
                casper.click('#topAddToCartButton');

              } else {

                casper.test.comment('Product is not in stock');
                picit(order.id + '-31');
                this.exit(31);

              }
            });

          });
          // INSTOCK AND QTY REPEAT END

        } else {
          // exit with error
          // casper.test.comment('ERROR : COLOR & SIZE');
          casper.test.comment('ERROR: BAD! No conditions matched for: ' + lineItem.color + ' & ' + lineItem.size);
          picit(order.id + '-41');
          this.exit(41);

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
            if(this.exists('[id ^=prod][id $=DD1]' + ' option[value="' + lineItem.color + '"]')) {

              casper.test.comment('Color available');

              this.evaluate(function (_option) {
                var $select = $('[id ^=prod][id $=DD1]');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.color });

              // INSTOCK AND QTY REPEAT BEGIN
              casper.then(function () {


                casper.wait(2000, function () {
                  var inStockVisible = this.evaluate(function checkForInstock() {
                      return $('.prodStatus img').attr('src').indexOf('stock') >= 0 ;
                  });

                  if(inStockVisible) {

                    if(lineItem.qty) {
                      casper.test.comment('Setting qty to: ' + lineItem.qty);
                      this.fill('#lineItemsForm', {
                        'qty0': lineItem.qty
                      }, false);
                    } else {
                      casper.test.comment('qty is required');
                      picit(order.id + '-42');
                      this.exit(42);
                    }

                    casper.test.comment('add button found');
                    casper.click('#topAddToCartButton');

                  } else {

                    casper.test.comment('Product is not in stock');
                    picit(order.id + '-31');
                    this.exit(31);

                  }
                });

              });
              // INSTOCK AND QTY REPEAT END

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color unavailable: ' + lineItem.color + '. Exiting...');
              picit(order.id + '-33');
              this.exit(33);
            }
          });

        } else {
          // exit with error
          // casper.test.comment('ERROR : COLOR ONLY');
          casper.test.coment('ERROR: BAD! Color dropdown not found');
          picit(order.id + '-11');
          this.exit(11);

        }

      } else {
        // casper.test.comment('ERROR : NO SIZE OR COLOR');
        // implies something like a beauty item
        // just set qty, check for instock and add to bag

        casper.then(function () {

          casper.wait(2000, function () {
            var inStockVisible = this.evaluate(function checkForInstock() {
                return $('.prodStatus img').attr('src').indexOf('stock') >= 0 ;
            });

            if(inStockVisible) {

              if(lineItem.qty) {
                casper.test.comment('Setting qty to: ' + lineItem.qty);
                this.fill('#lineItemsForm', {
                  'qty0': lineItem.qty
                }, false);
              } else {
                casper.test.comment('qty is required');
                picit(order.id + '-42');
                this.exit(42);
              }

              casper.test.comment('add button found');
              casper.click('#topAddToCartButton');

            } else {

              casper.test.comment('Product is not in stock');
              picit(order.id + '-31');
              this.exit(31);

            }
          });

        });
      }

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
// casper.then(function () {
//   casper.waitFor(function () {
//     return this.evaluate(function () {
//       return document.querySelectorAll('a[href="https://www.neimanmarcus.com/checkout.jsp?perCatId=&catqo=&co=true"]').length;
//     });
//   },
//   function () {
//     casper.test.comment('Link to checkout visible');
//   },
//   function () {
//     casper.test.comment('Timed out waiting for checkout link');
//     picit(order.id + '-13');
//     this.exit(13);
//   });
// });


casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

// click checkout link
casper.thenOpen('https://www.neimanmarcus.com/checkout.jsp?perCatId=&catqo=&co=true', function () {

  // wait for cartContinue
  casper.waitForSelector('#cartContinue', function() {

    casper.test.comment('cartContinue visible!');

    this.evaluate(function() { mobileCart.shoppingCartTrans(); });

    // casper.click('#cartContinue');
    casper.test.comment('cartContinue clicked.');

  }, function() {

    casper.test.comment('Timed out waiting for cartContinue...');
    picit(order.id + '-1');
    this.exit(1);

  }, 60000);

  casper.waitForSelector('#mAnonSignInBtn', function() {

    casper.test.comment('mAnonSignInBtn visible!');

    casper.click('#mAnonSignInBtn');
    casper.test.comment('mAnonSignInBtn clicked.');

  }, function() {

    casper.test.comment('Timed out waiting for mAnonSignInBtn...');
    picit(order.id + '-1');
    this.exit(1);

  }, 60000);


});

// HEAD TO CHECKOUT END

// SAMPLES POP-UP BEGIN
// TODO: don't know if we need this in the mobile checkout

// sometimes a 'sample' pop-up appears at this stage
// check for it, and if it has appeared, dismiss it!

//check for samples pop-up
// casper.then(function () {

//   casper.wait(2000, function () {
//     if(this.exists('#samplesNoButton')) {
//       casper.click('#samplesNoButton');
//       casper.test.comment('Samples pop-up appeared');
//     } else {
//       casper.test.comment('No samples pop-up');
//     }
//   });
// });

// SAMPLES POP-UP END

// SHIPPING FORM BEGIN

// check for shipping form

casper.then(function () {

  casper.test.comment('Starting to wait for shipping form...');

  casper.waitForSelector('#addressEdit', function() {
    casper.test.comment('Begin filling out shipping form');
    picit(order.id + '-before-starting');

  },
  function () {
    casper.test.comment('Timed out, no shipping form present, exiting...');
    picit(order.id + '-15');
    casper.exit(15);
  }, 120000);

});

// start filling out the shipping form
casper.then(function () {

  var sa = order.shipping_address;

  this.evaluate(function () {
    var $select = $('select#country');
    var _option = 'US';
    $select.val(_option);
    $select.change();
  });

  this.evaluate(function (state) {
    var $select = $('select#state');
    var _option = state;
    $select.val(_option);
    $select.change();
  }, sa.short_state);

  var formValues = {
    'input#saFirstName' : sa.first_name,
    'input#saLastName' : sa.last_name,
    'input#saAddressLine1' : sa.street1,
    'input#saAddressLine2' : sa.street2,
    'input#saCity' : sa.city,
    'input#saZip' : sa.postal_code,
    'input#saDayTelephone' : sa.phone
  };

  // This is for situations where form inputs have no name attribute
  this.evaluate(function (fields) {
    for (var selector in fields) {
      document.querySelector(selector).value = fields[selector];
    }
  }, { fields : formValues });

  // certain brands require an additional delivery phone number
  // eg: cole haan
  casper.then(function () {

    if(this.exists('#saDeliveryTelephone')) {

      var optionalFormValues = {
        'input#saDeliveryTelephone' : sa.phone
      };

      this.evaluate(function (fields) {
        for (var selector in fields) {
          document.querySelector(selector).value = fields[selector];
        }
      }, { fields : optionalFormValues });

      casper.test.comment('Optional delivery telephone.');

    } else {
      casper.test.comment('Optional delivery telephone not needed.');
    }
  });

  // Fill in that one radio selection
  // this.fill('form#shippingForm', {
  //   'poBox' : 'false'
  // }, false);
  this.evaluate(function () {
    document.querySelector('#addr_po_false').checked = true;
  });

  // Check/uncheck useAsBillingFlag_se
  this.evaluate(function () {
    document.querySelector('#useAsBillingFlag').checked = false;
  });

  // casper.then( function () {
  //   picit(order.id + '-shipping-form-before-submit');
  // });

  // the onclick on the shipping function doesn't work
  // so extract the id from that code and evaluate a direct call to that function

  casper.then(function () {
    var _c = this.evaluate(function() {
      var click = $('#shippingSave').attr('onclick');
      return click;
    });

    var _re = _c.match("submitShipping\\(\\'(.*)\\'\\)");

    casper.test.comment('shipping id: ' + _re[1]);

    this.evaluate(function (identifier) {
      shipping.submitShipping(identifier.toString());
    }, _re[1]);

  });

  casper.then(function () {
    casper.wait(5000, function () {
      picit(order.id + '-debug-after-shipping-click');
    });
  });


  // click NEXT step
  // casper.then(function () {
  //   if(casper.exists('span#shippingContinue_se')) {
  //     casper.wait(2000, function () {
  //       casper.click('span#shippingContinue_se');
  //     });
  //   } else {
  //     casper.test.comment('ERROR: Next button not found on shipping form');
  //     picit(order.id + '-16');
  //     this.exit(16);
  //   }
  // });

  // casper.test.comment('shipping zip length: ' + sa.postal_code.length);

  // testForm(order.id, 'shipping');

  casper.then(function() {
    var errorLength = this.evaluate(function() {
      return $('#errmsg').length && $('#errmsg').is(':visible');
    });

    if(errorLength) {
      casper.test.comment('Error present in shipping form.');
      casper.test.comment(this.evaluate(function () {
        return $('#errmsg').text();
      }));
      picit(order.id + '-34');
      casper.exit(34);
    } else {
      casper.test.comment('No errors on shipping form.');
    }
  });

});

// SHIPPING FORM END

// BILLING FORM BEGIN

// check for billing form
casper.then(function () {

  casper.waitForSelector('#payment', function() {
    casper.test.comment('Begin filling out billing form');
  },
  function () {
    casper.test.comment('Timed out, no billing form present, exiting...');
    picit(order.id + '-17');
    casper.exit(17);
  }, 120000);

});

casper.then(function () {

  var ba = order.billing_address;
  var pi = order.payment;

  this.evaluate(function () {
    var $select = $('select#billingAddrCountry');
    var _option = 'US';
    // select US
    $select.val(_option);
    $select.change();
  });
  this.evaluate(function (state) {
    var $select = $('select#billingAddrState');
    var _option = state;
    $select.val(_option);
    $select.change();
  }, ba.short_state);

  // this.evaluate(function () {
  //   var $select = $('select#billingAddrPhoneType');
  //   var _option = ba.phone;
  //   // select other
  //   $select.val(_option);
  //   $select.change();
  // });

  this.evaluate(function (card_type) {
    var $select = $('select#cardtype');
    var _option = card_type;
    $select.val(_option);
    $select.change();
  }, pi.card_type);

  var formValues = {
    'input#emailAddress' : ba.email,
    'input#billingAddrFirstName' : ba.first_name,
    'input#billingAddrLastName' : ba.last_name,
    'input#billingAddrLine1' : ba.street1,
    'input#billingAddrLine2' : ba.street2,
    'input#billingAddrCity' : ba.city,
    'input#billingAddrZipCode' : ba.postal_code,
    'input#billingAddrDayPhone' : ba.phone,
    'input#cardnumber' : pi.card_number,
    'input#securitycode' : pi.cvv,
    'input#cardExpMonth' : pi.expiry_month,
    'input#cardExpYear' : pi.expiry_year
  };

  // This is for situations where form inputs have no name attribute
  this.evaluate(function (fields) {
    for (var selector in fields) {
      document.querySelector(selector).value = fields[selector];
    }
  }, { fields : formValues });

});

// casper.then( function () {
//   picit(order.id + '-billing-form-before-submit');
// });

// click next to review
// casper.then(function () {
//   if(casper.exists('span#paymentSave')) {
//     casper.wait(2000, function () {
//       casper.click('span#paymentSave');
//     });
//   } else {
//     casper.test.comment('ERROR: Save payment button not available');
//     picit(order.id + '-18');
//     this.exit(18);
//   }
// });

casper.then(function () {
  var _c = this.evaluate(function() {
    var click = $('#paymentSave').attr('onclick');
    return click;
  });

  var _re = _c.match("submit\\(\\'(.*)\\'\\)");

  casper.test.comment('payment id: ' + _re[1]);

  this.evaluate(function (identifier) {
    payment.submit(identifier.toString());
  }, _re[1]);

});

casper.then(function () {
  casper.wait(5000, function () {
    picit(order.id + '-debug-after-billing-click');
    this.exit(0);
  });
});

// test to see if any errors popped
  casper.then(function() {
    var errorLength = this.evaluate(function() {
      return $('#errmsg').length && $('#errmsg').is(':visible');
    });

    if(errorLength) {
      casper.test.comment('Error present in billing form.');
      casper.test.comment(this.evaluate(function () {
        return $('#errmsg').text();
      }));
      picit(order.id + '-35');
      casper.exit(35);
    } else {
      casper.test.comment('No errors on billing form.');
    }
  });

// BILLING FORM END

// DISMISS ANY ORDER CONFIRMATION POP-UP BEGIN

// confirm address
// casper.then(function () {
//   casper.waitFor(function (){
//     return this.evaluate(function () {
//       return document.querySelector('#avAddressList form').length;
//     });
//   },
//   function (){
//     casper.test.comment('Need to verify address');
//     casper.click('span#verificationButton');
//   },
//   function (){
//     casper.test.comment('No need to verify address');
//   });
// });

// DISMISS ANY ORDER CONFIRMATION POP-UP END

//CLICK ON SUBMIT
casper.then(function () {

  casper.wait(5000, function () {
    if(casper.exists('.placeOrder')) {

      casper.test.comment('order.submitOrder set to: ' + order.submitOrder);

      if(order.submitOrder) {
        // TODO: OMG! ARE YOU READY FOR THIS?

        this.evaluate(function() {
          payment.placeOrder();
        });

        casper.test.comment('Submit button CLICKED!');
      } else {
        casper.test.comment('Submit button visible!');
      }

    } else {
      casper.test.comment('ERROR: Submit order button not available');
      picit(order.id + '-18');
      this.exit(18);
    }
  });

});

// check for success or errors
casper.then(function () {
  casper.wait(20000, function () {

    if(order.submitOrder) {
      if(casper.exists('#confirmSummary')) {

        casper.then(function() {
          var confirmationMsg = this.evaluate(function parseConfirmationMsg() { return $('#confirmSummary').html();});
        });

        if(auth && commentUrl) {

          casper.then(function() {
            casper.test.comment('Sending confirmation comment to order with id: ' + order.id);
          });

          casper.open(commentUrl, {
              method: 'post',
              data:   {
                'comment': 'CONFIRMATION #: ' + confirmationMsg
              },
              headers: {
                'Authorization' : auth
              }
          });

          casper.then(function() {
            casper.test.comment('Confirmation # posted!');
          });

        } else {
          casper.then(function() {
            casper.test.comment('Could not post confirmation comment. Auth or comment-url unavailable.');
          });
       }

        casper.then(function() {
          picit(order.id + '-0');
          casper.exit(0);
        });

      } else {
        casper.then(function() {
          casper.test.comment('ERROR: Could not find order confirmation text.');
          picit(order.id + '-20');
          casper.exit(20);
        });
      }

    } else {

      casper.then(function() {
        casper.test.comment('Submit is set to ' + order.submitOrder + ', so you will not see the confirmation page.');
      });

      if(auth && commentUrl) {

        casper.then(function() {
          casper.test.comment('Sending confirmation comment to order with id: ' + order.id);
        });

        casper.open(commentUrl, {
            method: 'post',
            data:   {
              'comment': 'CONFIRMATION #: Since submitOrder is set to false, no soup for you!'
            },
            headers: {
              'Authorization' : auth
            }
        });

        casper.then(function() {
          casper.test.comment('Confirmation # posted!');
        });
      } else {
        casper.then(function() {
          casper.test.comment('Could not post confirmation comment. Auth or comment-url unavailable.');
        });
      }

      casper.then(function() {
        picit(order.id + '-0');
        casper.exit(0);
      });
    }
  });
});

// RUN IIIIIIIIIIIT!
casper.run();