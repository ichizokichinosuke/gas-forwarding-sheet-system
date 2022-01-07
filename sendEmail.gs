function sendEmail(emailDict, status) {
  var sheetName;
  if (status == "1.アポ") sheetName = "アポ時送付メール";
  else if (status == "2.リード") sheetName = "リード時送付メール";

  const sheetContent = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const recipient = searchEmailAddress(emailDict);
  const subject = sheetContent.getRange(2,1).getValue();

  var content = sheetContent.getRange(2,2).getValue();
  var matchObj = new RegExp(/{\S*}/,'g');
  var matchList = content.match(matchObj);

  // Logger.log(matchList[0]);
  // Logger.log(matchList[1]);
  // Logger.log(matchList[2]);

  matchList.forEach(function(matchStr, idx){
    var columnVal = matchStr.slice(1,matchStr.length-1);
    var recordVal;
    if (typeof emailDict[columnVal] === 'undefined') recordVal = "";
    else recordVal = emailDict[columnVal]
    // Logger.log(matchStr);
    // Logger.log(columnVal);
    content = content.replaceAll(matchStr, recordVal);
  });
  
  try {
    GmailApp.sendEmail(recipient, subject, content);
    // GmailApp.sendEmail(recipient, subject, body, options);
  }
  catch(error){
    console.error(error);
  }
}

function searchEmailAddress (emailDict) {
  for (const [col, val] of Object.entries(emailDict)) {
    if (col.match(/メ(ール|アド).*/)) {
      return val;
    }
  }
  return;
}
