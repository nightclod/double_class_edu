import axios from 'axios'
//#region 方法

export const numToChinese = number=>{//数字转化汉字（正整数）
    let units = '个十百千万@#%亿^&~',
        chars = '零一二三四五六七八九',
        a=(number+'').split(''),
        s=[];
    if(a.length>12){
        throw new Error('too big');
    }else{
        for(let i=0,j=a.length-1;i<=j;i++){
            if(j==1||j==5||j==9){//两位数 处理特殊的 1*
                if(i==0){
                    if(a[i]!='1')s.push(chars.charAt(a[i]));
                }else{
                    s.push(chars.charAt(a[i]));
                }
            }else{
                s.push(chars.charAt(a[i]));
            }
            if(i!=j){
                s.push(units.charAt(j-i));
            }
        }
    }
    return s.join('').replace(/零([十百千万亿@#%^&~])/g,function(m,d,b){//优先处理 零百 零千 等
        b=units.indexOf(d);
        if(b!=-1){
            if(d=='亿')return d;
            if(d=='万')return d;
            if(a[j-b]=='0')return '零'
        }
        return '';
    }).replace(/零+/g,'零').replace(/零([万亿])/g,function(m,b){// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
        return b;
    }).replace(/亿[万千百]/g,'亿').replace(/[零]$/,'').replace(/[@#%^&~]/g,function(m){
        return {'@':'十','#':'百','%':'千','^':'十','&':'百','~':'千'}[m];
    }).replace(/([亿万])([一-九])/g,function(m,d,b,c){
        c=units.indexOf(d);
        if(c!=-1){
            if(a[j-c]=='0')return d+'零'+b
        }
        return m;
    });
}

export const deepCopy = (obj)=>{//深拷贝
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]);   //递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

export const verifyToken = (cb)=>{//验证token失效
    let arr,reg=new RegExp("(^| )double_class=([^;]*)(;|$)");
    arr= window.document.cookie.match(reg);
    if(arr){
        let info = JSON.parse(decodeURIComponent(arr[2]))
        axios({
            method:'post',
            url:'/index/term',
            headers:{"Authorization":info.token}
        }).then(res=>{
            if(res.data.code == 0){
                cb && cb(true);
            }else{
                console.log(res.data.msg);
                cb && cb(false);
            }
        }).catch(err=>{
            console.log(err);
            cb && cb(false);
        })
    }else{
        cb && cb(false);
    }
}

export const initFullScreen = (data)=>{//初始化全屏
    if(document.mozCancelFullScreen){
        data.full_screen.judge = "mozFullScreenElement";
        data.full_screen.open = "mozRequestFullScreen";
        data.full_screen.close = "mozCancelFullScreen";
        return
    }
    if(document.webkitCancelFullScreen){
        data.full_screen.judge = "webkitFullscreenElement";
        data.full_screen.open = "webkitRequestFullScreen";
        data.full_screen.close = "webkitCancelFullScreen";
        return
    }
    if(document.msCancelFullScreen){
        data.full_screen.judge = "msFullscreenElement";
        data.full_screen.open = "msRequestFullScreen";
        data.full_screen.close = "msCancelFullScreen";
        return
    }
    if(document.exitFullscreen){
        data.full_screen.judge = "fullscreenElement";
        data.full_screen.open = "requestFullscreen";
        data.full_screen.close = "exitFullscreen";
        return
    }
}

export function initMedia(){//初始化摄像头属性
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
            let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }
}

export function detectionCamera(cb){//检测摄像头,获取数据流
    navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video:  { 
            width: { ideal: 1920 },
            height: { ideal: 1080 } 
        } 
    }).then((stream)=>{
        cb && cb({
            type:true,
            stream:stream
        });
    }).catch((err)=>{
        console.log(err)
        let msg;
        switch(err.name){
            case ("NotFoundError" || "DevicesNotFoundError") : 
                console.log("找不到设备"); msg = "NotFoundError"; break;
            case ("NotReadableError" || "TrackStartError") :
                console.log("无法读取设备"); msg = "NotReadableError"; break;
            case ("OverConstrainedError" || "ConstraintNotSatisfiedError") : 
                console.log("无法使用设备"); msg = "OverConstrainedError"; break;
            case ("NotAllowedError" || "PermissionDeniedError") : 
                console.log("拒绝使用设备"); msg = "NotAllowedError"; break;
            case "TypeError" :
                console.log("设备类型错误"); msg = "TypeError"; break;
            default : console.log("其他错误"); msg = "OtherError";
        }
        cb && cb({
            type:false,
            msg:msg
        })
    })
}

//#endregion




//#region 数据

//ur白名单
export const urlWhiteList = ["/login"];

//#endregion

export default {
    numToChinese,
    deepCopy,
    verifyToken,
    initFullScreen,
    urlWhiteList
}




