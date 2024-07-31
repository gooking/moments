let app = getApp()

function request(url, data) {
    return new Promise((resolve, reject) => {
        wx.request({
            url:'https://pyq.yidianan.cn/wx/' + url,
            data: data,
            success(res) {
                if (res.data.code == 0) {
                    if(res.data.data.config){
                        app.data.config = res.data.data.config
                    }
                    resolve(res.data.data)
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                    reject(res.data.code)
                }
            },
            fail(err) {
                console.log('请求失败:',err)
                wx.showToast({
                    title: '网络错误，请求失败',
                    icon: 'none'
                })
            }
        })
    })
}

function get(url, data = {}) {
    return new Promise((resolve, reject) => {
        let that = this;
        if (!app.globalData.openid) {
            data.openid = 'oCZkh0c92TsNGo8dMJMwEcNBSigo'; // 写死测试
            that.request(url, data).then((res) => {
                resolve(res)
            }, err => reject())
        } else {
            that.login().then(next => {
                data.openid = app.data.openid;
                that.request(url, data).then((res) => {
                    resolve(res)
                }, err => reject())
            })
        }
    })
}


function login() {
    let that = this
    return new Promise((resolve, reject) => {
        wx.login({
            success: res => {
                if (res.code) {
                    console.log('服务器获取openid')
                    that.request('login', {
                        code: res.code
                    }).then(
                        login_res => {
                            wx.setStorage({
                                key: "openid",
                                data: login_res.openid
                            });
                            app.data.openid = login_res.openid;
                            resolve(login_res.openid)
                        }, err => {
                            reject()
                        }
                    )
                }
            }
        })
    })

}

function showtoast(title) {
    wx.showToast({
        title: title,
        icon: 'none'
    })
}


module.exports = {
    get,
    request,
    showtoast,
    login
}