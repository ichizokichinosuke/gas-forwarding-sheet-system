const CALLTREE_to_SS_APO = {
  "［電話番号］": "電話番号",
  "［商号］": "企業名",
  "［部署］": "所属部署",
  "［役職］": "役職",
  "［所在地］": "住所",
  "［会社概要ページURL］": "HP",
  "［電話名義］": "架電担当",
  "［代表名（アポ対象者）］": "担当者名",
  "［対象者名］": "担当者名",

  "［TEL］": "電話番号",
  "［アポ日程］": "アポ日時",
  "［メアド］": "メールアドレス",
  "［備考］": "備考",
  "［リスト名］": "リスト名",
  "［対応日時］": "アポ取得日",
  "［法人番号］": "法人番号",
}

const CALLTREE_to_SS_LEAD = {
  // "［案件名］": "SUBJECT",
  // "xxx": "アポ獲得（アポリストへ移行）",
  // "xxx": "資料送付",
  "［電話名義］": "架電担当",
  "［商号］": "企業名",
  "［部署］": "所属部署",
  "［役職］": "役職",
  "［対象者名］": "担当者名",
  "［所在地］": "住所",
  "［会社概要ページURL］": "HP",
  "［電話番号］": "電話番号",
  "［メアド］": "メールアドレス",
  "［TEL］": "電話番号",
  "［備考］": "備考",
  "［リスト名］": "リスト名",
  // "xxx": "追い電担当者名",
  // "［アポ日程日］": "リード取得日",
  "［対応日時］": "リード取得日",
  "［法人番号］": "法人番号",
  // "xxx": "ステータス",
  // "xxx": "追い備考",
  // "xxx": "アポ日",
}


function getGmail2SpreadSheet() {
  var infoSheet = SpreadsheetApp.getActive().getSheetByName("info");
  // 検索条件に該当するスレッド一覧を取得
  var today = new Date();
  var commerce = infoSheet.getRange(2,1).getValue();
  var sender = "report@calltree.jp";
  
  today = Utilities.formatDate( today, 'Asia/Tokyo', 'yyyy/MM/dd');
  // var searchQuery = "after:" + today;
  // searchQuery += " from:"+sender;

  var searchQuery = " from:"+sender;
  // searchQuery += " has:nouserlabels";

  var threads = GmailApp.search(searchQuery);
  Logger.log(searchQuery);
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
        // Logger.log(plainBody);

        // loopの最初だけ
        // このスプレッドシートの担当する案件か
        var thisMatter = infoSheet.getRange(2,1).getValue();
        var matter = plainBody.match(/［案件名］ (.*)/)[1];
        Logger.log("this sheet matter is: "+thisMatter);
        Logger.log("this mail is: "+matter);
        if (thisMatter != matter) return;

        var status = plainBody.match(/［結果ステータス］ (.*)/);

        var emailDict = forward2SheetDict(plainBody, leadSheet, leadCols, type);
        if (status[1] == "1.アポ") {
          var isEmailing = infoSheet.getRange(2,3).getValue();
        } else if (status[1] == "2.リード") {
          var isEmailing = infoSheet.getRange(2,2).getValue();
        }

        if (isEmailing == "YES") sendEmail(emailDict);

        
        // if (status[1] == "1.アポ") {
        //   var type = 1;
        //   forward2SheetDict(plainBody, apoSheet, apoCols, type);
        // } else if (status[1] == "2.リード") {
        //   var type = 2;
        //   var emailDict = forward2SheetDict(plainBody, leadSheet, leadCols, type);
        //   // Logger.log(emailDict);
        //   var isEmailing = infoSheet.getRange(2,2).getValue();
        //   if (isEmailing == "YES") sendEmail(emailDict);
        // }
        message.star();
      }
    });
  });
}

function forward2SheetDict(message, sheet, cols, type) {
  // Logger.log(type);
  var forwardArray = new Array(sheet.getLastColumn());
  var lastRow = sheet.getLastRow();
  forwardArray[0] = lastRow;
  if(type == 1) {
    // アポのとき
    var iterateDict = CALLTREE_to_SS_APO;
  } else {
    // リードのとき
    var iterateDict = CALLTREE_to_SS_LEAD;
    var emailDict = {};
  }
  // for (let [searchKey, val] of Object.entries(iterateDict)){
  cols.forEach(function (col, colIdx){
    // var matchObj = new RegExp(searchKey+"(.*)");
    var matchObj = new RegExp("［"+col+"］(.*)");
    // if(val == "備考") matchObj = new RegExp(searchKey+"(.*\n)*");
    var matchStr = message.match(matchObj);
    if (matchStr === null) {
      // 検知できなかったとき
      // continue;
      return;
    }
    // Logger.log("Match str");
    // Logger.log(matchStr);
    var forwardValue = matchStr[1].trim();
    // forwardValue = forwardValue.toString();
    // Logger.log("MatchStr(forwardValue): %s", forwardValue);
    // var forwardColIdx = cols.indexOf(val);
    var forwardColIdx = colIdx;
    var val = col;
    // if (forwardColIdx == -1) continue;
    if (forwardColIdx == -1) return;
    // Logger.log("Cols: %s", cols);
    // Logger.log("Val: %s", val);
    // Noカラムがあるため、ずらす
    forwardArray[forwardColIdx+1] = forwardValue;
    // if (type == 2) emailDict[val] = forwardValue;
    emailDict[val] = forwardValue;
    if (val==="電話番号" || val==="TEL") sheet.getRange(lastRow+1,forwardColIdx+2,1,1).setNumberFormat("@");
  // }
  })
  
  sheet.getRange(lastRow+1, 1, 1, forwardArray.length).setValues([forwardArray]);
  // Logger.log("Done");
  Logger.log(forwardArray);
  if (type == 2) return emailDict;
}