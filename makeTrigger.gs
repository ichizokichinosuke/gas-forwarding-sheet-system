function makeTrigger() {
  var sheet = SpreadsheetApp.getActive().getSheetByName("info");

  var triggerStatusRange = sheet.getRange(14,1);
  var triggerStatus = triggerStatusRange.getValue();
  // 実行確認ダイアログを作成
  var response = alert(triggerStatus);
  
  if (response == "NO"){
    return;
  } else {
    triggerStatusRange.setValue("作成済み");
    // return;
  }
  
  var triggerMinutes = 1;
  ScriptApp.newTrigger("getGmail2SpreadSheet")
              .timeBased()
              .everyMinutes(triggerMinutes)
              .create();

  // infoシートを基に以下の処理を実行
  // トリガー作成ステータスを完了に更新
  makeSheets();
  // 新規ラベル作成
  GmailApp.createLabel("エラー処理済み");
}

function alert(triggerStatus) {
  var ui = SpreadsheetApp.getUi();
  const TITLE = '本当にトリガーを作成しますか?';
  var dialoguePrompt = '現在のトリガー作成状況は ' + triggerStatus + ' です。'
  var response = ui.alert(TITLE, dialoguePrompt, ui.ButtonSet.YES_NO);

  return response;
}