const CryptoJS = require("crypto-js");

const key = "dingHao-disk-app"
const iv = "osxuinipoop111Pp";

// 创建一个 Date 对象，表示当前时间
var currentTime = new Date();

// 获取当前时间的时间戳（以毫秒为单位）
var timestamp = currentTime.getTime();

// 当前时间戳   
var timestampInSeconds = Math.floor(timestamp / 1000);
var time = CryptoJS.enc.Utf8.parse(1689779972214);
var newKey = CryptoJS.enc.Utf8.parse(key);
var enc = CryptoJS.AES.encrypt(time, newKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
});

console.log(enc.ciphertext.toString());

console.log(decrypt("4e0cb3ab50d09285e8ed0090aea560d8"));

function decrypt(t) {
    let e = CryptoJS.enc.Hex.parse(t);
    let n = CryptoJS.enc.Base64.stringify(e);
    let a = CryptoJS.AES.decrypt(n, newKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    let o = a.toString(CryptoJS.enc.Utf8);
    return o.toString()
}
