import {urlWhiteList} from '@/components/tools.js'
export default function ({ $axios, redirect,app,route,store }) {
    const CancelToken = $axios.CancelToken;
    $axios.onRequest(config => {
        if(!urlWhiteList.includes(config.url)) {
            let info = app.$cookies.get('double_class_edu');
            if(info){
                config.headers['Authorization'] = info.token;
            }else{
                config.cancelToken = new CancelToken((c) => {
                    c(null);
                    redirect('/login');
                })
            }
        }
    });
    $axios.onResponse(response => {
        if(response.data.code == 401 && response.data.msg == "登录失效了"){
            app.$cookies.remove('double_class_edu');
            app.$cookies.set('double_class_info', "密码过期，请重新登录", {path:'/'});
            redirect('/login');
            return Promise.reject({message:null})
        }
    })
  }