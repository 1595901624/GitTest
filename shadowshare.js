const axios = require('axios');
const CryptoJS = require('crypto-js');

async function fetchAndDecrypt() {
    try {
        const response = await axios.get('https://shadowshare.v2cross.com/servers/shadowshareserver');

        if (response.status !== 200) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        // AES base64 decrypt
        const data = response.data;

        const key = CryptoJS.enc.Utf8.parse('8YfiQ8wrkziZ5YFW');
        const iv = CryptoJS.enc.Utf8.parse('8YfiQ8wrkziZ5YFW');
        const decrypted = CryptoJS.AES.decrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        console.log(CryptoJS.enc.Utf8.stringify(decrypted));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

fetchAndDecrypt();