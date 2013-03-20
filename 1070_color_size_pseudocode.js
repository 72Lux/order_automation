/* POTENTIAL PRODUCTS */

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


var lineItem = order.lineItem;

if (lineItem.color && lineItem.size) {
  // eg: clothes and shoes

  if($('#adColor .variationDD').is(':visible') && $('#adSize .variationDD').is(':visible') && ($("#adColor .variationDD option:first").val() === 'First, Select Size') && ($("#adColor .variationDD option:first").val() === 'Then, Select Color')) {
    // TWO visible dropdowns
    // set both dropdowns

  } else if($('#adColor .variationDD').is(':visible') && $('#adSize .variationDD').is(':hidden') && ($("#adColor .variationDD option:first").val() === 'First, Select Size') && ($('#adColor .nsStyle').text().toLowerCase().indexOf(lineItem.color) >= 0 )) {
    // set visible color dropdown

  } else if($('#adColor .variationDD').is(':hidden') && $('#adSize .variationDD').is(':hidden') && ($('#adColor .nsStyle').text().toLowerCase().indexOf(lineItem.color) >= 0 ) && ($('#adSize #dd1NonSelect').text().toLowerCase().indexOf(lineItem.size) >= 0)) {
    // nothing to set

  } else {
    // exit with error

  }

} else if (lineItem.color && !lineItem.size) {
  // eg: beauty
  // the color select shows up in the #adSize div when there is no size to be selected
 if($(".variationDD option:first").val() === 'Please Select Color') {
    // set color
  } else {
    // exit with error
  }

} else {
  // exit with error

}