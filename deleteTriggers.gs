function test() {
  const str_1 = `abcd xyz\nefgh jkl\ xxx`;
  const pattern = /abcd (.*)/g;
  Logger.log(str_1);
  Logger.log(str_1.matchAll(pattern));
  for (const match of str_1.matchAll(pattern)){
    Logger.log(match);
  }
}
