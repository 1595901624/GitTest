// const request = require("request")
const request = require('request-promise');
const { v4: uuidv4 } = require('uuid')
const CryptoJS = require("crypto-js")
const Crypto = require("crypto")

const VMESS_URL = "https://www.xfl6kso8.xyz:20000/api/evmess";

const options = {
    url: getCommonParams(VMESS_URL, 36)
};

const area = [999, 2, 34, 48, 49, 17, 7, 46, 4, 3, 33,
    36, 9, 7, 25, 5, 11, 8, 32, 38, 39, 6, 4, 10, 12, 13,
    15, 19, 20, 21, 22, 23, 30, 31, 35, 36, 37, 40, 41, 42, 43, 44];
// console.log(getCommonParams('https://175.178.204.163:20000/myapi/apinodelist', ''))
// console.log(aesDecrypt('QPVdbxLRaJYXluD9V+MHHQ=='))

(async function () {
    for (const index in area) {
        let option = {
            method: 'GET',
            uri: getCommonParams(VMESS_URL, area[index])
        }
        let result = await request.get(option)
        try {
            console.log(aesDecrypt(result))
        } catch (e) {

        }
        sleep(2000)
    }
    console.log("抓取完成");
})()

// request.get({
//     url: getCommonParams(VMESS_URL, 36),
//     timeout: 15000
// }, function (err, response, body) {
//     // console.info(response.body);
//     let result = response.body;
//     try {
//         console.log(aesDecrypt(result))
//     } catch (e) {

//     }
// });
// }

/**
 * 获取VMESS
 * @param {*} url 
 * @param {*} area 地区编号
 * @returns 
 */
function getCommonParams(url, area) {
    let sign = "B89F08DFD5A44402B2E8165C82623A444AA15139";
    let deviceId = uuidv4().replace(/-/g, "");
    let apps = md5(sign + deviceId);
    let time = new Date().getTime();
    let result = url + "&vip=true&proto=4&platform=android&ver=7.5.3&deviceid=" + deviceId + "&unicode=" + deviceId + "&t="
        + time
        + "&code=C1LCR6X&recomm_code=&f=2022-07-29&install=2022-06-29&token=&package=com.network.xf100&width=411.42856&height=774.8571&apps="
        + apps + "&area=" + area;
    return result;
}

/**
 * MD5加密
 * @param {*} data 
 * @returns 
 */
function md5(data) {
    const md5 = Crypto.createHash('md5');
    const result = md5.update(data).digest('hex');
    return result;
}

/**
 * AES解密 
 * AES/CBC/NoPadding  128位   密钥：awdtif20190619ti  偏移量：awdtif20190619ti
 * @param {*} word 
 * @returns 
 */
function aesDecrypt(word) {
    var keyStr = 'awdtif20190619ti';
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv = CryptoJS.enc.Utf8.parse(keyStr);
    var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding, iv: iv });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

/**
 * 睡眠
 * @param {*} delay 
 */
function sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}
