#!/usr/bin/env node
// const lowDb = require("./src/function/settingEnv");
// lowDb.addData();
// lowDb.addData();

// for(let i = 0; i<50;i++){
//     lowDb.addData();
// }

// 要做一個可以根據作業系統 放暫存資料檔案的功能

let argv = require('yargs/yargs')(process.argv.slice(2))
  .option('stock', {
    alias: 's',
    // demandOption: true,
    // boolean: true,
    describe: '找股票當月收盤  (首月第一天可能會故障要等收盤)  genTwId -s 2330',
    string: true
  })
  .help()
  .alias('help', 'h')
  .locale('zh_TW').argv
// console.log(":", argv);

if (!!argv.s || !!argv.stock) {

} else {




  let i = 0;
  let result = false;
  let resultId = "";
  while (result != true) {
    resultId = generateId()
    result = checkTwId(resultId);
  }
  //     const clipboardy = require('clipboardy');
  //     // Copy
  // clipboardy.writeSync(resultId);

  // // // Paste
  // // clipboardy.readSync();
  // //🦄

  if (printComputerInfo() == "win") {
    wincopy(resultId);
  } else {
    pbcopy(resultId);
  }
  console.log(resultId);
}

function wincopy(id){
  // https://iter01.com/42918.html
  const { exec } = require('child_process');
  // exec('echo '+id+' | clip');
  exec('clip').stdin.end(id);
}


function pbcopy(id) {
  var proc = require('child_process').spawn('pbcopy');
  proc.stdin.write(id); proc.stdin.end();
}
// https://www.twse.com.tw/exchangeReport/STOCK_DAY_ALL?response=open_dat
// https://aronhack.com/products/python-download-taiwan-stock-data-from-twse/

function passData(object, index) {
  const indexParse = parseInt(index.toString(), 10);
  return object[indexParse];
}

function generateId() {
  const firstN = Math.floor(Math.random() * 26);

  const secN = Math.floor(Math.random() * 2 + 1);
  let otherN = "";
  for (let i = 0; i < 8; i++) {
    otherN += Math.floor(Math.random() * 10).toString();
  }

  const firstIdList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const id = firstIdList[firstN] + secN.toString() + otherN;

  return id;

}

function checkTwId(id) {

  let sum = 0;
  const firstIdText = id.slice(0, 1);
  const firstIdList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


  const firstIdListPlus = [
    1, // A -> 10 -> 1 * 1 + 9 * 0 = 1
    10, // B -> 11 -> 1 * 1 + 9 * 1 = 10
    19, // C -> 12 -> 1 * 1 + 9 * 2 = 19
    28, // D
    37, // E
    46, // F
    55, // G
    64, // H
    39, // I -> 34 -> 1 * 3 + 9 * 4 = 39
    73, // J
    82, // K
    2, // L
    11, // M
    20, // N
    48, // O -> 35 -> 1 * 3 + 9 * 5 = 48
    29, // P
    38, // Q
    47, // R
    56, // S
    65, // T
    74, // U
    83, // V
    21, // W -> 32 -> 1 * 3 + 9 * 2 = 21
    3, // X
    12, // Y
    30 // Z -> 33 -> 1 * 3 + 9 * 3 = 30
  ];
  const firstIdTextIndex = firstIdList.indexOf(firstIdText);


  sum = sum + firstIdListPlus[firstIdTextIndex];

  const idText = id.slice(1, 9);

  const idTextList = idText.split('');
  for (let i = 0; i < idTextList.length; i++) {
    sum += passData(idTextList, i) * (8 - i);
  }


  let right = 0;
  // 產生正確的最後一碼(驗證碼);
  if (sum % 10 == 0) {
  } else {
    right = 10 - sum % 10;
  }

  if (id.slice(9, 10).toString() === right.toString()) {
    return true;
  } else {
    return false;
  }
}


function printComputerInfo() {

  const os = require("os");


  switch (os.platform()) {
    case "darwin":
      return "osx";
      break;

    case "android":
      break;
    case "linux":
      break;
    case "win32":
      return "win";
      break;
    default:
      console.log("you os not recognize");
  }

}