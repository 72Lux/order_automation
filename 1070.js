require("utils");

// capture a snapshot
picit = (function (filename) {
  filename = imageHome + filename + '.png' || 'default_screen_caps/results.png';
  casper.test.comment('Saving screen capture [' + filename + ']');
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

normalizeString = (function (s) {
  var r = s.toLowerCase();

  r = r.replace(new RegExp("\\s", 'g'), "");
  r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
  r = r.replace(new RegExp("æ", 'g'), "ae");
  r = r.replace(new RegExp("ç", 'g'), "c");
  r = r.replace(new RegExp("[èéêë]", 'g'), "e");
  r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
  r = r.replace(new RegExp("ñ", 'g'), "n");
  r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
  r = r.replace(new RegExp("œ", 'g'), "oe");
  r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
  r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
  r = r.replace(new RegExp("\\W", 'g'), "");

  return r;
});

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js","lux-client-utils.js"],
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

casper.each(lineItems, function(self, lineItem) {
  this.thenOpen(lineItem.affiliate_url, function() {

    casper.test.comment(this.getTitle());
    // picit(order.id + '-before-anything');

    casper.waitForSelector('#topAddToCartButton', function() {

      // PROCESS SIZE

      casper.then(function() {

        if(lineItem.size) {

          var isSizeDropdownVisible = this.evaluate(function() { return $('[id ^=prod][id $=DD1]').is(":visible"); });
          var sizeText = this.evaluate(function() { return $('.lineItemOptionSelect #dd1NonSelect').text(); });

          if(isSizeDropdownVisible) {

            if(this.exists('[id ^=prod][id $=DD1]' + ' option[value="' + lineItem.size + '"]')) {

              casper.test.comment('Size [' + lineItem.size + '] available in select');

              this.evaluate(function (_option) {
                var $select = $('[id ^=prod][id $=DD1]');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.size });

            } else {
              casper.test.comment('ERROR: OrderId: ' + order.id + ' size [' + lineItem.size + '] unavailable. Exiting...');
              picit(order.id + '-32');
              this.exit(32);
            }
          } else if(!isSizeDropdownVisible && normalizeString(sizeText).indexOf(normalizeString(lineItem.size)) >= 0) {

            casper.test.comment('Size [' + lineItem.size + '] available in text');

          } else {
            casper.test.comment('ERROR: OrderId: ' + order.id + ' size [' + lineItem.size + '] unavailable. Exiting...');
            picit(order.id + '-32');
            this.exit(32);
          }

        } else {
          casper.test.comment('No size for product');
        }

      });

      // PROCESS COLOR

      casper.then(function() {

        if(lineItem.color) {

          var isColorDropdownVisible, colorText, colorExists, dropdownSelector;

          // if there is a size for a product, then the selector id for the color dropdown ends in DD2. else DD1.
          if(lineItem.size) {
            isColorDropdownVisible = this.evaluate(function() { return $('[id ^=prod][id $=DD2]').is(":visible"); });
            colorExists = this.exists('[id ^=prod][id $=DD2]' + ' option[value="' + lineItem.color + '"]');
            dropdownSelector = '[id ^=prod][id $=DD2]';

          } else {
            isColorDropdownVisible = this.evaluate(function() { return $('[id ^=prod][id $=DD1]').is(":visible"); });
            colorExists = this.exists('[id ^=prod][id $=DD1]' + ' option[value="' + lineItem.color + '"]');
            dropdownSelector = '[id ^=prod][id $=DD1]';
          }

          colorText = this.evaluate(function() { return $('.lineItemOptionSelect .nsStyle').text(); });

          if(isColorDropdownVisible && colorExists) {

            casper.test.comment('Color [' + lineItem.color + '] available in select');

            this.evaluate(function (_option, _dd) {
              var $select = $(_dd);
              $select.val(_option);
              $select.change();
            }, { _option : lineItem.color, _dd : dropdownSelector });

          } else if(!isColorDropdownVisible && normalizeString(colorText).indexOf(normalizeString(lineItem.color)) >= 0) {

            casper.test.comment('Color [' + lineItem.color + '] available in text');

          } else {
            casper.test.comment('ERROR: OrderId: ' + order.id + ' color [' + lineItem.color + '] unavailable. Exiting...');
            picit(order.id + '-32');
            this.exit(32);
          }

        } else {
          casper.test.comment('No color for product');
        }

      });

      // CHECK FOR INSTOCK

      casper.then(function () {

        casper.wait(2000, function () {

          var inStockVisible = this.evaluate(function checkForInstock() {
              return normalizeString($('.prodStatus img').attr('src')).indexOf('stock') >= 0 ;
          });

          if(inStockVisible) {

            casper.test.comment('Product is in stock');

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
casper.thenOpen('https://www.neimanmarcus.com/checkout.jsp?perCatId=&catqo=&co=true', function() {
  this.wait(2000, function() {
    picit(order.id + '-shopping-bag');
  });
});

// casper.waitForResource("checkout.js", function() {
//     this.echo('checkout.js has been loaded.');
// }, function() {
//   casper.test.comment('Js required for anon-click did not load, exiting...');
//   picit(order.id + '-15');
//   casper.exit(15);
// }, 120000);

// casper.then(function() {
//   this.evaluate(function() { jQuery(nm.checkout.init); });
// });

// make sure the anonCheckout button is there and click it
casper.then(function () {
  casper.waitForSelector('#anonSignInBtn', function () {

    // CALL TO NEIMAN JS
    this.evaluate(function() {
      objErrorMessage.removeAllErrors(); var request = new LoginReq();
      request[LoginReq_email] = '';
      request[LoginReq_password] = '';
      request[LoginReq_type] = 'anonymous';
      checkoutGateway.ajaxService(request, this.loginSuccess, loginError);
    });

  }, function() {

    casper.test.comment('ERROR: Anon sign-in button no available. Exiting...');
    picit(order.id + '-14');
    this.exit(14);

  });
});

// HEAD TO CHECKOUT END

// SAMPLES POP-UP BEGIN

// sometimes a 'sample' pop-up appears at this stage
// check for it, and if it has appeared, dismiss it!

//check for samples pop-up
casper.then(function () {
  casper.wait(2000, function () {
    if(this.exists('#samplesNoButton')) {
      casper.test.comment('Samples pop-up appeared');
      this.evaluate(function() { gwpSelector.noItems(); });
    } else {
      casper.test.comment('No samples pop-up');
    }
  });
});


// SAMPLES POP-UP END

// SHIPPING FORM BEGIN

casper.then(function () {

  casper.test.comment('Starting to wait for shipping form...');

  casper.waitForSelector('#shippingForm_se', function() {
    casper.test.comment('Shipping form available!');
  },
  function () {
    casper.test.comment('Timed out, no shipping form present, exiting...');
    picit(order.id + '-15');
    casper.exit(15);
  }, 30000);

});

// start filling out the shipping form
casper.then(function () {

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

  // casper.then( function () {
  //   picit(order.id + '-shipping-form-before-submit');
  // });

  // click NEXT step
  casper.then(function () {
    if(casper.exists('span#shippingContinue_se')) {
      casper.wait(2000, function () {
        // CALL TO NEIMAN JS
        this.evaluate(function() {
          var $s = $('#shippingContinue_se');
          objShippingEdit.shippingEditContinue($s.attr("pageType"), $s.attr("sgId"));
        });
      });
    } else {
      casper.test.comment('ERROR: Next button not found on shipping form');
      picit(order.id + '-16');
      this.exit(16);
    }
  });

  casper.test.comment('shipping zip length: ' + sa.postal_code.length);

  testForm(order.id, 'shipping');

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
    picit(order.id + '-17');
    casper.exit(17);
  }, 45000);
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

// casper.then( function () {
//   picit(order.id + '-billing-form-before-submit');
// });

// click next to review
casper.then(function () {
  casper.waitForSelector('#paymentSave', function() {
    // CALL TO NEIMAN JS
    this.evaluate(function() {
      var $p = $('#paymentSave');
      paymentEdit.verifyData($p.attr("pgId"));
    });
  }, function() {
    casper.test.comment('ERROR: Save payment button not available');
    picit(order.id + '-18');
    this.exit(18);
  }, 30000);
});

// test to see if any errors popped
testForm(order.id, 'billing');

// BILLING FORM END

// exit if address needs to be confirmed
casper.then(function () {
  casper.waitFor(function (){
    return this.evaluate(function () {
      return document.querySelector('#avAddressList form').length;
    });
  },
  function (){
    casper.test.comment('Address needs to be confirmed...');
    picit(new Date().getTime() + '-34');
    casper.exit(34);
  },
  function (){
    casper.test.comment('No need to verify address');
  });
});

//CLICK ON SUBMIT
casper.then(function () {

  casper.waitForSelector('#submitOrder', function() {

    casper.test.comment('order.submitOrder set to: ' + order.submitOrder);

    if(order.submitOrder) {
      // TODO: OMG! ARE YOU READY FOR THIS?
      casper.click('#submitOrder');
      this.evaluate(function() { performCcAuth(); });
      casper.test.comment('Submit button CLICKED!');
    } else {
      casper.test.comment('Submit button visible!');
    }

  }, function() {
    casper.test.comment('ERROR: Submit order button not available');
    picit(order.id + '-18');
    this.exit(18);
  }, 30000);

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