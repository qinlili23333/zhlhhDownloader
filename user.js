// ==UserScript==
// @name         连环画下载器
// @namespace    https://qinlili.bid/
// @version      0.1
// @description  自动打包下载
// @author       琴梨梨
// @match        http://wx.zhlhh.com/Reader/Index?*
// @match        http://zy.zhlhh.com/Downloader?*
// @grant        none
// @run-at        document-end
// ==/UserScript==

(function () {
    'use strict';

    var imgInfo;
    if (document.location.host == "wx.zhlhh.com") {
        $("#dibu").show();
        document.getElementById("xzing").lastElementChild.removeAttribute("href");
        document.getElementById("xzwc").lastElementChild.removeAttribute("href");
        document.getElementById("xzing").onclick = function () {
            window.open('http://zy.zhlhh.com/Downloader?title=' + document.title + "&json=" + btoa(JSON.stringify(gallery.items)), 'target', '');
        }
    }
    if (document.location.host == "zy.zhlhh.com") {
        document.querySelector("body").innerHTML="<H2>打包需要时间，请耐心等待</H2><H2>本页面仅用于CORS注入，分享网址没有用</H2>"
        var searchParams = new URLSearchParams(document.location.search);
        imgInfo = JSON.parse(atob(searchParams.get("json") ))
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js";
        document.body.appendChild(script);
        document.title="下载：" + searchParams.get("title");
        var zip;
        function makeZIP(){
            downloadBtn.innerText = "正在下载..."
            var i = 0;
            zip = new JSZip();
            function dlNext() {
                downloadBtn.innerText = "正在下载...已处理" + i + "页";
                fetch(imgInfo[i].src).then(res => res.blob().then(blob => {
                    zip.file((i + 1) + ".jpg", blob, { binary: true })
                    i = i + 1;
                    if (imgInfo[i]) { dlNext(); }else{
                        downloadBtn.innerText = "正在打包..."
                        dlZIP();
                    }
                }))
            }
            dlNext();
        }
        var downloadBtn = document.createElement("button");
        downloadBtn.innerText = "打包下载";
        downloadBtn.onclick = function () { makeZIP() }
        document.querySelector("body").appendChild(downloadBtn);
        function dlZIP(){
            zip.generateAsync({ type: "blob" }).then(function (blob) {
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(blob);
                var filename = searchParams.get("title")  + ".zip";
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
                downloadBtn.innerText="保存成功！";
            });
        }
    }
})();
