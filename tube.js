const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const fs = require("fs");
const { el } = require("date-fns/locale");

/**
 * 加密
 * @param {string} keyString
 * @param {string} plaintext
 * @returns
 */
function encryptAesEcbPkcs7(keyString, plaintext) {
  // Parse the key and the plaintext to WordArray objects
  var key = CryptoJS.enc.Utf8.parse(keyString);
  var message = CryptoJS.enc.Utf8.parse(plaintext);

  // Perform AES encryption with ECB mode and PKCS7 padding
  var encrypted = CryptoJS.AES.encrypt(message, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Convert the ciphertext to a hex string and return it
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

/**
 * 解密
 * @param {string} keyString
 * @param {string} encryptedHex
 * @returns
 */
function decryptAesEcbPkcs7(keyString, encryptedHex) {
  // 将密钥和加密的十六进制字符串转换成WordArray对象
  var key = CryptoJS.enc.Utf8.parse(keyString);
  var encryptedHexParsed = CryptoJS.enc.Hex.parse(encryptedHex);

  // 将加密的数据转换成Base64，因为CryptoJS的decrypt方法需要Base64格式的字符串作为输入
  var encryptedBase64 = CryptoJS.enc.Base64.stringify(encryptedHexParsed);

  // 使用相同的密钥和配置执行AES解密
  var decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  // 将解密后的数据转换成Utf8字符串并返回
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * AES 加密的Key
 */
const key = "UDRnpNG4zVafoPDyKirGyqnq0gP4wlnS";
const url = "https://edgeapi.uboxac.club/node/getInformation_ex";
const filePath = `tube.info`; // 根据今天的日期生成文件路径

/**
 * 创建请求体的 Value
 */
function createValue() {
  // {"imei":"89752164-6bc1-99dd-9ac1-9f4e37ebb757","platform":"android","version_number":31,"models":"MI 6","sdk":"31","m":"C4B3BA4CD0367563327B7AEFD9B9B1BB","c":2}
  const imei = uuidv4();
  const platform = "android";
  const version = "31";
  const models = "Oppo R9";
  const sdk = "31";
  const m = uuidv4().replace(/-/g, "").toUpperCase();
  const c = 2;
  const value = {
    imei,
    platform,
    version,
    models,
    sdk,
    m,
    c,
  };
  const valueJson = JSON.stringify(value);
  console.log(valueJson);
  const aesValueJson = encryptAesEcbPkcs7(key, valueJson);
  return aesValueJson; // 生成请求体的值
}

function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // 月份是从0开始的
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  // 如果月份、天数等小于10，则在前面添加一个'0'
  month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  hours = (hours < 10 ? "0" : "") + hours;
  minutes = (minutes < 10 ? "0" : "") + minutes;
  seconds = (seconds < 10 ? "0" : "") + seconds;

  // 拼接成你想要的格式
  return (
    year +
    "年" +
    month +
    "月" +
    day +
    "日" +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
}

/**
 * 请求服务器数据
 */
function requestServerData() {
  const data = {
    t: formatDate(new Date()),
    value: createValue(),
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  axios
    .post(url, data, config)
    .then((response) => {
      //   console.log("Response:", response.data);
      if (
        response == null ||
        response.data == null ||
        response.data.data == null
      ) {
        console.error("Response data is null");
        return;
      }

      // 处理数据
      const data = response.data.data;
      //   console.log("Response Data:", data);
      processResult(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
 * 转成Base64
 * @param {*} str
 * @returns
 */
function toBase64(str) {
  return Buffer.from(str).toString("base64");
}

/**
 * 解码base64
 * @param {*} str
 * @returns
 */
function fromBase64(str) {
  return Buffer.from(str, "base64").toString();
}

/// 写入并追加文件
function write2File(text) {
  // const contentToAppend = '要追加的内容';  // 要追加的内容
  // 使用 `fs.appendFile()` 方法追加内容
  fs.appendFile(filePath, text, (err) => {
    if (err) {
      console.error("追加文件内容时发生错误:", err);
      return;
    }
    // console.log('内容已成功追加到文件:', filePath);
  });
}

/**
 * 处理服务器返回的加密的数据
 * @param {string} result
 */
function processResult(result) {
  const data = decryptAesEcbPkcs7(key, result);
  const dataObject = JSON.parse(data);
  const serverList = dataObject.goserverlist;
  if (serverList == null || !Array.isArray(serverList)) {
    console.error("serverlist is null");
    return;
  }
  //   {
  //     name: '日本高速 7[普通]',
  //     localPort: 1180,
  //     host: 'dccm.ix2.edge.kunlunae.com',
  //     remotePort: 50126,
  //     udphost: 'dccm.ix2.edge.kunlunae.com',
  //     udpport: 50126,
  //     password: 'mPQ5C9',
  //     protocol: 'auth_chain_a',
  //     protocol_param: '31812584:aiFpa9',
  //     obfs: 'tls1.2_ticket_auth',
  //     obfs_param: '',
  //     method: 'chacha20',
  //     url_group: '无描述',
  //     dns: '1.1.1.1:53',
  //     china_dns: '114.114.114.114:53,223.5.5.5:53',
  //     status: 1,
  //     country: 'JP',
  //     node_type_id: 1
  //   },

  const clashProxies = [];
  const clashProxyGroupNames = [];

  serverList.forEach((element) => {
    if (element.name.indexOf("VIP") != -1) {
      return;
    }
    // dccm.ix2.edge.kunlunae.com:30528:auth_chain_a:chacha20:tls1.2_ticket_auth:bVBRNUM5/?remarks=&protoparam=MzE4MDE0MDE6VTlyVGY5&obfsparam=
    const link =
      element.host +
      ":" +
      element.remotePort +
      ":" +
      element.protocol +
      ":" +
      element.method +
      ":" +
      element.obfs +
      ":" +
      toBase64(element.password) +
      "/?remarks=" +
      toBase64(element.name) +
      "&protoparam=" +
      toBase64(element.protocol_param) +
      "&obfsparam=";
    const ssr = "ssr://" + toBase64(link);

    const clashName = element.name.replaceAll("[", "_").replaceAll("]", "_");
    const clashSSR = `  - {name: ${clashName}, server: ${element.host}, port: ${element.remotePort}, type: ssr, cipher: ${element.method}, password: ${element.password}, protocol: ${element.protocol}, obfs: ${element.obfs}, protocol-param: ${element.protocol_param}}`;
    clashProxies.push(clashSSR);
    clashProxyGroupNames.push(clashName);
    write2File(ssr + "\n");
  });

  // 生成clash
  generateClashAddress(clashProxies, clashProxyGroupNames);
}

/**
 * 生成订阅地址
 * @param {string[]} clashProxies 订阅
 * @param {string[]} clashProxyGroupNames 订阅名称
 */
function generateClashAddress(clashProxies, clashProxyGroupNames) {
  const defaultYmlFilePath = `ccc2.yml`; // 默认配置文件
  const resultYmlFilePath = `tube.yml`; // 最终的配置文件
  let proxiesString = "";
  for (let index = 0; index < clashProxies.length; index++) {
    let item = clashProxies[index];
    proxiesString += item + "\n";
  }

  let groupNameString = "";
  for (let index = 0; index < clashProxyGroupNames.length; index++) {
    let item = clashProxyGroupNames[index];
    groupNameString += "      - " + item + "\n";
  }
  // console.log(proxiesString);

  // 读取默认配置文件
  fs.readFile(defaultYmlFilePath, "utf-8", (err, data) => {
    data = data.replaceAll("# 我的订阅", proxiesString);
    data = data.replaceAll("# 代理地址名称", groupNameString);
    fs.writeFile(resultYmlFilePath, data, (err) => {
      if (err) {
        console.error("写入文件失败:", err);
      } else {
        console.log("写入文件成功");
      }
    });
  });
}

/**
 * 清理历史文件
 */
function clearHistortFile() {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("历史文件删除成功");
  });
}

function main() {
  clearHistortFile();
  requestServerData();
}

main();
