const CryptoJS = require("crypto-js");
const axios = require('axios');

const key = "14487141bvirvvG"
const iv = "osxuinipoop111Pp";

// 创建一个 Date 对象，表示当前时间
var currentTime = new Date();

// 获取当前时间的时间戳（以毫秒为单位）
var timestamp = currentTime.getTime();

// 当前时间戳   
var timestampInSeconds = Math.floor(timestamp / 1000);
var time = CryptoJS.enc.Utf8.parse(timestampInSeconds);
var enc = CryptoJS.AES.encrypt(time, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
});

const url = 'https://api.gptplus.one/chat-process';
const data = JSON.stringify({
    "prompt": "将我说的前一个问题翻译成英文",
    // "prompt": "哈哈哈，你知道GPT3.5吗？",
    "options": {
        "parentMessageId": "chatcmpl-7c18bITmmYdirwzqiKZNtmakRv2Aw"
    },
    "systemMessage": "You are ChatGPT, the version is GPT3.5, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
    "temperature": 0.8,
    "top_p": 1,
    "secret": enc.toString()
});

const headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.79',
    'Content-Type': 'application/json',
};

// // 创建一个可写流，用于实时输出数据
// const writableStream = new stream.Writable({
//     write(chunk, encoding, callback) {
//         console.log(chunk.toString('utf-8')); // 将 chunk 转为 UTF-8 字符串并输出
//         callback();
//     },
// });

// 配置 Axios 接收二进制响应
// axios.defaults.responseType = 'arraybuffer';

let buffer = "";
axios.post(url, data, { headers, responseType: 'stream' }).then(response => {
    let stream = response.data;
    stream.on('data', (chunk) => {
        // try {
        // let json = chunk.toString('utf-8');
        // if (isJSON(json)) {
        //     // 输出 JSON 数据
        //     tempJson = json;
        // } else {
        //     tempJson += json;
        // }
        // process.stdout.write(JSON.parse(tempJson).delta);
        // tempJson = "";
        // console.log(chunk.toString());
        // } catch (error) {
        // }
        // console.log('-------------------------------------------------');

        buffer += chunk; // 将数据块添加到缓冲区

        while (buffer.includes('\n')) {
            const lineBreakIndex = buffer.indexOf('\n'); // 找到换行符的索引位置
            const completeLine = buffer.slice(0, lineBreakIndex); // 提取完整的一行数据
            buffer = buffer.slice(lineBreakIndex + 1); // 更新缓冲区，去除已处理的数据

            // console.log(`Received line: ${completeLine}`);
            // console.log('-------------------------------------------------');
            process.stdout.write(JSON.parse(completeLine).delta);
        }
    });

    stream.on('end', () => {
        // console.log('Stream finished');
    });
}).catch(error => {
    console.error('请求失败:', error);
});

// (async function () {
//     const response = await axios.post(url, data, { headers, responseType: 'stream' });
//     const stream = response.data
//     stream.on('data', data => {
//         data = data.toString()
//         console.log(data)
//     })
// })();

// console.log(enc.toString());

function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}