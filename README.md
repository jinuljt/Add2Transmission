# add2transmission

## 介绍

add2transmission 是一个 [Tampermonkey](https://www.tampermonkey.net/) 脚本。
作用是在magnet url超链接边上增加一个 [transmission](https://transmissionbt.com/) 按钮，一键将magnet url添加到 transmission 中。

### magnet url边上的 transmission按钮

![add2transmission button](/img/add2transmission_button.png?raw=true)

### 添加magnet url成功

![add2transmission success](/img/add2transmission_success.png?raw=true)


## 安装

打开 [add2transmission.user.js](add2transmission.user.js) 点击 `Raw` 按钮


## 配置

修改`transmission_rpc_url`成你自己的 transmission rpc 地址

## 支持的站点

该脚本遍历HTML DOM查找所有magnet url 的 a 标签。(`magnet:?` 开头的链接)。理论上可以支持所有站点。可以自行增加站点。

目前配置的站点如下：
```
// @match        https://btdig.com/*
// @match        https://1337x.to/*
// @match        https://www.torrentdownloads.me/*
// @match        https://thepiratebay.org/*
```
