function clearSheets() {
  var ss = SpreadsheetApp.getActive();
  var infoSheet = ss.getSheetByName("info");
  var apoSheet = ss.getSheetByName("アポ");
  var leadSheet = ss.getSheetByName("リード");
  
  // ss.deleteSheet(apoSheet);
  // ss.deleteSheet(leadSheet);
  apoSheet.clearContents();
  leadSheet.clearContents();
  // deleteTriggers();
}