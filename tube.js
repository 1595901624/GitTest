const CryptoJS = require("crypto-js");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

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
  serverList.forEach((element) => {
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
    console.log(ssr);
  });
}

// const x = decryptAesEcbPkcs7(
//   key,
//   "1EA7A759159338CDE7FD9320AD2B965BF66CE265BCFE93A581845285D3D2C39F0A39DAD03DFBD27B48356DDFD7DF13B09D08ED904A751308E760ECF83CA1AD99CC36C25F981AA0D19409B5C0B24AEA5A4B5CD5DC266E39EBBC30B5D2837C9B2A560D48565AB016E533B3B2FCC551D33E8A1DB983A0A32411B4FDFDD35CE88B8387B29B62766B5341158E8D780FCF6CE800E7153C61EE5CBAD781C5D16DC04795AB745BED9747B45CA50A1D76DE6498BD"
// );
// console.log(x);

// const y = encryptAesEcbPkcs7(
//   key,
//   '{"imei":"89752164-6bc1-99dd-9ac1-9f4e37ebb757","platform":"android","version_number":31,"models":"MI 6","sdk":"31","m":"C4B3BA4CD0367563327B7AEFD9B9B1BB","c":2}'
// );

requestServerData();
