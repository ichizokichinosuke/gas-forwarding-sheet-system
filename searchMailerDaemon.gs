function searchMailerDaemon() {
  var infoSheet = SpreadsheetApp.getActive().getSheetByName("info");

  var isApoMail = infoSheet.getRange(2,2).getValue();
  var isLeadMail = infoSheet.getRange(2,3).getValue();
  var recipient = infoSheet.getRange(2,4).getValue();

  var today = new Date();
  today = Utilities.formatDate( today, 'Asia/Tokyo', 'yyyy/MM/dd');
  var sender = "mailer-daemon@googlemail.com";
  var searchQuery = "after:" + today;
  
  searchQuery += " from:"+sender;
  searchQuery += " has:nouserlabels";

  if (isApoMail) {
    var apoSheet = SpreadsheetApp.getActive().getSheetByName("アポ");
    searchErrorMail(apoSheet, searchQuery, recipient);
  }

  if (isLeadMail) {
    var leadSheet = SpreadsheetApp.getActive().getSheetByName("リード");
    searchErrorMail(leadSheet, searchQuery, recipient);
  }
}

function searchErrorMail(sheet, searchQuery, recipient) {
  var threads = GmailApp.search(searchQuery);
  var myAddress = Session.getActiveUser().getUserLoginId();
  var errorAddress;
  var senderAddress;
  threads.forEach(function(thread){
    var messages = thread.getMessages();
    // ［結果ステータス］
    messages.forEach(function(message, msgIdx) {
      // スレッドの1つ目のメッセージの送信者で案件判別
      // スプレッドシートへその旨記載
      // row 行判別
      var msgSender = message.getFrom();
      var msgReceiver = message.getTo();

      Logger.log("msg index: "+ msgIdx);
      if (msgIdx == 0) {
        errorAddress = msgReceiver;
        Logger.log("error Address: "+ errorAddress);
      } else if (msgIdx == 1) {
        senderAddress = msgReceiver;
        if (senderAddress === myAddress) {
          // Logger.log(senderAddress);
          // スプレッドシートへ書き込み処理
          var cols = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
          // var mailColIdx = cols.indexOf("メールアドレス");
          var mailColIdx = searchColIdx(cols, /^メ(ール|アド).*/);

          Logger.log("mail col idx: "+mailColIdx);
          var mailColVals = sheet.getRange(2,mailColIdx+1,sheet.getLastRow()-1,1).getValues();
          Logger.log("Flattening");
          mailColVals = mailColVals.flat();
          Logger.log(mailColVals);
          
          // サーチ
          var recordIdx = mailColVals.indexOf(errorAddress);
          Logger.log("record idx: "+recordIdx);
          if (recordIdx <= -1) return;
          // Logger.log(senderAddress);
          // そこのチェックカラムに書き込み
          var isSentIdx = cols.indexOf("資料送付");
          if (isSentIdx >= 0) sheet.getRange(recordIdx+1+1,isSentIdx+1,1,1).setValue("Error");
          // ラベル付け
          var label = GmailApp.getUserLabelByName('エラー処理済み');
          // メール送信
          // Logger.log(myAddress);
          var sheetURL = SpreadsheetApp.getActive().getUrl();
          
          var subject = "送信エラー発生"
          const body = 
          `${myAddress} の管理する案件で、資料メール送信エラーが発生しました。\n エラーが発生したアドレスは以下です。\n\n${errorAddress} \n${sheetURL} \n`;

          GmailApp.sendEmail(recipient, subject, body);
          thread.addLabel(label);
        }
      }
    });
  });
}

function searchColIdx(cols, query) {
  var idx = 0;
  for (const col of cols) {
    var matchColName = col.match(query);
    if (matchColName) return idx;
    idx += 1;
  }
}