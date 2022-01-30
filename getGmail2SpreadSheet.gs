function getGmail2SpreadSheet() {
  const infoSheet = SpreadsheetApp.getActive().getSheetByName("info");
  const commerce = infoSheet.getRange(2,1).getValue();
  const sender = "report@calltree.jp";

  // var today = new Date();
  // Logger.log(today)
  // today = Utilities.formatDate( today, 'Asia/Tokyo', 'yyyy/MM/dd');

  // var searchQuery = "after:" + today;
  // var searchQuery  = "from:"+sender;
  var searchQuery = "newer_than:1d";
  searchQuery += " from:"+sender;
  

  var threads = GmailApp.search(searchQuery);
  Logger.log(searchQuery);
  Logger.log(threads);
  apoSheet = SpreadsheetApp.getActive().getSheetByName("アポ");
  leadSheet = SpreadsheetApp.getActive().getSheetByName("リード");
  
  processThreads(threads, apoSheet, leadSheet, infoSheet);
  searchMailerDaemon(commerce);
}

function processThreads(threads, apoSheet, leadSheet, infoSheet) {
  var apoCols = apoSheet.getRange(1,2,1,apoSheet.getLastColumn()-1).getValues()[0];
  var leadCols = leadSheet.getRange(1,2,1,leadSheet.getLastColumn()-1).getValues()[0];
  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    messages.forEach(function(message) {
      if (!message.isStarred()){
        var plainBody = message.getPlainBody();
        // loopの最初だけ
        // このスプレッドシートの担当する案件か
        var thisMatter = infoSheet.getRange(2,1).getValue();
        var matter = plainBody.match(/［案件名］ (.*)/)[1];
        Logger.log("this sheet matter is: "+thisMatter);
        Logger.log("this mail is: "+matter);
        if (thisMatter != matter) return;

        var status = plainBody.match(/［結果ステータス］ (.*)/);

        if (status[1] == "1.アポ") {
          var emailDict = forward2SheetDict(plainBody, apoSheet, apoCols);
          var isEmailing = infoSheet.getRange(2,3).getValue();
        } else if (status[1] == "2.リード") {
          var emailDict = forward2SheetDict(plainBody, leadSheet, leadCols);
          var isEmailing = infoSheet.getRange(2,2).getValue();
        }

        Logger.log(emailDict);

        message.star();
        // if (isEmailing == "YES") sendEmail(emailDict, status[1]);
      }
    });
  });
}

function forward2SheetDict(message, sheet, cols) {
  var forwardArray = new Array(sheet.getLastColumn());
  var lastRow = getLastRowinNoCol(sheet);
  var emailDict = {}
  forwardArray[0] = "=ROW()-1";
  cols.forEach(function (col, colIdx){
    var matchObj = new RegExp("［"+col+"］(.*)", "g");
    // if(val == "備考") matchObj = new RegExp(searchKey+"(.*\n)*");
    // var matchStr = message.match(matchObj);
    var matchStr;
    for (const match of message.matchAll(matchObj)){
      matchStr = match
    }

    if (matchStr === undefined || matchStr === null) return;

    Logger.log("match str: "+matchStr);
    Logger.log("column: "+col);
    var forwardValue = matchStr[1].trim();
    if (colIdx == -1) return;
    // Logger.log("Cols: %s", cols);
    // Logger.log("Val: %s", val);
    // Noカラムがあるため、ずらす
    forwardArray[colIdx+1] = forwardValue;
    emailDict[col] = forwardValue;
    if (col==="電話番号" || col==="TEL") sheet.getRange(lastRow+1,colIdx+2,1,1).setNumberFormat("@");
  // }
  })
  
  sheet.getRange(lastRow+1, 1, 1, forwardArray.length).setValues([forwardArray]);
  Logger.log("forward Array: "+forwardArray);
  return emailDict;
}

