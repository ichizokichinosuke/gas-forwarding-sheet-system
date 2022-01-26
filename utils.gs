function getLastRowinNoCol(sheet) {
  const maxRow = sheet.getMaxRows();
  return sheet.getRange(maxRow,1).getNextDataCell(SpreadsheetApp.Direction.UP).getRowIndex();
}