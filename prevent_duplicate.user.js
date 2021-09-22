// ==UserScript==
// @name         Prevent Duplicate(ebook)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  豆瓣图书页面中自动查找calibre中是否已存在相应图书。
// @author       Juntao Liu
// @match        https://book.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    var calibre_server = "http://127.0.0.1:9999"

    var title = getTitle();
    GM_xmlhttpRequest({
        "method":"GET",
        "url": `${calibre_server}/opds/search/${title}`,
        "onload":function(response) {
            if (response.status == 200) {
                addLibraryLink();
            }
        }
    });

    function getTitle() {
        var span = document.getElementsByTagName("h1")[0].children[0];
        return span.innerText;
    }

    Element.prototype.insertChildAtIndex = function(child, index) {
        if (!index) index = 0;
        if (index >= this.children.length) {
            this.appendChild(child);
        } else {
            this.insertBefore(child, this.children[index]);
        }
    };

    function addLibraryLink() {
        var div = document.getElementsByTagName("h1")[0];
        var a = document.createElement("a");
        a.href = `${calibre_server}/#library_id=Calibre_Library&panel=book_list&search=${title}`;
        a.target = "_blank";
        a.innerHTML = `<img src='${calibre_server}/favicon.png' height='25' width='25'>`;

        div.insertChildAtIndex(a, 1);    }
})();
