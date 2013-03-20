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
  // clientScripts: ["jquery-1.8.3.min.js"],
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

var order = JSON.parse(casper.cli.args);
casper.test.comment('Order received! Id: ' + order.id + ' item count: ' + order.line_items.length);

var lineItems = order.line_items;

casper.start();

casper.each(lineItems, function(self, lineItem) {
  this.thenOpen(lineItem.affiliate_url, function() {

    casper.test.comment(this.getTitle());
    casper.waitForSelector('#topAddToCartButton', function() {

      // if(lineItem.size) {


      //   // Select size option
      //   casper.then(function () {
      //     if(casper.exists('.lineItemOptionSelect select:nth-of-type(1) option[value="' + lineItem.size + '"]')) {
      //       this.evaluate(function (_option) {
      //         var $select = $('.lineItemOptionSelect select:nth-of-type(1)');
      //         $select.val(_option);
      //         $select.change();
      //       }, { _option : lineItem.size });
      //     } else {
      //       casper.test.comment('size not found / not available');
      //       casper.exit(1);
      //     }
      //   });
      // }

      casper.page.injectJs('jquery-1.8.3.min.js');

      var isColorDropdownVisible = this.evaluate(function() { return $('#adColor .variationDD').is(":visible"); });
      var isSizeDropdownVisible = this.evaluate(function() { return $('#adSize .variationDD').is(":visible"); });

      var colorDropdownOptionText = this.evaluate(function() { return $('#adColor .variationDD option:first').text(); });
      var sizeDropdownOptionText = this.evaluate(function() { return $('#adSize .variationDD option:first').text(); });

      var colorText = this.evaluate(function() {return $('.nsStyle').text(); }); //this.fetchText('.nsStyle').trim().toLowerCase();
      var sizeText = this.evaluate(function() {return $('#dd1NonSelect').text(); }); //this.fetchText('#dd1NonSelect').trim().toLowerCase();

      casper.test.comment('isColorDropdownVisible: ' + isColorDropdownVisible);
      casper.test.comment('isSizeDropdownVisible: ' + isSizeDropdownVisible);

      casper.test.comment('colorDropdownOptionText: ' + colorDropdownOptionText);
      casper.test.comment('sizeDropdownOptionText: ' + sizeDropdownOptionText);

      casper.test.comment('colorText: ' + colorText);
      casper.test.comment('sizeText: ' + sizeText);


    // if (lineItem.color && lineItem.size) {
    //   // eg: clothes and shoes
    //   casper.test.comment('item size: ' + lineItem.size);
    //   casper.test.comment('item color: ' + lineItem.color);


    //   if(this.visible('#adColor .variationDD') && this.visible('#adSize .variationDD') && ($("#adColor .variationDD option:first").val() === 'First, Select Size') && ($("#adColor .variationDD option:first").val() === 'Then, Select Color')) {
    //     // TWO visible dropdowns
    //     // set both dropdowns
    //     casper.test.comment('STEP1 : COLOR & SIZE');

    //   } else if(this.visible('#adColor .variationDD') && !this.visible('#adSize .variationDD') && ($("#adColor .variationDD option:first").val() === 'First, Select Size') && ($('#adColor .nsStyle').text().toLowerCase().indexOf(lineItem.color.toLowerCase())) >= 0 )) {
    //     // set visible color dropdown
    //     casper.test.comment('STEP2 : COLOR & SIZE');

    //   } else if(!this.visible('#adColor .variationDD') && !this.visible('#adSize .variationDD') && ($('#adColor .nsStyle').text().toLowerCase().indexOf(lineItem.color) >= 0 ) && ($('#adSize #dd1NonSelect').text().toLowerCase().indexOf(lineItem.size.toLowerCase()) >= 0)) {
    //     // nothing to set
    //     casper.test.comment('STEP3 : COLOR & SIZE');

    //   } else {
    //     // exit with error
    //     casper.test.comment('ERROR : COLOR & SIZE');

    //   }

    // } else if (lineItem.color && !lineItem.size) {

    //   casper.test.comment('item color: ' + lineItem.color);

    //   // eg: beauty
    //   // the color select shows up in the #adSize div when there is no size to be selected
    //  if($(".variationDD option:first").val() === 'Please Select Color') {
    //     // set color
    //     casper.test.comment('STEP1 : COLOR ONLY');

    //   } else {
    //     // exit with error
    //     casper.test.comment('ERROR : COLOR ONLY');

    //   }

    // } else {
    //   // exit with error
    //   casper.test.comment('ERROR : NO SIZE OR COLOR');

    // }

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

      // if(lineItem.qty) {
      //   casper.test.comment('attempting size fill...');
      //   this.fill('form#lineItemsForm', {
      //     'qty0': lineItem.qty
      //   }, false);
      // } else {
      //   casper.test.comment('qty is required');
      //   casper.exit(1);
      // }

      casper.test.comment('add button found');
      // casper.click('#topAddToCartButton');

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