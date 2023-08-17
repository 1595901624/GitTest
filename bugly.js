// ==UserScript==
// @name         BuglyTool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bugly.qq.com/v2/crash-reporting/crashes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @run-at       document-end
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// ==/UserScript==

(function () {
    'use strict';
    // 正则表达式，匹配 issue- 后面跟着 N 位数字的内容
    const ISSUE_REGEX = /issue-\d+/;

    var currentPage = "";

    // 监听元素变化
    var observer = new MutationObserver(function (mutations) {

        // 查找所有 id 以 issue- 开头的元素
        var elements = document.querySelectorAll('[id^="issue-"]');
        // console.log('elements:', elements);
        if (elements.length > 1 && window.location.href != currentPage) {
            injectBuglyToolButton();
            currentPage = window.location.href;
            // observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 注入按钮
    function injectBuglyToolButton() {
        var buttons = document.querySelectorAll("#bugly-tool-button");
        buttons.forEach(function (element) {
            buttons.parentNode.removeChild(element);
        });

        var elements = document.querySelectorAll('[id^="issue-"]');
        // 遍历元素并打印满足条件的 id
        for (let i = 0; i < elements.length; i++) {
            if (ISSUE_REGEX.test(elements[i].id)) {
                console.log('ID:', elements[i].id);
                addButtonToUI(elements[i]);
            }
        }
    }

    // 添加按钮到 UI
    function addButtonToUI(element) {
        // 创建一个按钮
        var button = document.createElement("button");
        button.id = "bugly-tool-button";
        button.innerHTML = "BuglyTool";
        button.value = element.id;
        button.style = "margin-top: 10px;background-color: #4CAF50;color: white;padding: 5px 10px;border: none;border-radius: 4px;cursor: pointer;transition: background-color 0.3s;";
        button.onmouseover = () => {
            button.style.backgroundColor = "#45a049";
        };
        button.onmouseout = () => {
            button.style.backgroundColor = "#4CAF50";
        };
        button.onclick = async (button) => {
            // console.log('ID:', button.target.value);
            let issueId = button.target.value.replace("issue-", "");
            await requestCrashInfo(issueId);
            // alert('ID:', button.id);
        };
        // 将按钮添加到元素中
        element.parentElement.parentElement.parentElement.appendChild(button);

        // 请求 crash 信息
        async function requestCrashInfo(issueId) {
            // let start = 0;
            // let url = 'https://bugly.qq.com/v4/api/old/get-crash-list?start=' + start + '&searchType=detail&exceptionTypeList=Crash,Native,ExtensionCrash&pid=1&crashDataType=undefined&platformId=1&issueId=' + issueId + '&rows=100&appId=300b413610&fsn=1e7ade3a-00e9-4854-b8de-3ee050d4115f';

            // 请求 url
            let crashIds = await requestCrashInfoList(issueId);
            // console.log(crashIds);
            // 请求详细信息
            let csvArray = await requestCrashInfoDetail(crashIds);
            saveArrayOfObjectsAsCsv(csvArray, 'IssueId' + issueId + '-CrashListDetail.csv');
        }

        // 请求 url
        // 使用axios循环请求，直到请求到数据为空，则停止，否则继续请求，每次请求 100 条数据，start 递增 100
        async function requestCrashInfoList(issueId) {
            let start = 0;
            let url = 'https://bugly.qq.com/v4/api/old/get-crash-list?start=' + start + '&searchType=detail&exceptionTypeList=Crash,Native,ExtensionCrash&pid=1&crashDataType=undefined&platformId=1&issueId=' + issueId + '&rows=100&appId=300b413610&fsn=1e7ade3a-00e9-4854-b8de-3ee050d4115f';

            let crashIds = [];
            while (true) {
                try {
                    let res = await axios.get(url);
                    if (res.data.data.crashIdList.length == 0) {
                        break;
                    }
                    crashIds = crashIds.concat(res.data.data.crashIdList);
                    start += 100;
                    url = 'https://bugly.qq.com/v4/api/old/get-crash-list?start=' + start + '&searchType=detail&exceptionTypeList=Crash,Native,ExtensionCrash&pid=1&crashDataType=undefined&platformId=1&issueId=' + issueId + '&rows=100&appId=300b413610&fsn=1e7ade3a-00e9-4854-b8de-3ee050d4115f';

                } catch (error) {
                    console.log(error);
                    alert("请求出错，请检查网络连接！");
                    break;
                }
            }
            return crashIds;
        }

        /**
         * 请求详细的crash信息
         * @param {[]} crashIds 
         */
        async function requestCrashInfoDetail(crashIds) {
            let csvArray = [];
            for (let i = 0; i < crashIds.length; i++) {
                try {
                    let crashHash = crashIds[i];
                    let url = 'https://bugly.qq.com/v4/api/old/get-crash-detail?appId=300b413610&pid=1&crashHash=' + crashHash + '&fsn=fe8ffefd-6bd1-4ffb-a5fe-ae9b83f38c54'
                    let res = await axios.get(url);
                    console.log(res);
                    let crashMap = res.data.data.crashMap;
                    /* 
                     * 
                    "crashMap": {
                            "id": "71:09:35:EE:3F:24:6F:FD:4A:E9:43:B5:D4:5B:80:41",
                            "issueId": 75670166,
                            "productVersion": "6.10.0",
                            "model": "vivo Y85A",
                            "userId": "17877097218",
                            "expName": "java.util.ConcurrentModificationException",
                            "deviceId": "014bec5f15b8419d80bb661dbfd299b3",
                            "crashCount": 0,
                            "type": "100",
                            "processName": "com.cmri.universalapp",
                            "isRooted": "false",
                            "retraceStatus": 0,
                            "uploadTime": "2023-08-04 21:56:07",
                            "crashTime": "2023-08-04 21:56:04",
                            "mergeVersion": "11",
                            "messageVersion": "2",
                            "isSystemStack": 2,
                            "rqdUuid": "6750cf13-da06-4918-8b5a-6281fa8df1a6",
                            "appInBack": "true",
                            "cpuType": "arm64-v8a",
                            "subVersionIssueId": 75670165,
                            "crashId": 9644,
                            "bundleId": "com.cmri.universalapp",
                            "sdkVersion": "3.4.4",
                            "osVer": "Android 8.1.0,level 27",
                            "expAddr": "java.util.ArrayList$Itr.next(ArrayList.java:860)",
                            "threadName": "main(2)",
                            "detailDir": "2023-08-04/21/8/8fa3d876-81fb-4a25-8c34-4788d023cd6f",
                            "memSize": "3736985600",
                            "diskSize": "54925418496",
                            "cpuName": "msm8953",
                            "brand": "vivo",
                            "freeMem": "652496896",
                            "freeStorage": "1588244480",
                            "freeSdCard": "959098880",
                            "totalSD": "54296272896",
                            "channelId": "17",
                            "startTime": "1691157264562",
                            "callStack": "java.util.ArrayList$Itr.next(ArrayList.java:860)\ncom.cmri.universalapp.smarthome.control.cameranew.playback.view.CameraPlaybackFragment.selectAll(CameraPlaybackFragment.java:56)\ncom.cmri.universalapp.smarthome.control.cameranew.playback.view.CameraPlaybackFragment.onClick(CameraPlaybackFragment.java:452)\nandroid.view.View.performClick(View.java:6332)\nandroid.view.View$PerformClick.run(View.java:25000)\nandroid.os.Handler.handleCallback(Handler.java:790)\nandroid.os.Handler.dispatchMessage(Handler.java:99)\nandroid.os.Looper.loop(Looper.java:192)\nandroid.app.ActivityThread.main(ActivityThread.java:6846)\njava.lang.reflect.Method.invoke(Native Method)\ncom.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:549)\ncom.android.internal.os.ZygoteInit.main(ZygoteInit.java:826)\n",
                            "retraceCrashDetail": "java.util.ArrayList$Itr.next(ArrayList.java:860)\ncom.cmri.universalapp.smarthome.control.cameranew.playback.view.CameraPlaybackFragment.selectAll(CameraPlaybackFragment.java:56)\ncom.cmri.universalapp.smarthome.control.cameranew.playback.view.CameraPlaybackFragment.onClick(CameraPlaybackFragment.java:452)\nandroid.view.View.performClick(View.java:6332)\nandroid.view.View$PerformClick.run(View.java:25000)\nandroid.os.Handler.handleCallback(Handler.java:790)\nandroid.os.Handler.dispatchMessage(Handler.java:99)\nandroid.os.Looper.loop(Looper.java:192)\nandroid.app.ActivityThread.main(ActivityThread.java:6846)\njava.lang.reflect.Method.invoke(Native Method)\ncom.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:549)\ncom.android.internal.os.ZygoteInit.main(ZygoteInit.java:826)\n",
                            "buildNumber": "vivo",
                            "rom": "vivo%2FFUNTOUCH%2FFuntouch+OS_9",
                            "apn": "WIFI",
                            "appInAppstore": false,
                            "modelOriginalName": "vivo Y85A"
                        },
                     */
                    let csvObject = {
                        "crashHash": crashMap.id + " ",
                        "issueId": crashMap.issueId + " ",
                        "crashId": crashMap.crashId + " ",
                        "用户ID": crashMap.userId + " ",
                        "设备ID": crashMap.deviceId + " ",
                        "上报时间": crashMap.uploadTime + " ",
                        "发生时间": crashMap.crashTime + " ",
                        "应用包名": crashMap.bundleId + " ",
                        "应用版本": crashMap.productVersion + " ",
                        "设备机型": crashMap.model + " ",
                        "系统版本": crashMap.osVer + " ",
                        "ROM详情": crashMap.rom + " ",
                        "CPU架构": crashMap.cpuType + " ",
                        "是否越狱": crashMap.isRooted + " ",
                        "可用内存大小": crashMap.freeMem + " ",
                        "可用存储空间": crashMap.freeStorage + " ",
                        "可用SD卡大小": crashMap.freeSdCard + " ",
                    }
                    csvArray.push(csvObject);
                } catch (error) {
                    // 忽略错误，不导出本条数据
                    console.log(error);
                    break;
                }
            }
            return csvArray;
        }

        /**
         * 保存文本到本地
         * @param {string} textToSave 
         * @param {string} fileName 
         */
        function saveTextAsFile(textToSave, fileName) {
            var blob = new Blob([textToSave], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();

            URL.revokeObjectURL(url);
        }

        /**
         * 将对象数组保存为CSV文件
         * @param {[]} arrayToSave 
         * @param {文件名称} fileName 
         */
        function saveArrayOfObjectsAsCsv(arrayToSave, fileName) {
            // 获取所有对象的键，作为CSV的表头
            var csvHeader = Object.keys(arrayToSave[0]).join(',') + '\n';

            // 将每个对象的值转换为CSV的数据行
            var csvData = arrayToSave.map(function (obj) {
                return Object.values(obj).join(',');
            }).join('\n');

            // 合并表头和数据行创建完整的CSV内容
            var csvContent = csvHeader + csvData;

            var utf8BOM = "\uFEFF"; // UTF-8 BOM字符

            // 创建并下载CSV文件
            var blob = new Blob([utf8BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);

            var link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();

            URL.revokeObjectURL(url);
        }
    }


})();