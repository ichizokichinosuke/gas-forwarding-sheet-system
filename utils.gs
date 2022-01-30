function getLastRowinNoCol(sheet) {
  const maxRow = sheet.getMaxRows();
  return sheet.getRange(maxRow,1).getNextDataCell(SpreadsheetApp.Direction.UP).getRowIndex();
}

function makeDict(record, columns) {
  var dict = {};
  for (var i=0; i<columns.length; i++) {
    dict[columns[i]] = record[i];
  }
  return dict;
}

function alertSendEmail() {
  var ui = SpreadsheetApp.getUi();
  const TITLE = 'メールを送付しますか?';
  var dialoguePrompt = '注意: チェックが入っていない全ての企業にメールを送付します。'
  var response = ui.alert(TITLE, dialoguePrompt, ui.ButtonSet.YES_NO);

  return response;
}