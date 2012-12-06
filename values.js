// product that contains multiple sizes and multiple colors for size select option[value="36.5B/6.5B"]
//var url = 'http://www.neimanmarcus.com/p/Yves-Saint-Laurent-Tribtoo-Patent-Pump/prod139100403/?eVar4=You%20May%20Also%20Like%20RR';
//var option_value = "36.5B/6.5B";

// product that contains multiple sizes and a single color option for size select option[value="7/8D"]
var url = 'http://www.neimanmarcus.com/p/Prada-Wing-Tip-Chelsea-Boot-Boots/prod146820012_cat6750735__/?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat6750735%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod146820012&cmCat=product';
var option_value = "7/8D";

// Form values
var customer = {
  email : 'ed@bast.com',

  shipping_title : 'F',
  shipping_firstName : 'Ed',
  shipping_lastName : 'Bast',
  shipping_country : 'US',
  shipping_addressLineOne : '991 Lafayette Avenue',
  shipping_addressLineTwo : 'Apt 2',
  shipping_city : 'Brooklyn',
  shipping_state : 'NY',
  shipping_zip : '11221',
  shipping_phoneType : 'O',
  shipping_phone : '9137354378',

  shipping_shippingMethod : 'SL3',  // this may just end up in neiman.js
  shipping_isPOBox : false,  // still deciding how to determine this
  shipping_useAsBilling : false,  // this may just end up in neiman.js as default

  billing_title : 'F',
  billing_firstName : 'Ed',
  billing_lastName : 'Bast',
  billing_country : 'US',
  billing_addressLineOne : '991 Lafayette Avenue',
  billing_addressLineTwo : 'Apt 2',
  billing_city : 'Brooklyn',
  billing_state : 'NY',
  billing_zip : '11221',
  billing_phoneType : 'O',
  billing_phone : '9137354378',

  billing_cardType : 'Visa',
  billing_cardNumber : '4111111111111111',
  billing_securityCode : '123',
  billing_cardExpMonth : '12',
  billing_cardExpYear : '2013'
};

console.log('customer:'+Object.keys(customer).length);

















