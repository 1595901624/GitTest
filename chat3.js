/***********************************************************
 * 
 * 该算法来自 “智能助手” APP， 包名：com.ai.chat.bot.aichat
 * 
 ***********************************************************/

const axios = require('axios');
const CryptoJS = require("crypto-js");

// key:20190826
//iv:00514321
const DES_KEY = "20190826";
const DES_IV = "00514321";

const url = 'https://chatai.wecall.info/chat_new';
const data = JSON.stringify({
    "conversation": [
        // 历史对话
        {
            "answer": "你好！有什么我可以帮助你的吗？",
            "question": "你好"
        }
    ],
    // 当前对话
    "query": "你是谁啊？",
});

const headers = {
    'user-agent': 'okhttp/4.10.0',
    'Content-Type': 'application/json',
};

axios.post(url, data, { headers })
    .then(response => {
        // console.log('请求成功:', response.data);
        // console.log('请求成功:', response.data);
        let result = decryptDES(response.data, DES_KEY, DES_IV);
        // console.log('请求成功:', result);
        let answer = JSON.parse(result);
        console.log(answer.data.answer);
    })
    .catch(error => {
        console.error('请求失败:', error);
    });

// DES/CBC/PKC7 解密
function decryptDES(ciphertext, key, iv) {
    let keyHex = CryptoJS.enc.Utf8.parse(key);
    let ivHex = CryptoJS.enc.Utf8.parse(iv);
    let decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}