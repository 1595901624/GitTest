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

    const BUGLY_COOKIE = document.cookie;

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
        button.onclick = (button) => {
            // console.log('ID:', button.target.value);
            let issueId = button.target.value.replace("issue-", "");
            requestCrashInfo(issueId);
            // alert('ID:', button.id);
        };
        // 将按钮添加到元素中
        element.parentElement.parentElement.parentElement.appendChild(button);


        // 请求 crash 信息
        function requestCrashInfo(issueId) {
            let headers = {
                "Cookie": BUGLY_COOKIE,
                "Referer": "https://bugly.qq.com/v2/crash-reporting/crashes/300b413610/21023989/report?pid=1&crashDataType=undefined&rows=100&start=0"
            };

            axios.get('https://bugly.qq.com/v4/api/old/get-crash-list?start=0&searchType=detail&exceptionTypeList=Crash,Native,ExtensionCrash&pid=1&crashDataType=undefined&platformId=1&issueId=' + issueId + '&rows=100&appId=300b413610&fsn=1e7ade3a-00e9-4854-b8de-3ee050d4115f')
                .then(function (res) {
                    // 请求成功返回
                    console.log(res);
                })
                .catch(function (err) {
                    // 请求失败返回
                    console.log(err);
                })
                .then(function () {
                    // 不管成功失败都会执行，可以用来关闭加载效果等
                });
        }
    }


})();