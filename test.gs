function test() {
  // const str_1 = `abcd xyz\nefgh jkl\ xxx`;
  // const pattern = /abcd (.*)/g;
  // Logger.log(str_1);
  // Logger.log(str_1.matchAll(pattern));
  // for (const match of str_1.matchAll(pattern)){
  //   Logger.log(match);
  // }
  // var triggers = ScriptApp.getProjectTriggers();
  // Logger.log(triggers);
  // if (triggers.length === 0) Logger.log("ff")
  // for (const trigger of triggers) {
  //   ScriptApp.deleteTrigger(trigger);
  // }
  // const apoSheet = SpreadsheetApp.getActive().getSheetByName("アポ");
  // const leadSheet = SpreadsheetApp.getActive().getSheetByName("リード");

  // Logger.log(apoSheet.getLastRow());
  // Logger.log(leadSheet.getLastRow());
  // var x = ["a", "b", "c"];
  // var y = [1,2,3];
  // var z = {}
  // Logger.log(x);
  // Logger.log(y);

  // for (var i=0; i<x.length; i++) {
  //   z[x[i]] = y[i]
  // }
  // Logger.log(z);

  Logger.log("メール送付".match(/^メ(ール|アド)(アドレス)?$/));

}
