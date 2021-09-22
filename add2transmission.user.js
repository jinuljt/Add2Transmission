// ==UserScript==
// @name         Add to Transmission
// @namespace    https://github.com/jinuljt/monkeys
// @version      0.1
// @description  search a tag and href startswith "magnet:?", add "Transmission" button to it
// @author       Juntao Liu
// @match        https://btdig.com/*
// @match        https://1337x.to/*
// @match        https://www.torrentdownloads.me/*
// @match        https://thepiratebay.org/*
// @iconURL      https://transmissionbt.com/favicon.ico
// @run-at document-end
// @grant GM_xmlhttpRequest
// ==/UserScript==

var transmission_rpc_url = "https://username:password@url.to.transmission/transmission/rpc";

(function() {
    'use strict';

    function addTorrent(button, magnetUrl, sessionId, tries) {
        //copy from https://greasyfork.org/en/scripts/28408-down2transmission
        if (!tries) {
            tries = 0;
        }
        if (tries === 3) {
            alert(
                "Add To Transmission: Too many Error 409: Conflict.\nCheck your transmission installation"
            );
            return;
        }
        console.log("Sending torrent with sessionid: (" + sessionId);
        GM_xmlhttpRequest({
            method: "POST",
            url: transmission_rpc_url,
            data: JSON.stringify({"method": "torrent-add", "arguments": {"filename": magnetUrl}}),
            headers: {
                "X-Transmission-Session-Id": sessionId,
            },
            onerror: function () {
                console.log("GM_xmlhttpRequest onerror. known issue:  chrome incognito mode.")
                alert("Can't Send GM_xmlhttpRequest");
            },
            onload: function (response) {
                console.log(
                    "Got response:\n" +
                    [response.status, response.statusText, response.responseText].join(
                        "\n"
                    )
                );
                switch (response.status) {
                    case 200: // status OK
                        var rpcResponse = response.responseText;
                        var rpcJSON = JSON.parse(rpcResponse);
                        if (rpcJSON.result.toLowerCase() === "success") {
                            if ("torrent-duplicate" in rpcJSON.arguments) {
                                button.title = "Already added: " + rpcJSON.arguments["torrent-duplicate"].name;
                            } else {
                                button.title = "Added: " + rpcJSON.arguments["torrent-added"].name;
                            }
                            button.onclick = null;
                            button.innerText = "🥳";
                        } else {
                            button.title = "ERROR: " + rpcJSON.result;
                            button.innerText = "😭";
                        }
                        break;
                    case 401:
                        alert("Your username/password is not correct.");
                        break;
                    case 409:
                        console.log("Setting sessionId");
                        var headers = response.responseHeaders.split("\n");
                        console.log(headers.join("; "));
                        for (var i in headers) {
                            var header = headers[i].split(":");
                            if (header[0].toLowerCase() == "x-transmission-session-id") {
                                sessionId = header[1].trim();
                                console.log("Got new Session ID: (" + sessionId);
                                addTorrent(
                                    button,
                                    magnetUrl,
                                    sessionId,
                                    tries + 1
                                );
                            }
                        }
                        break;
                    default:
                        alert("Unknown Transmission Response: " + response.status + " " + response.statusText);
                }
            },
        });
    }


    function Add2Transmission() {
        addTorrent(this, this.data.magnet, "", 0);
    }

    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.href.startsWith("magnet:?")){
            var button = document.createElement('button');
            button.innerHTML = "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACfElEQVR4AY2S6UtUYRjF32aA+uj3gP6DIBDLLRQcnck+pbPdmTERt2kcxw2Z3CYXEjHXGbeKgiAiYoAyJbeiQCBaJE1EkZAwIShMWgQbPT0H5KJ9Evjd5T3vOe/DuVcBUINK1Q4aDJsDBkOMkOBFy15xaSFIndm0d1AbMhi+DShVQK/iJaLU7heTCd/3+ZqZCa+3CBsb61hf/8wQXSNr6emQQ3/qAWGlYlF5HN3nsdEIr5jmP87hw8J7BugaeSTIoVsHJyiUkdbk/kfYDhuN26VimpwZJwxAWNapcY/sXZX3S3oAsdpzjgsnSF6+O67EW3QoICnbEkeNEHr0AIdmu2tz5O4KMWJ3WGP/B+TacqjpiOeFBB3jyUZZ+Nvd14VApR9Olx0uj1NMRZiYHsOzqadggNPtgCaUlfvQF+7hvt/iPcWAkyL8GhyOQFKxuLKA5U9L0DwucAricGtYWJ7H0uoiPJdd6I/0oaAwf1O8yQw4x5fe/m74AldAMzkdnwCZDKLjzNlEMIDrNcFqdHZ1wB/wbYnmYEBueUXZVnvHdbS1t8BfVYH4pBQkJKeCZpJ4Pg0MLC33oyfchebWEOobr+6IVsOAysZQ/U5TqAF37t1G9EkUCSmpMGdb9IAMixnpWVmYeTWDh9EHqA3WoKOznZ2MKLlEbnR3IlDlx9jkKDjm+NQYeKrpghlpGRmwahrezb8FtZezz8GCR24NsY9p5c7TJnr7e+DJd+HN3Gu9A56WlpmF6mAty9PXWTLLHr45xK+1wgmWOA4/IYWjUOIthpTO5x/K7rRuNoTq0NwWQqilCddaD9ByCNEbia7zh2LAfSlK/wuPinhi4p39B5PDOiNTkYtZAAAAAElFTkSuQmCC'/>"
            button.data = {magnet: link.href};
            //button.addEventListener ("click",Add2Transmission);
            button.title = "Add Magnet to Transmission";
            button.onclick = Add2Transmission;
            link.after(button);
        }
    }
})();
