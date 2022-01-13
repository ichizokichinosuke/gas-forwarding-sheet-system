function deleteTriggers() {
  const infoSheet = SpreadsheetApp.getActive().getSheetByName("info");
  var triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    ScriptApp.deleteTrigger(trigger);
  }
  infoSheet.getRange(14,1).setValue("未作成");

}
