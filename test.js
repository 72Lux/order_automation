// to run from cli:
// rm cnum-test.txt; casperjs --cookies-file=cnum-test.txt cnum-test.js

require("utils");

// HELPER FUNCTIONS

mappedCreditCardType = (function (ccType) {

  logMessage('Incoming ccType [' + ccType + ']');
  var mappedCreditCardTypes = {
    'Mastercard': 'MasterCard'
  };
  if (ccType in mappedCreditCardTypes) {
    logMessage('Returning ccType [' + mappedCreditCardTypes[ccType] + ']');
    return mappedCreditCardTypes[ccType];
  }
  logMessage('Returning ccType [' + ccType + ']');
  return ccType;
});

logMessage = (function (msg) {
  casper.echo(msg);
});

logError = (function (msg) {
  casper.echo(msg);
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
  if(code) {
    picit(order.id + '-' + code);
  }
  casper.exit(code);
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

casper.start();

casper.start('http://combinecouture.com/confirmation-links.html', function() {
  this.echo("Confirmation page loaded.");
});


casper.then(function() {
  var finalType = mappedCreditCardType('Mastercard');
  logMessage('FINAL TYPE: ' + finalType);
  var testString = 'abc123 tortoise';
  logMessage('UPPERCASE TEST: ' + testString + ': ' + testString.toUpperCase())
});

casper.then(function() {
  this.exit(0);
});
// ADD ITEMS BEGIN


// RUN IIIIIIIIIIIT!
casper.run();