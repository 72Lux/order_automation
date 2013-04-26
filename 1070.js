// to run from cli:
// rm 1070.txt; casperjs --cookies-file=1070.txt 1070.js

require("utils");

// HELPER FUNCTIONS

// screen capture
picit = (function (filename) {
  if(!imageHome) { imageHome = '/tmp/order_automation'; }
  filename = imageHome + '/' + filename + '.png' || 'default_screen_caps/results.png';
  logMessage('Saving screen capture [' + filename + ']');
  casper.capture(filename, {
    top: 0,
    left: 0,
    width: 480,
    height: 2000
  });
});

// remove spaces and replace accented characters with corresponding regular ones
// used when search for string using indexOf
// the same functions exists in client-utils.js for injection onto client page
// to make it available for this.evaluate

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

logMessage = (function (msg) {
  casper.echo('## ' + msg);
});

logError = (function (msg) {
  casper.echo('## ERROR ## ' + msg);
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

      casper.then(function() {
        formErrorMsg = casper.evaluate(function () { return $('table.coErrorMessageClass td.text').text(); });
      });

    },
    function () {
      logMessage('No errors found on [' + formType + '] form');
    });
  });
});

// checkFormErrors(order.id, 'shopping-bag')
checkFormErrors = (function (orderId, formType) {

  if(formErrorMsg) {
    casper.thenOpen(commentUrl, {
      method: 'post',
      data:   {
        'comment': 'Error present in [' + formType + '] form [' + formErrorMsg + ']'
      },
      headers: {
        'Authorization' : auth
      }
    }, function() {

      logMessage('Comment posted [' + formErrorMsg + ']');

      if(formType && (formType === 'shipping')) {
        exitProcess(34);
      } else if(formType && (formType === 'shipping')) {
        exitProcess(35);
      } else {
        exitProcess(32);
      }

    },
    function () {
      logMessage('No errors found on [' + formType + '] form');
    });
  }
});

// log exit code
// take screen capture
// exit process
exitProcess = (function (code) {
  if(!code && (code !== 0)) {
    logError('Exit code not provided. Setting it to 1.');
    code = 1;
  }
  logMessage('Exiting with code [' + code + ']');
  picit(order.id + '-' + code);
  casper.exit(code);
});

var casper = require("casper").create({
  clientScripts: ["jquery-1.8.3.min.js","lux-client-utils.js"],
  onAlert: function () {
    logMessage('an alert was triggered');  // this is used to test whether a size/color combo was actually chosen
    picit('alert');
  },
  verbose: false,
  logLevel: "info"
});

// TEST DATA BEGIN

var testLineItems = [];


var item0 = {
   title: "Contour Jean Belt, Black",
   affiliate_url: 'http://click.linksynergy.com/link?id=v9jIDxMZD/A&u1=&type=15&offerid=279712&murl=http%3A%2F%2Fwww.neimanmarcus.com%2Fp%2FNeiman-Marcus-Contour-Jean-Belt-Black%2Fprod150910006_cat4300731__%2F%3Ficid%3D%26searchType%3DEndecaDrivenCat%26rte%3D%25252Fcategory.service%25253FitemId%25253Dcat4300731%252526pageSize%25253D30%252526No%25253D120%252526refinements%25253D%26eItemId%3Dprod150910006%26cmCat%3Dproduct',
   size: 'SMALL',
   color: 'BLACK',
   qty: 1
 };

testLineItems.push(item0);

var item1 = {
  title: "Wing-Tip Chelsea Boot",
  affiliate_url: 'http://click.linksynergy.com/link?id=v9jIDxMZD/A&u1=&type=15&offerid=279712&murl=http%3A%2F%2Fwww.neimanmarcus.com%2Fp%2FPrada-Wing-Tip-Chelsea-Boot%2Fprod146820012_cat000550__%2F%3Ficid%3D%26searchType%3DEndecaDrivenCat%26rte%3D%25252Fcategory.service%25253FitemId%25253Dcat000550%252526pageSize%25253D30%252526No%25253D600%252526refinements%25253D%26eItemId%3Dprod146820012%26cmCat%3Dproduct',
  size: '7/8D',
  color: '',
  qty: 1
};

testLineItems.push(item1);

var item2 = {
  title: "Gisele Short Pajamas, Eggplant/Pink",
  affiliate_url: 'http://click.linksynergy.com/link?id=v9jIDxMZD/A&u1=&type=15&offerid=279712&murl=http%3A%2F%2Fwww.neimanmarcus.com%2Fp%2FEberjey-Gisele-Short-Pajamas-Eggplant-Pink%2Fprod152510464_cat10360732__%2F%3Ficid%3D%26searchType%3DEndecaDrivenCat%26rte%3D%25252Fcategory.service%25253FitemId%25253Dcat10360732%252526pageSize%25253D30%252526No%25253D60%252526refinements%25253D%26eItemId%3Dprod152510464%26cmCat%3Dproduct',
  size: 'LARGE/10-12',
  color: 'EGGPLANT/PINK',
  qty: 1
};

testLineItems.push(item2);

var item3 = {
  title: "Pyramid Studded Hobo Bag, Pale Khaki",
  affiliate_url: 'http://click.linksynergy.com/link?id=v9jIDxMZD/A&u1=&type=15&offerid=279712&murl=http%3A%2F%2Fwww.neimanmarcus.com%2Fp%2FTory-Burch-Pyramid-Studded-Hobo-Bag-Pale-Khaki%2Fprod155700016_cat40860748__%2F%3Ficid%3D%26searchType%3DEndecaDrivenCat%26rte%3D%25252Fcategory.service%25253FitemId%25253Dcat40860748%252526pageSize%25253D30%252526No%25253D210%252526refinements%25253D%26eItemId%3Dprod155700016%26cmCat%3Dproduct',
  size: '',
  color: '',
  qty: 1
};

testLineItems.push(item3);

var item4 = {
  title: "The Lipstick",
  affiliate_url: 'http://click.linksynergy.com/link?id=v9jIDxMZD/A&u1=&type=15&offerid=279712&murl=http%3A%2F%2Fwww.neimanmarcus.com%2Fp%2FKanebo-Sensai-Collection-The-Lipstick%2Fprod92160003_cat10470768__%2F%3Ficid%3D%26searchType%3DEndecaDrivenCat%26rte%3D%25252Fcategory.service%25253FitemId%25253Dcat10470768%252526pageSize%25253D30%252526No%25253D150%252526refinements%25253D%26eItemId%3Dprod92160003%26cmCat%3Dproduct',
  size: '',
  color: 'AYA 17',
  qty: 2
};

testLineItems.push(item4);

var testOrder = {
  id: '1030-test-' + new Date().getTime(),
  submitOrder: false,
  shipping_address: {
    first_name: 'First',
    last_name: 'Last',
    street1: '1 Market St',
    street2: '',
    city: 'San Francisco',
    state: 'California',
    short_state: 'CA',
    postal_code: '94108',
    phone: '1231231234'
  },
  billing_address: {
    email: 'test@test.com',
    first_name: 'First',
    last_name: 'Last',
    street1: '1 Market St',
    street2: '',
    city: 'San Francisco',
    state: 'California',
    short_state: 'CA',
    postal_code: '94108',
    phone: '1231231234'
  },
  payment: {
    card_type: 'Visa',
    card_number: '4111111111111111',
    cvv: '123',
    expiry_month: '12',
    expiry_year: '2020'
  },
  line_items: testLineItems
};

// TEST DATA END

var order = casper.cli.get('order');
var auth = casper.cli.get('auth');
var commentUrl = casper.cli.get('comment-url');
var imageHome = casper.cli.get('image-home');

// if order is made available on the command line, make sure the other required options are present as well.
// if there is no --order option available, use the testOrder [the testOrder will not be submitted; order.submitOrder = false]

if(order) {
  if(!auth || !commentUrl || !imageHome) {
    logError('--auth, --comment-url, --image-home are required for a real order to be processed.');
    exit(1);
  }
  order = JSON.parse(order);
  logMessage('Using --order');
} else {
  order = testOrder;
  logMessage('Using testOrder');
}

var sa = order.shipping_address;
var ba = order.billing_address;
var pi = order.payment;
var lineItems = order.line_items;
var confirmationMsg = '';
var inStockVisible = false;
var formErrorMsg = '';

casper.start();

// ADD ITEMS BEGIN
casper.then(function() {
  logMessage('Order Id [' + order.id + '] item count [' + order.line_items.length + '] submitOrder [' + order.submitOrder + ']');
});

casper.each(lineItems, function(self, lineItem) {

  casper.then(function() {
    logMessage('Opening [' + lineItem.affiliate_url + ']');
  });

  this.thenOpen(lineItem.affiliate_url, function() {

    logMessage(this.getTitle());

    casper.waitForSelector('#topAddToCartButton', function() {

      logMessage('Add to Cart available [true]');

      // PROCESS SIZE

      casper.then(function() {

        if(lineItem.size) {

          var isSizeDropdownVisible = this.evaluate(function() { return $('[id ^=prod][id $=DD1]').is(":visible"); });
          var sizeText = this.evaluate(function() { return $('.lineItemOptionSelect #dd1NonSelect').text(); });

          if(isSizeDropdownVisible) {

            if(this.exists('[id ^=prod][id $=DD1]' + ' option[value="' + lineItem.size + '"]')) {

              logMessage('Size [' + lineItem.size + '] available in select');

              this.evaluate(function (_option) {
                var $select = $('[id ^=prod][id $=DD1]');
                $select.val(_option);
                $select.change();
              }, { _option : lineItem.size });

            } else {
              logError('OrderId [' + order.id + '] UNAVAILABLE size [' + lineItem.size + ']');
              exitProcess(32);
            }
          } else if(!isSizeDropdownVisible && normalizeString(sizeText).indexOf(normalizeString(lineItem.size)) >= 0) {

            logMessage('Size [' + lineItem.size + '] available in text');

          } else {
            logError('OrderId [' + order.id + '] UNAVAILABLE size [' + lineItem.size + ']');
            exitProcess(32);
          }

        } else {
          logMessage('No size for product');
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

            logMessage('Color [' + lineItem.color + '] available in select');

            this.evaluate(function (_option, _dd) {
              var $select = $(_dd);
              $select.val(_option);
              $select.change();
            }, { _option : lineItem.color, _dd : dropdownSelector });

          } else if(!isColorDropdownVisible && normalizeString(colorText).indexOf(normalizeString(lineItem.color)) >= 0) {

            logMessage('Color [' + lineItem.color + '] available in text');

          } else {
            logError('OrderId [' + order.id + '] UNAVAILABLE color [' + lineItem.color + ']');
            exitProcess(32);
          }

        } else {
          logMessage('No color for product');
        }

      });

      // CHECK FOR INSTOCK

      casper.then(function () {

        casper.wait(2000, function () {

          casper.then(function() {
            inStockVisible = this.evaluate(function checkForInstock() {
              return normalizeString($('.prodStatus img').attr('src')).indexOf('stock') >= 0 ;
            });
          });

          casper.then(function() {

            if(inStockVisible) {

              casper.then(function() {
                logMessage('Product in stock [true]');
              });

              casper.then(function() {
                if(lineItem.qty) {
                  casper.then(function() {
                    logMessage('Quantity [' + lineItem.qty + ']');
                  });
                  casper.then(function() {
                    this.fill('#lineItemsForm', {
                      'qty0': lineItem.qty
                    }, false);
                  });
                } else {
                  casper.then(function() {
                    logError('Required quantity is missing');
                  });
                  casper.then(function() {
                    exitProcess(42);
                  });
                }
              });

              casper.then(function() {
                logMessage('Clicking on [Add to Cart]');
              });

              casper.then(function() {
                casper.click('#topAddToCartButton');
              });

            } else {

              logError('Product in stock [false]');
              exitProcess(31);

            }
          });
        });

      });

    }, function() {

      casper.then(function() {
        logError('Add to Cart available [false]');
      });
      casper.then(function() {
        exitProcess(12);
      });

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

casper.then(function() {
  this.evaluate(function() { jQuery(nm.checkout.init); });
});

// make sure the anonCheckout button is there and click it
casper.then(function () {
  casper.waitForSelector('#anonSignInBtn', function () {

    casper.then(function() {
        logMessage('Anon sign-in button available [true]');
    });

    casper.then(function() {

      // CALL TO NEIMAN JS
      this.evaluate(function() {
        objErrorMessage.removeAllErrors(); var request = new LoginReq();
        request[LoginReq_email] = '';
        request[LoginReq_password] = '';
        request[LoginReq_type] = 'anonymous';
        checkoutGateway.ajaxService(request, this.loginSuccess, loginError);
      });

    });

  }, function() {

    casper.then(function() {
      logError('Anon sign-in button available [false]');
    });
    casper.then(function() {
      exitProcess(14);
    });

  });
});

// HEAD TO CHECKOUT END

// SAMPLES POP-UP BEGIN

// sometimes a 'sample' pop-up appears at this stage
// check for it, and if it has appeared, dismiss it!

//check for samples pop-up
casper.then(function () {
  casper.wait(2000, function () {
    casper.then(function() {

      if(this.exists('#samplesNoButton')) {
        casper.then(function() {
          logMessage('Samples pop-up [true]');
        });
        casper.then(function() {
          this.evaluate(function() { gwpSelector.noItems(); });
        });
      } else {
        casper.then(function() {
          logMessage('Samples pop-up [false]');
        });
      }

    });

  });
});

// SAMPLES POP-UP END


casper.then(function() {
  testForm(order.id, 'shopping-bag');
});

casper.then(function() {
  checkFormErrors(order.id, 'shopping-bag');
});


// SHIPPING FORM BEGIN

casper.then(function () {

  casper.waitForSelector('#shippingForm_se', function() {
    casper.then(function() {
      logMessage('Shipping form available [true]');
    });
  },
  function () {
    casper.then(function() {
      logError('Shipping form available [false]');
    });
    casper.then(function() {
      exitProcess(15);
    });
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

      logMessage('Optional delivery telephone needed [true]');

    } else {
      logMessage('Optional delivery telephone needed [false]');
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

  // click NEXT step
  casper.then(function () {

      casper.waitForSelector('#shippingContinue_se', function () {
        // CALL TO NEIMAN JS
        casper.then(function() {
          logMessage('Next button found on shipping form [false]');
        });

        this.evaluate(function() {
          var $s = $('#shippingContinue_se');
          objShippingEdit.shippingEditContinue($s.attr("pageType"), $s.attr("sgId"));
        });
      }, function() {
        logError('Next button found on shipping form [false]');
        exitProcess(16);
      }, 30000);

  });

  casper.then(function() {
    testForm(order.id, 'shipping');
  });

  casper.then(function() {
    checkFormErrors(order.id, 'shipping');
  });

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
    logMessage('Billing form available [true]');
  },
  function () {
    logError('Billing form available [false]');
    exitProcess(17);
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

// click next to review
casper.then(function () {
  casper.waitForSelector('#paymentSave', function() {

    casper.then(function() {
      logMessage('Save payment button available [false]');
    });

    // CALL TO NEIMAN JS
    this.evaluate(function() {
      var $p = $('#paymentSave');
      paymentEdit.verifyData($p.attr("pgId"));
    });
  }, function() {
    logError('Save payment button available [false]');
    exitProcess(18);
  }, 30000);
});

// test to see if any errors popped

casper.then(function() {
  testForm(order.id, 'billing');
});

casper.then(function() {
  checkFormErrors(order.id, 'billing');
});

// BILLING FORM END

// exit if address needs to be confirmed
casper.then(function() {
  casper.waitForSelector('#verificationButton', function() {
    casper.then(function() {
      logMessage('Address confirmation needed [true]');
    });

    picit(order.id + '-address-confirmation');
    this.evaluate(function() { $('#verificationButton').click(); });

  }, function() {
    logMessage('Address confirmation needed [false]');
  }, 30000);
});

//CLICK ON SUBMIT
casper.then(function () {
  casper.waitForSelector('#submitOrder', function () {

    casper.then(function() {
      logMessage('Submit Order [' + order.submitOrder + ']');
    });

    casper.then(function() {

      if(order.submitOrder) {
        // TODO: OMG! ARE YOU READY FOR THIS?
        casper.then(function() {
          this.evaluate(function() { performCcAuth(); });
        });
        casper.then(function() {
          logMessage('Submit Button [CLICKED!]');
        });

        casper.then(function() {
          casper.waitForSelector('#confirmSummary', function () {

            casper.then(function() {
              confirmationMsg = this.evaluate(function parseConfirmationMsg() { return $('#confirmSummary').html();});
            });

            casper.then(function() {
              logMessage('Sending confirmation comment to order with id [' + order.id + ']');
            });

            casper.thenOpen(commentUrl, {
              method: 'post',
              data:   {
                'comment': confirmationMsg
              },
              headers: {
                'Authorization' : auth
              }
            });

            casper.then(function() {
              logMessage('Order Id [' + order.id + ' Neiman Marcus order number [' + confirmationMsg + ']');
            });


          }, function() {
            casper.then(function() {
              logError('Confirmation message found [false]');
              exitProcess(20);
            });
          }, 30000);
        });


      } else {
        casper.then(function() {
          logMessage('Submit Button is [VISIBLE]');
        });

        casper.then(function() {
          logMessage('Sending confirmation comment to order with id [' + order.id + ']');
        });

        casper.then(function() {
          if(auth && commentUrl) {
            casper.thenOpen(commentUrl, {
                method: 'post',
                data:   {
                  'comment': 'submitOrder set to false, so no Neiman Marcus order number for you!'
                },
                headers: {
                  'Authorization' : auth
                }
            });
          } else {
            casper.then(function() {
              logMessage('Could not post confirmation comment. Auth or comment-url unavailable.');
            });
          }
        });
        casper.then(function() {
          exitProcess(0);
        });
      }

    });

  }, function() {
    logError('Submit button available [false]');
    exitProcess(18);
  }, 30000);
});

// RUN IIIIIIIIIIIT!
casper.run();



