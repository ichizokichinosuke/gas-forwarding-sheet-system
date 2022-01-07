function searchMailerDaemon() {
  var infoSheet = SpreadsheetApp.getActive().getSheetByName("info");
  var leadSheet = SpreadsheetApp.getActive().getSheetByName("リード");
  // 検索条件に該当するスレッド一覧を取得
  var today = new Date();
  today = Utilities.formatDate( today, 'Asia/Tokyo', 'yyyy/MM/dd');
  var commerce = infoSheet.getRange(2,1).getValue();
  var sender = "mailer-daemon@googlemail.com";
  // var searchQuery = "after:" + today;
  
  // searchQuery += " subject:"+commerce;
  searchQuery = " from:"+sender;

  searchQuery += " has:nouserlabels";
  // searchQuery += " label:処理済み";
  // searchQuery += " subject:"+commerce;

  // Logger.log(searchQuery);
  var threads = GmailApp.search(searchQuery);
  // Logger.log(threads);
  var myAddress = Session.getActiveUser().getUserLoginId();
  var incorrectAddress;
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
      // var plainBody = message.getPlainBody();

      // Logger.log(msgSender);
      // Logger.log(msgReceiver);
      // Logger.log(plainBody);
      Logger.log(msgIdx);
      if (msgIdx == 0) {
        incorrectAddress = msgReceiver;
        Logger.log(incorrectAddress);
      } else if (msgIdx == 1) {
        senderAddress = msgReceiver;
        if (senderAddress == myAddress) {
          // Logger.log(senderAddress);
          // スプレッドシートへ書き込み処理
          var leadCols = leadSheet.getRange(1,1,1,leadSheet.getLastColumn()).getValues()[0];
          var mailColIdx = leadCols.indexOf("メールアドレス");
          Logger.log("mail col idx")
          Logger.log(mailColIdx);
          var mailColVals = leadSheet.getRange(2,mailColIdx+1,leadSheet.getLastRow()-1,1).getValues();
          Logger.log("Flattening");
          mailColVals = mailColVals.flat();
          Logger.log(mailColVals);
          
          // サーチ
          var recordIdx = mailColVals.indexOf(incorrectAddress);
          // Logger.log(recordIdx);
          // Logger.log(senderAddress);
          // そこのチェックカラムに書き込み
          var isSentIdx = leadCols.indexOf("資料送付");
          if (isSentIdx >= 0) leadSheet.getRange(recordIdx+1+1,isSentIdx+1,1,1).setValue("Error");
          // ラベル付け
          var label = GmailApp.getUserLabelByName('エラー処理済み');
          // メール送信
          // Logger.log(myAddress);
          var sheetURL = SpreadsheetApp.getActive().getUrl();
          var recipient = infoSheet.getRange(2,4).getValue();
          var subject = "送信エラー発生"
          const body = 
          `${myAddress} の管理する案件で、資料メール送信エラーが発生しました。\n エラーが発生したアドレスは以下です。\n\n${incorrectAddress} \n${sheetURL} \n`;

          GmailApp.sendEmail(recipient, subject, body);
          thread.addLabel(label);
          // return
          // 
        }
      }
    });
  });
 
}
