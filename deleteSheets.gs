function deleteSheets() {
  var ss = SpreadsheetApp.getActive();
  var apoSheet = ss.getSheetByName("アポ");
  var leadSheet = ss.getSheetByName("リード");
  ss.deleteSheet(apoSheet);
  ss.deleteSheet(leadSheet);
}