
import Hogan from 'hogan.js'


const conf = {
    serverHost: ''
}
const stConf = {
    status: 'status',
    successStatus: 0,
    interruptStatus: 10,
    failedStatus: 1
}

const _cmds = {

    //网络请求

    request: function(param){
        
        const _this = this    //this指向问题 重点注意 此处定义_this为了取到_cmds对象

        $.ajax({
            type: param.method || "get",
            url: param.url || "",
            data: param.data || "",
            dataType: param.type || "json",

            success: function (res) {

                /*判断是否请求成功 对请求数据进行封装*/

                //请求成功

                if(res[stConf.status] === stConf.successStatus){
                    typeof param.success === 'function' && param.success(res.data, res.msg)
                }

                //没有登录状态，需要强制登录

                else if(res[stConf.status] === stConf.interruptStatus){
                    _this.goHome()
                }

                //请求数据错误

                else if(res[stConf.status] === stConf.failedStatus){
                    typeof param.error === 'function' && param.error(res.msg)
                }
            },

            //请求失败 返回错误码

            error: function (err) {
                typeof param.error === 'function' && param.error(err.statusText)
            }
        })
    },

    //获取服务器地址

    getServerUrl: function(path){
        return conf.serverHost + path
    },

    //获取url参数 正则表达式要理解 为了获取(&)name=value(&)中的value

    getUrlParam: function(name){
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
        const result = window.location.search.substr(1).match(reg)
        return result ? decodeURIComponent(result[2]) : null
    },

    //渲染html模板 把传入的模板和数据进行拼接

    renderHtml: function(htmlTemplate,data){
        const template = Hogan.compile(htmlTemplate)
        const result = template.render(data)
        
        return result
    },

    successTips: function(msg){
        alert(msg || '操作成功')
    },

    errorTips: function(msg){
        alert(msg || '哪里不对了~')
    },

    //字段的验证 支持非空、手机、邮箱的判断

    validate: function(value,type){
        const val = $.trim(value)       //去掉前后空格
        //非空验证
        if(type === 'require'){
            return !!val
        }
        //手机号验证
        if(type === 'phone'){
            return /^1\d{10}$/.test(val)
        }
        //邮箱验证
        if(type === 'email'){
            return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(val)
        }
    },
    //返回首页
    goHome: function(){
        window.location.href = './index.html'
    }
}

export default _cmds