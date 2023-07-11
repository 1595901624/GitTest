const crypto = require('crypto');
const Base64 = require('js-base64').Base64;
const axios = require('axios');

function encode(json) {
    const buffer = Buffer.from(json, 'utf-8');
    return Base64.encode(buffer, true);
}

function hmacSHA256(data, key) {
    try {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(data);
        const result = hmac.digest();
        return Base64.encode(result, true);
    } catch (error) {
        console.error(error);
        return null;
    }
}

function getToken(secret, token, exp) {
    const algoJson = encode('{"alg":"HS256","typ":"JWT"}');
    const json = `{"token":"${token}","exp":${exp}}`;
    const hmac = hmacSHA256(algoJson + '.' + encode(json), secret);
    return `${algoJson}.${encode(json)}.${hmac}`;
}

const secret = "vulcan@v4-chatgpt";
const token = "admin";
let timeExp = 5;

let calendar = new Date();
calendar.setMinutes(calendar.getMinutes() + timeExp);

let exp = Math.floor(calendar.getTime() / 1000);

const result = getToken(secret, token, exp);
const barear = `Bearer ${result}`;
// console.log(barear);


// 请求 gpt
const url = 'https://chatgpt.vulcanlabs.co/api/v3/chat'; // 替换为目标地址
const data = JSON.stringify({
    // "model": "gpt-3.5-turbo",
    "model": "gpt-4",
    "user": "7D96FAEA643F2QQA",
    "messages": [
        // {
        //     "role": "system",
        //     "content": "你是一个翻译官，请将我接下来的所有的话都从简体中文翻译为。"
        // },
        {
            "role": "user",
            "content": "你好，你是谁啊?你知道GPT3.5吗?你知道哈哈哈吗？"
        },
        // {
        //     role: 'assistant',
        //     content: '我是一个AI助手，没有具体的身份。我是由人工智能技术驱动的程序，旨在为用户提供帮助和答疑解惑。如有任何问题，都可以随时向我提问。'
        // },
        // {
        //     "role": "user",
        //     "content": "1+1=?"
        // },
        // {
        //     role: 'assistant', content: '1+1=2'
        // },
        // {
        //     "role": "user",
        //     "content": "用英语翻译我的上一个问题"
        // },
    ],
    "nsfw_check": true
});

const headers = {
    'user-agent': 'Chat GPT Android 2.8.4 292',
    'Authorization': barear,
    'Content-Type': 'application/json',
};

axios.post(url, data, { headers })
    .then(response => {
        // console.log('请求成功:', response.data);
        console.log('请求成功:', response.data.choices[0].Message);
    })
    .catch(error => {
        console.error('请求失败:', error);
    });