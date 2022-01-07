function sendEmail(emailDict) {
  const sheetContent = SpreadsheetApp.getActive().getSheetByName("資料");
  const sheetInfo = SpreadsheetApp.getActive().getSheetByName("info");
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

  
  // const recipient = 'bugattiveyroooone@icloud.com';         //送信先のメールアドレス
  const recipient = emailDict["メールアドレス"];
  const subject = sheetContent.getRange(2,1).getValue();                 //件名
  // const recipientCompany = emailDict["企業名"];
  // const recipientSection = emailDict["部署"];
  // const recipientName = emailDict["担当者名"];

  // // var infoCols = sheetInfo.getRange(1,1,1,sheetInfo.getLastColumn()+1).getValues();
  // // infoCols = infoCols.fillter(v => v[0]);
  // const commerce = sheetInfo.getRange(2,1).getValue();
  // const senderCompany = sheetInfo.getRange(2,2).getValue();
  // const senderName = sheetInfo.getRange(2,3).getValue();
  // const senderMail = sheetInfo.getRange(2,4).getValue();
  // const senderAddress = sheetInfo.getRange(2,5).getValue();
  // const senderURL = sheetInfo.getRange(2,6).getValue();


  // Logger.log(content);
  
  // content = content.replaceAll("{企業}", recipientCompany);
  // content = content.replaceAll("{部署}", recipientSection);
  // content = content.replaceAll("{担当者}", recipientName);

  // content = content.replaceAll("{クライアント}", senderCompany);
  // content = content.replaceAll("{ご担当者様}", senderName);
  // content = content.replaceAll("{案件}", commerce);
  // content = content.replaceAll("{メールアドレス}", senderMail);
  // content = content.replaceAll("{住所}", senderAddress);
  // content = content.replaceAll("{HP URL}", senderURL);
  
  // const body = 
  // // `${recipientCompany}\n${recipientName}様\n`
  //   `${content} \n`
  //   // + '\n＊＊テストメールです＊＊\n';                           //本文

  // const options = { name: `${senderCompany} ${senderName}`};  //送信者の名前
  try {
    GmailApp.sendEmail(recipient, subject, content);
    // GmailApp.sendEmail(recipient, subject, body, options);
  }
  catch(error){
    console.error(error);
  }
}
