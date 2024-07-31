# 朋友圈发圈素材小程序

本项目是纯前端项目，为了演示方便，小程序数据接口直接调用的 “api工厂” 前端Paas中台。

[《SDK文档说明》](https://www.yuque.com/apifm/doc)

有兴趣的朋友，可以试着把接口改成微信云开发的，或者自己开发下后端和接口。

强烈推荐使用 [“api工厂”](https://www.it120.cc/) ，实在是太方便了！

# 扫码体验

<img src="https://dcdn.it120.cc/2022/12/18/2f4b7292-248e-4cb4-8c48-0cea2b7c952a.jpeg" width="200px">

# 详细配置/使用教程

## 注册开通小程序账号

https://mp.weixin.qq.com/

注册小程序账号

获得你自己小程序的 appid 和 secret 信息，保存好，下面会用到

[《如何查看我的小程序的 APPID，在哪里看我的小程序的 APPID？》](https://jingyan.baidu.com/article/642c9d340305e3644a46f795.html)

你需要设置小程序的合法域名，否则开发工具上运行正常，手机访问的时候将看不到数据：

[《设置小程序合法服务器域名》](https://www.yuque.com/apifm/doc/tvpou9)

## 注册开通后台账号

*如果你自己开发接口和后端，请忽略这一步*

https://admin.it120.cc/

免费注册开通新后台后登录，登录后的首页，请记下你的专属域名，后面会用到

左侧菜单 “工厂设置” --> “数据克隆” --> “将别人的数据克隆给我”
对方商户ID填写 `70`
点击 “立即克隆”，克隆成功后，F5 刷新一下后台

## 配置小程序APPID/SECRET

左侧菜单，微信设置，填写配置上一步获得的 appid 和 secret

这一步很重要！！！
如果没有正确配置，下面步骤中打开小程序将无法连接你的后台

## 开发工具调试

- 开发工具导入代码的时候，appid **一定！一定！一定！** 要填你自己的小程序的
- 根目录的 `config.js` 文件，`subDomain` 和 `merchantId`  **一定！一定！一定！** 要填写正确

# 其他优秀开源模板推荐
- [天使童装](https://github.com/EastWorld/wechat-app-mall)   /  [码云镜像](https://gitee.com/javazj/wechat-app-mall)
- [天使童装（uni-app版本）](https://github.com/gooking/uni-app-mall)  /   [码云镜像](https://gitee.com/javazj/uni-app-mall)
- [简约精品商城（uni-app版本）](https://github.com/gooking/uni-app--mini-mall)  /   [码云镜像](https://gitee.com/javazj/uni-app--mini-mall)
- [舔果果小铺（升级版）](https://github.com/gooking/TianguoguoXiaopu)
- [面馆风格小程序](https://gitee.com/javazj/noodle_shop_procedures)
- [AI名片](https://github.com/gooking/visitingCard)  /   [码云镜像](https://gitee.com/javazj/visitingCard)
- [仿海底捞订座排队 (uni-app)](https://github.com/gooking/dingzuopaidui)  /   [码云镜像](https://gitee.com/javazj/dingzuopaidui)
- [H5版本商城/餐饮](https://github.com/gooking/vueMinishop)  /  [码云镜像](https://gitee.com/javazj/vueMinishop)
- [餐饮点餐](https://github.com/woniudiancang/bee)  / [码云镜像](https://gitee.com/woniudiancang/bee)
- [企业微展](https://github.com/gooking/qiyeweizan)  / [码云镜像](https://gitee.com/javazj/qiyeweizan)
- [无人棋牌室](https://github.com/gooking/wurenqipai)  / [码云镜像](https://gitee.com/javazj/wurenqipai)
- [酒店客房服务小程序](https://github.com/gooking/hotelRoomService)  / [码云镜像](https://gitee.com/javazj/hotelRoomService)
- [面包店风格小程序](https://github.com/gooking/bread)  / [码云镜像](https://gitee.com/javazj/bread)

## 联系作者

| 微信好友 | QQ好友 |
| :------: | :------: |
| <img src="https://dcdn.it120.cc/2021/09/13/61a80363-9085-4a10-9447-e276a3d40ab3.jpeg" width="200px"> | <img src="https://dcdn.it120.cc/2021/09/13/08a598d8-8186-4159-9930-2e4908accc5e.png" width="200px"> |

## 本项目使用了下面的组件，在此鸣谢

- [接口 SDK](https://github.com/gooking/apifm-wxapi)
- [api工厂](https://admin.it120.cc)
