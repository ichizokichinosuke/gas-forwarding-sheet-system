function myFunction() {
  var str_1 = "メールアドレス";
  var str_2 = "メアド";
  var pattern = /メ(ール|アド).*/;
  if(str_1.match(pattern)) Logger.log("WHAT?")
  Logger.log(str_1.match(pattern));
  Logger.log(str_2.match(pattern));
  if (null) Logger.log("FUCK")
}
