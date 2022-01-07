function makeSheets() {
  var spreadSheet = SpreadsheetApp.getActive()
  var sheet = spreadSheet.getSheetByName('info');
  var lastCol = sheet.getLastColumn()+1;
  // const COMPANY_ROW = 2

  // ハードコードではなく、サーチでも良い
  const APO_ROW = 8;
  const LEAD_ROW = 11;
  // var companyName = sheet.getRange(COMPANY_ROW,1);
  var apoColumns = sheet.getRange(APO_ROW, 1, 1, lastCol).getValues();
  var leadColumns = sheet.getRange(LEAD_ROW, 1, 1, lastCol).getValues();
  // 空白削除
  apoColumns = apoColumns.filter(v => v[0]);
  leadColumns = leadColumns.filter(v => v[0]);

  var apoSheet = spreadSheet.insertSheet("アポ");
  var leadSheet = spreadSheet.insertSheet("リード");

  apoSheet.getRange(1,1,1,apoColumns[0].length).setValues(apoColumns);
  leadSheet.getRange(1,1,1,leadColumns[0].length).setValues(leadColumns);

}
