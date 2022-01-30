function sendEmailfromSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  // const sheet = SpreadsheetApp.getActive().getSheetByName("アポ");
  
  const sheetName = sheet.getSheetName();
  var response = alertSendEmail();
  
  if (response == "NO") return;
  
  const LAST_COL = sheet.getLastColumn();
  const LAST_ROW = getLastRowinNoCol(sheet);
  const isSentColName = "メール送付";

  const allData = sheet.getRange(1,1,LAST_ROW,LAST_COL).getValues();
  const columns = allData[0];
  const isSentIdx = columns.indexOf(isSentColName);
  // Logger.log(columns);
  // Logger.log(allData);
  var forwardValues;
  forwardValues = allData.slice(1);
  
  const falseIdxs = forwardValues.flatMap((record,idx) => record[isSentIdx]==false ? idx:[]);
  // Logger.log(falseIdxs);
  for(const idx of falseIdxs) {
    const record = forwardValues[idx];
    const emailDict = makeDict(record, columns);
    // Logger.log(emailDict);
    sendEmailfromRecord(emailDict, sheetName);
    Logger.log("idx: "+idx+", isSentIdx: "+isSentIdx);
    sheet.getRange(idx+2, isSentIdx+1).setValue(true);
  }
}

function sendEmailfromRecord(emailDict, sheetName) {
  if (sheetName === "アポ") {
    var mailTemplateSheet = SpreadsheetApp.getActive().getSheetByName("アポ時送付メール");
    var inChargeAddress = getInChargeAddress(emailDict);
  } else {
    var mailTemplateSheet = SpreadsheetApp.getActive().getSheetByName("リード時送付メール");
  }

  const subject = mailTemplateSheet.getRange(2,1).getValue();
  const recipient = searchEmailAddress(emailDict);
  Logger.log("recipient: "+recipient);

  var content = mailTemplateSheet.getRange(2,2).getValue();
  const matchObj = new RegExp(/{\S*?}/,'g');
  const matchList = content.match(matchObj);

  matchList.forEach(function(matchStr, idx){
    var columnVal = matchStr.slice(1,matchStr.length-1);
    var recordVal;
    if (typeof emailDict[columnVal] === 'undefined') recordVal = "";
    else if (Object.prototype.toString.call(emailDict[columnVal]) === "[object Date]") {
      recordVal = Utilities.formatDate(emailDict[columnVal], 'JST', 'MM/dd');
    }
    else recordVal = emailDict[columnVal]
    // Logger.log(recordVal)
    // Logger.log(typeof recordVal)
    // Logger.log(Object.prototype.toString.call(recordVal))

    content = content.replaceAll(matchStr, recordVal);
  });
  
  try {
    GmailApp.sendEmail(recipient, subject, content, {cc: inChargeAddress});
  }
  catch(error){
    GmailApp.sendEmail(recipient, subject, content);
    console.error(error);
  }
}

function sendEmail(emailDict, status) {
  var sheetName;
  var inChargeAddress;
  if (status == "1.アポ") {
    sheetName = "アポ時送付メール";
    inChargeAddress = getInChargeAddress(emailDict);
  }
  else if (status == "2.リード") sheetName = "リード時送付メール";

  const sheetContent = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const recipient = searchEmailAddress(emailDict);
  const subject = sheetContent.getRange(2,1).getValue();

  var content = sheetContent.getRange(2,2).getValue();
  var matchObj = new RegExp(/{\S*?}/,'g');
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
    GmailApp.sendEmail(recipient, subject, content, {cc: inChargeAddress});
    // GmailApp.sendEmail(recipient, subject, body, options);
  }
  catch(error){
    GmailApp.sendEmail(recipient, subject, content);
    console.error(error);

  }
}

function getInChargeAddress(emailDict) {
  var inChargeName;
  for (const [col, val] of Object.entries(emailDict)) {
    if (col.match(/^担当$/)) {
      inChargeName = val;
      const iciSheet = SpreadsheetApp.getActive().getSheetByName("担当者 info");
      const lastRow = iciSheet.getLastRow();
      var allInChargeNames = iciSheet.getRange(2,2,lastRow-1,1).getValues();
      allInChargeNames = allInChargeNames.map(v => v[0]);
      // Logger.log(lastRow);
      // Logger.log(allInChargeNames);
      const rowIdx = allInChargeNames.indexOf(inChargeName);
      const inChargeAddress = iciSheet.getRange(rowIdx+2,3).getValue();
      return inChargeAddress;
    }
  }
  return;
}

function searchEmailAddress (emailDict) {
  for (const [col, val] of Object.entries(emailDict)) {
    if (col.match(/^メ(ール|アド)(アドレス)?$/)) {
      return val;
    }
  }
  return;
}
