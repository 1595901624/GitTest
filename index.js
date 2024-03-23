const request = require('request-promise');
const { v4: uuidv4 } = require('uuid')
const CryptoJS = require("crypto-js")
const Crypto = require("crypto")
const fs = require('fs');
const { format } = require('date-fns');


const currentDate = new Date();
const filePath = `temp.dql`;  // 根据今天的日期生成文件路径

const defaultYmlFilePath = `ccc2.yml`;  // 默认配置文件
const resultYmlFilePath = `result.yml`;  // 最终的配置文件

const VMESS_URL = fromBase64("aHR0cHM6Ly93d3cueHR4NmYueHl6OjIwMDAwL2FwaS9ldm1lc3M=");
const IP_URL = "https://ip.useragentinfo.com/jsonp?ip=";

// const area = [999, 2, 34, 48, 49, 17, 7, 46, 4, 3, 33,
//     36, 9, 7, 25, 5, 11, 8, 32, 38, 39, 6, 4, 10, 12, 13,
//     15, 19, 20, 21, 22, 23, 30, 31, 35, 36, 37, 40, 41, 42, 43, 44];


(async function () {
    clearHistortFile();

    await queryVmessUrl();

    convert2ClashYml();

    // console.log("***************抓取完成***************");
    // 转换为 clash
})()

/**
 * 清理历史文件
 */
function clearHistortFile() {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err)
            return
        }
        console.log("历史文件删除成功");
    });
}

/**
 * 查询vmess
 */
async function queryVmessUrl() {
    for (let i = 1; i < 51; i++) {
        let option = {
            method: 'GET',
            // uri: getCommonParams(VMESS_URL, area[index]),
            uri: getCommonParams(VMESS_URL, i),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Mobile Safari/537.36'
            },
            strictSSL: false
        }
        let result = await request.get(option)
        try {
            result = aesDecrypt(result.trim()).trim()
            result = await addAddress(result)
            // console.log(result)
            write2File(result + "\n");
        } catch (e) {

        }
        sleep(17000)
    }
}

/**
 * 转换为订阅链接
 */
async function convert2ClashYml() {
    // 使用 `fs.readFile()` 方法读取文件内容
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('读取文件内容时发生错误:', err);
            return;
        }
        // console.log('文件内容:', data);
        // 处理数据
        let vmessLinks = data.trim().split("\n");
        // console.log(vmessLinks.length);
        let clashProxies = [];
        let clashProxyGroupNames = [];
        for (let index = 0; index < vmessLinks.length; index++) {
            let item = vmessLinks[index];
            let config = parseVmessLink(item)
            let groupName = config.ps + index;
            let proxy = "";
            if (config.net == "ws") {
                proxy = vmessToWSFormattedString(config, index)
            } else if (config.net == "tcp") {
                proxy = vmessToTCPFormattedString(config, index)
            }
            // console.log(config)
            // let proxy = {
            //     name: config.ps,
            //     type: 'vmess',
            //     server: config.add,
            //     port: config.port,
            //     uuid: config.aid,
            //     alterId: config.id,
            //     cipher: 'auto',
            //     network: config.net,
            //     tls: true,
            //     'ws-path': config.path,
            //     tls13: true,
            //     'skip-cert-verify': false,
            //     'client-fingerprint': "chrome",
            //     tfo: false,
            //     'ws-opts': {
            //         path: config.path,
            //         headers: {
            //             Host: config.host
            //         }
            //     },
            // };
            
            clashProxyGroupNames.push(groupName);
            clashProxies.push(proxy);
        }

        let proxiesString = "";
        for (let index = 0; index < clashProxies.length; index++) {
            let item = clashProxies[index];
            proxiesString += item;
        }
        
        let groupNameString = "";
        for (let index = 0; index < clashProxyGroupNames.length; index++) {
            let item = clashProxyGroupNames[index];
            groupNameString += "      - " + item + "\n";
        }
        // console.log(proxiesString);

        // 读取默认配置文件
        fs.readFile(defaultYmlFilePath, 'utf-8', (err, data) => {
            data = data.replaceAll("# 我的订阅", proxiesString);
            data = data.replaceAll("# 代理地址名称", groupNameString);
            fs.writeFile(resultYmlFilePath, data, (err) => {
                if (err) {
                    console.error('写入文件失败:', err);
                } else {
                    console.log('写入文件成功');
                }
            });
        });

    });

}

function vmessToWSFormattedString(vmessObj, index) {
    // 构建格式化的字符串
    // - {name: "", server: 89.163.152.84, port: 443, client-fingerprint: chrome, type: vmess, uuid: 418048af-a293-4b99-9b0c-98ca3580dd24, alterId: 64, cipher: auto, tls: true, tfo: false, skip-cert-verify: false, network: ws, ws-opts: {path: /path/120121122706, headers: {Host: www.45027699.xyz}}}
    const formattedString = `  - {name: ${vmessObj.ps}${index}, server: ${vmessObj.add}, port: ${vmessObj.port}, client-fingerprint: chrome, type: vmess, uuid: ${vmessObj.id}, alterId: ${vmessObj.aid}, cipher: auto, tls: ${vmessObj.tls}, tfo: false, skip-cert-verify: false, network: ${vmessObj.net}, ws-opts: {path: ${vmessObj.path}, headers: {Host: ${vmessObj.host}}}}\n`;
    // 返回格式化的字符串
    return formattedString;
}

function vmessToTCPFormattedString(vmessObj, index) {
    // 构建格式化的字符串
    // - {name: "", server: 89.163.152.84, port: 443, client-fingerprint: chrome, type: vmess, uuid: 418048af-a293-4b99-9b0c-98ca3580dd24, alterId: 64, cipher: auto, tls: true, tfo: false, skip-cert-verify: false}
    const formattedString = `  - {name: ${vmessObj.ps}${index}, server: ${vmessObj.add}, port: ${vmessObj.port}, client-fingerprint: chrome, type: vmess, uuid: ${vmessObj.id}, alterId: ${vmessObj.aid}, cipher: auto, tls: ${vmessObj.tls}, tfo: false, skip-cert-verify: false}\n`;
    // 返回格式化的字符串
    return formattedString;
  }

/// 解析地址
function parseVmessLink(link) {
    // 解析链接中的详细信息
    const decodedLink = fromBase64(link.replace("vmess://", ""));
    // console.log(decodedLink.trim());
    const details = JSON.parse(decodedLink);

    // 构建 vmess 对象
    const vmess = {
        v: "2",
        ps: details.ps,
        add: details.add,
        port: details.port,
        id: details.id,
        aid: details.aid,
        net: details.net,
        type: details.type,
        host: details.host,
        path: details.path,
        tls: details.tls === "tls",
        sni: details.sni,
        ws: details.net === "ws",
        riff: details.net === "h2",
        "ws-path": details.path,
        "ws-headers": {
            Host: details.host
        }
    };

    // 返回 vmess 对象
    return vmess;
}

/**
 * 获取VMESS
 * @param {*} url 
 * @param {*} area 地区编号
 * @returns 
 */
function getCommonParams(url, area) {
    // let sign = "B89F08DFD5A44402B2E8165C82623A444AA15139";
    let sign = "954d976c3c9fd5e5c63dab4016cc12da";
    let deviceId = uuidv4().replace(/-/g, "");
    let apps = md5(sign + deviceId);
    let time = new Date().getTime();
    let result = url + "&vip=false&proto=4&platform=android&ver=8.3.18542&deviceid=" + deviceId + "&unicode=" + deviceId + "&t="
        + time
        + "&code=Q5N0UKR&recomm_code=&f=2023-09-12&install=2023-09-12&token=&package=com.network.xf18642&width=411.42856&height=774.8571&apps="
        + apps;
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

/**
 * 转成Base64
 * @param {*} str 
 * @returns 
 */
function toBase64(str) {
    return Buffer.from(str).toString('base64')
}

/**
 * 解码base64
 * @param {*} str 
 * @returns 
 */
function fromBase64(str) {
    return Buffer.from(str, 'base64').toString()
}

/**
 * 为协议添加地址
 * @param {*} data 
 * @returns 
 */
async function addAddress(data) {
    if (data.indexOf('vmess://') != -1) {
        // vmess协议
        data = data.replace(/vmess\:\/\//, "")
        data = fromBase64(data)
        let protocol = JSON.parse(data)
        let ip = protocol.add
        let option = {
            uri: IP_URL + ip,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Mobile Safari/537.36'
            }
        }
        let ipResult = await request(option)
        ipResult = ipResult.replace("callback(", "").replace(");", "")
        let ipObject = JSON.parse(ipResult)
        let area = ipObject.country + ipObject.province
        protocol.ps = area
        // console.log(toBase64(JSON.stringify(protocol)))
        return "vmess://" + toBase64(JSON.stringify(protocol))
    }
    return ""
}

/// 写入并追加文件
function write2File(text) {
    // const contentToAppend = '要追加的内容';  // 要追加的内容

    // 使用 `fs.appendFile()` 方法追加内容
    fs.appendFile(filePath, text, (err) => {
        if (err) {
            console.error('追加文件内容时发生错误:', err);
            return;
        }
        // console.log('内容已成功追加到文件:', filePath);
    });
}

/**
 * 转换成字符串 无引号
 * @param {} json 
 * @returns 
 */
function jsonToString(json) {
    // 将 JSON 对象转换为字符串
    const jsonString = JSON.stringify(json);

    // 去除字符串中的引号
    const jsonStringWithoutQuotes = jsonString.replace(/"/g, "");

    // 返回处理后的字符串
    return jsonStringWithoutQuotes;
}


