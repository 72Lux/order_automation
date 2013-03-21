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
testForm = (function (orderId) {
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
      picit(orderId + '-form-error');
      casper.test.comment('Exiting...');
      this.exit(1);
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

// ADD ITEMS BEGIN

casper.each(lineItems, function(self, lineItem) {
  this.thenOpen(lineItem.affiliate_url, function() {

    casper.test.comment(this.getTitle());
    casper.waitForSelector('#topAddToCartButton', function() {

      var adLength = this.evaluate(function() { return $('#adColor').length; });

      // casper.then(function () {

      //   while(!adLength) {
      //     casper.wait(2000, function () {
      //       adLength = this.evaluate(function() { return $('#adColor').length; });
      //     });
      //   }

      // });

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

      if (lineItem.color && lineItem.size) {

        // eg: clothes and shoes

        if(isColorDropdownVisible && isSizeDropdownVisible && (sizeDropdownOptionText === 'First, Select Size') && (colorDropdownOptionText === 'Then, Select Color')) {
          // TWO visible dropdowns
          // set both dropdowns
          // casper.test.comment('STEP1 : COLOR & SIZE');
          casper.test.comment('Set both color and size dropdowns to: ' + lineItem.color + ' & ' + lineItem.size);

          casper.then(function () {
            if(this.exists('#adSize .variationDD option[value="' + lineItem.size + '"]')) {

              casper.test.comment('Size available');

              this.evaluate(function (_option) {
                var $select = $('#adSize .variationDD');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.size });

              // these need to be recalculated at this point since sometimes colors are limited
              // by the size you select and the color dropdown dissappears on select

              isColorDropdownVisible = this.evaluate(function() { return $('#adColor .variationDD').is(":visible"); });
              colorText = this.evaluate(function() { return $('.nsStyle').text(); });

              if(isColorDropdownVisible && this.exists('#adColor .variationDD option[value="' + lineItem.color + '"]')) {

                casper.test.comment('Color available');

                this.evaluate(function (_option) {
                  var $select = $('#adColor .variationDD');
                  $select.val(_option);
                  $select.change();
                }, { _option : lineItem.color });
              } else if(colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0) {
                casper.test.comment('Color text matched for: ' + lineItem.color);
              } else {
                casper.test.comment('ERROR: OrderId: ' + order.id + ' color unavailable: ' + lineItem.color + ' for size: ' + lineItem.size + '. Exiting...');
                this.exit(1);
              }

              // INSTOCK AND QTY REPEAT BEGIN
              casper.then(function () {
                casper.waitForResource('prod_stock1.gif',
                function () {
                  casper.test.comment('product is in stock!');

                  if(lineItem.qty) {
                    casper.test.comment('Setting qty to: ' + lineItem.qty);
                    this.fill('form#lineItemsForm', {
                      'qty0': lineItem.qty
                    }, false);
                  } else {
                    casper.test.comment('qty is required');
                    this.exit(1);
                  }

                  casper.test.comment('add button found');
                  casper.click('#topAddToCartButton');

                },
                function () {
                  casper.test.comment('Product is not in stock');
                  picit('unavailable-'+order.id+'-'+lineItem.line_item_id);
                });
              });
              // INSTOCK AND QTY REPEAT END

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color or size unavailable: ' + lineItem.color + ' / ' + lineItem.size + '. Exiting...');
              this.exit(1);
            }
          });

        } else if(!isColorDropdownVisible && isSizeDropdownVisible && (sizeDropdownOptionText === 'First, Select Size') && (colorText.toLowerCase().indexOf(lineItem.color.toLowerCase()) >= 0)) {
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
                    casper.test.comment('Setting qty to: ' + lineItem.qty);
                    this.fill('form#lineItemsForm', {
                      'qty0': lineItem.qty
                    }, false);
                  } else {
                    casper.test.comment('qty is required');
                    this.exit(1);
                  }

                  casper.test.comment('add button found');
                  casper.click('#topAddToCartButton');

                },
                function () {
                  casper.test.comment('Product is not in stock');
                  picit('unavailable-'+order.id+'-'+lineItem.line_item_id);
                });
              });
              // INSTOCK AND QTY REPEAT END

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color unavailable: ' + lineItem.color + '. Exiting...');
              this.exit(1);
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
                casper.test.comment('Setting qty to: ' + lineItem.qty);
                this.fill('form#lineItemsForm', {
                  'qty0': lineItem.qty
                }, false);
              } else {
                casper.test.comment('qty is required');
                this.exit(1);
              }

              casper.test.comment('add button found');
              casper.click('#topAddToCartButton');

            },
            function () {
              casper.test.comment('Product is not in stock');
              picit('unavailable-'+order.id+'-'+lineItem.line_item_id);
            });
          });
          // INSTOCK AND QTY REPEAT END

        } else {
          // exit with error
          // casper.test.comment('ERROR : COLOR & SIZE');
          casper.test.comment('ERROR: BAD! No conditions matched for: ' + lineItem.color + ' & ' + lineItem.size);
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
                    casper.test.comment('Setting qty to: ' + lineItem.qty);
                    this.fill('form#lineItemsForm', {
                      'qty0': lineItem.qty
                    }, false);
                  } else {
                    casper.test.comment('qty is required');
                    this.exit(1);
                  }

                  casper.test.comment('add button found');
                  casper.click('#topAddToCartButton');

                },
                function () {
                  casper.test.comment('Product is not in stock');
                  picit('unavailable-'+order.id+'-'+lineItem.line_item_id);
                  this.exit(1);
                });
              });
              // INSTOCK AND QTY REPEAT END

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' color unavailable: ' + lineItem.color + '. Exiting...');
              this.exit(1);
            }
          });

        } else {
          // exit with error
          // casper.test.comment('ERROR : COLOR ONLY');
          casper.test.coment('ERROR: BAD! Color dropdown not found');
          this.exit(1);

        }

      } else {
        // exit with error
        // casper.test.comment('ERROR : NO SIZE OR COLOR');
        casper.test.comment('ERROR: SUPER BAD! No size or color on lineItem. How did *that* happen for orderId: ' + order.id);
        this.exit(1);
      }

    }, function() {

      casper.test.comment('timed out waiting for add button');
      this.exit(1);

    });

  });
});

// ADD ITEMS END

// HEAD TO CHECKOUT BEGIN

// verify link is available
casper.then(function () {
  casper.waitFor(function () {
    return this.evaluate(function () {
      return document.querySelectorAll('a[href="https://www.neimanmarcus.com/checkout.jsp?perCatId=&catqo=&co=true"]').length;
    });
  },
  function () {
    casper.test.comment('Link to checkout visible');
  },
  function () {
    casper.test.comment('Timed out waiting for checkout link');
    this.exit(1);
  });
});

// click checkout link
casper.then(function () {
  casper.click('a[href="https://www.neimanmarcus.com/checkout.jsp?perCatId=&catqo=&co=true"]');
});

// make sure the anonCheckout button is there and click it
casper.then(function () {
  if(this.exists('#anonSignInBtn')) {
    casper.click('#anonSignInBtn');
  } else {
    casper.test.comment('ERROR: Anon sign-in button no available. Exiting...');
    this.exit(1);
  }
});

// HEAD TO CHECKOUT END

// SAMPLES POP-UP BEGIN

// sometimes a 'sample' pop-up appears at this stage
// check for it, and if it has appeared, dismiss it!

//check for samples pop-up
casper.then(function () {

  casper.wait(2000, function () {
    if(this.exists('#samplesNoButton')) {
      casper.click('#samplesNoButton');
      casper.test.comment('Samples pop-up appeared');
    } else {
      casper.test.comment('No samples pop-up');
    }
  });
});

// SAMPLES POP-UP END

// SHIPPING FORM BEGIN

// check for shipping form
casper.then(function () {
  casper.waitFor(function () {
    return this.evaluate(function () {
      return document.querySelectorAll('#shippingForm_se').length;
    });
  },
  function () {
    casper.test.comment('Begin filling out shipping form');
  },
  function () {
    casper.test.comment('timed out waiting for shipping form');
    this.exit(1);
  });
});

// start filling out the shipping form
casper.then(function () {

  //casper.test.assertExists('select#saTitleCode_se', 'Title select exists');
  //casper.test.assertExists('input#saFirstName_se', 'First Name input field exists');
  //casper.test.assertExists('input#saLastName_se', 'Last Name input field exists');
  //casper.test.assertExists('select#country_se', 'Country select exists');
  //casper.test.assertExists('input#saAddressLine1_se', 'Address Line 1 input field exists');
  //casper.test.assertExists('input#saAddressLine2_se', 'Address Line 2 input field exists');
  //casper.test.assertExists('input#saCity_se', 'City input field exists');
  // casper.test.assertExists('select#state_se', 'State select exists');
  //casper.test.assertExists('input#saZip_se', 'Zip input field exists');
  //casper.test.assertExists('select#saPhoneType_se', 'Phone Type select exists');
  //casper.test.assertExists('input#saDayTelephone_se', 'Phone input exists');
  //casper.test.assertExists('input#addr_po_true_se', 'Use as POBox radio exists');
  //casper.test.assertExists('input#addr_po_false_se', 'Do not use as POBox radio exists');
  //casper.test.assertExists('input#useAsBillingFlag_se', 'Use As Billing checkbox exists');

  var sa = order.shipping_address;

  this.evaluate(function () {
    var $select = $('select#country_se');
    var _option = 'US';
    $select.val(_option);
    $select.change();
  });

  this.evaluate(function (state) {
    var $select = $('select#state_se');
    var _option = state;
    $select.val(_option);
    $select.change();
  }, sa.short_state);

  this.evaluate(function () {

    var $select = $('select#saPhoneType_se');
    var _option = sa.phone;
    // select other
    $select.val(_option);
    $select.change();
  });

  this.evaluate(function () {
    var $select = $('select.shippingmethod');
    var _option = 'SL3';
    // ship via standard
    $select.val(_option);
    $select.change();
  });

  var formValues = {
    'input#saFirstName_se' : sa.first_name,
    'input#saLastName_se' : sa.last_name,
    'input#saAddressLine1_se' : sa.street1,
    'input#saAddressLine2_se' : sa.street2,
    'input#saCity_se' : sa.city,
    'input#saZip_se' : sa.postal_code,
    'input#saDayTelephone_se' : sa.phone
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

    if(this.exists('#saDeliveryTelephone_se')) {

      var optionalFormValues = {
        'input#saDeliveryTelephone_se' : sa.phone
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
  this.fill('form#shippingForm_se', {
    'poBox' : 'false'
  }, false);

  // Check/uncheck useAsBillingFlag_se
  this.evaluate(function () {
    document.querySelector('#useAsBillingFlag_se').checked = false;
  });

  casper.then( function () {
    picit(order.id + '-shipping-form-before-submit');
  });

  // click NEXT step
  casper.then(function () {
    if(casper.exists('span#shippingContinue_se')) {
      casper.wait(2000, function () {
        casper.click('span#shippingContinue_se');
      });
    } else {
      casper.test.comment('ERROR: Next button not found on shipping form');
      this.exit(1);
    }
  });

  testForm(order.id + '-shipping-');

});

// SHIPPING FORM END

// BILLING FORM BEGIN

// check for billing form
casper.then(function () {
  casper.waitFor(function () {
    return this.evaluate(function () {
      return document.querySelectorAll('form#billingForm').length;
    });
  },
  function () {
    casper.test.comment('Billing form present, begin filling it out!');
  },
  function () {
    casper.test.comment('Timed out, no billing form present, exiting...');
    picit(order.id + '-' + lineItem.line_item_id + 'no-billing-form');
    casper.exit(1);
  });
});

casper.then(function () {
  // test each of the fields
  //casper.test.assertExists('input#emailAddress', 'Email Address input exists');
  //casper.test.assertExists('select#billingAddrTitle', 'Title select exists');
  //casper.test.assertExists('input#billingAddrFirstName', 'First name input exists');
  //casper.test.assertExists('input#billingAddrLastName', 'Last name input exists');
  //casper.test.assertExists('select#billingAddrCountry', 'Country select exists');
  //casper.test.assertExists('input#billingAddrLine1', 'Address line 1 exists');
  //casper.test.assertExists('input#billingAddrLine2', 'Address line 2 exists');
  //casper.test.assertExists('input#billingAddrCity', 'City input exists');
  //casper.test.assertExists('select#billingAddrState', 'State select exists');
  //casper.test.assertExists('input#billingAddrZipCode', 'Zip Code input exists');
  //casper.test.assertExists('select#billingAddrPhoneType', 'Phone type select exists');
  //casper.test.assertExists('input#billingAddrDayPhone', 'Day phone input exists');
  //casper.test.assertExists('select#cardtype', 'Card type select exists');
  //casper.test.assertExists('input#cardnumber', 'Card number input exists');
  //casper.test.assertExists('input#securitycode', 'Security code input exists');
  //casper.test.assertExists('input#cardExpMonth', 'Card expiration month input exists');
  //casper.test.assertExists('input#cardExpYear', 'Card expiration year input exists');

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

  this.evaluate(function () {
    var $select = $('select#billingAddrPhoneType');
    var _option = ba.phone;
    // select other
    $select.val(_option);
    $select.change();
  });

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

casper.then( function () {
  picit(order.id + '-billing-form-before-submit');
});

// click next to review
casper.then(function () {
  if(casper.exists('span#paymentSave')) {
    casper.wait(2000, function () {
      casper.click('span#paymentSave');
    });
  } else {
    casper.test.comment('ERROR: Save payment button not available');
    this.exit(1);
  }
});

// test to see if any errors popped
testForm(order.id + '-shipping-');

// BILLING FORM END

// DISMISS ANY ORDER CONFIRMATION POP-UP BEGIN

// confirm address
casper.then(function () {
  casper.waitFor(function (){
    return this.evaluate(function () {
      return document.querySelector('#avAddressList form').length;
    });
  },
  function (){
    casper.test.comment('Need to verify address');
    casper.click('span#verificationButton');
  },
  function (){
    casper.test.comment('No need to verify address');
  });
});

// DISMISS ANY ORDER CONFIRMATION POP-UP END

casper.then(function () {
  casper.wait(2000, function () {
    picit(order.id+'-FINAL');  // take a snapshot right before exit
    casper.exit(0);
  });
});

// RUN IIIIIIIIIIIT!
casper.run();