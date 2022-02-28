<template>
    <div class="loginmain" :style="'display:' + (loading ? 'block' : 'none') + ';'">
        <div class="info">
            <div class="introduce">
                <b>WELCOME TO DOUBLE TEACHER</b>
                <h2>双师系统管理后台</h2>
                <p>优质教师资源最大化共享，激发学生学习的兴趣</p>
            </div>
            <div class="data">
                <div class="account input">
                    <el-input v-model="account" 
                        placeholder="请输入账号"
                        ref="account"
                        :maxlength="20"
                        :disabled='loginload'
                        @keyup.down.native="passFocus"
                        @keyup.enter.native="loginBut"></el-input>
                </div>
                <div class="password input">
                    <el-input v-model="password" 
                        placeholder="请输入密码" 
                        type="password"
                        ref="password"
                        :disabled='loginload'
                        :maxlength="30"
                        @keyup.up.native="accountFocus"
                        @keyup.enter.native="loginBut"></el-input>
                </div>
                <div class="login">
                    <div class="but" @click="loginBut">
                        <span>登录</span>
                        <i v-show="!loginload" class="el-icon-right"></i>
                        <i v-show="loginload" class="el-icon-loading"></i>
                    </div>
                </div>
            </div>
        </div>
        
       
        <div class="foot">
            <p><a href="http://beian.miit.gov.cn/">© copy 浙ICP备16032007-1号</a> | 杭州书山府科技有限公司 联系电话：0571-86131512</p>
        </div>
    </div>
</template>
<script>
import {verifyToken} from '@/components/tools.js'
export default {
    name:'login',
    head:{
        title:'登录 - '
    },
    data() {
        return {
            loading:false,
            account:'',
            password:'',
            loginload:false
        }
    },
    computed:{
    },
    methods: {
        passFocus(){//密码聚焦
            this.$refs.password.focus();
        },
        accountFocus(){//名字聚焦
            this.$refs.account.focus();
        },
        loginBut(){//登录按钮
            if(this.loginload){
                return
            }
            this.loginload = true;
            if(this.account.length == 0){
                this.$message.error('请输入账号');
                this.$refs.account.focus();
                this.loginload = false;
                return
            }
            if(this.password.length == 0){
                this.$message.error('请输入密码');
                this.$refs.password.focus();
                this.loginload = false;
                return
            }
            this.$axios({
                method:'post',
                url:'/login',
                data:{
                    username:this.account,
                    password:this.password
                }
            }).then((res)=>{
                this.loginload = false;
                if(res.data.code == 0){
                    let info = JSON.stringify({
                        account:this.account,
                        token:res.data.obj.api_token
                    })
                    this.$cookies.set('double_class', info, {
                        path:'/',
                        maxAge: 60 * 60 * 48
                    });
                    this.$router.push('/')
                }else{
                    this.$message.error(res.data.message);
                    this.$cookies.remove('double_class',{
                        path:'/'
                    });
                }
            }).catch(err=>{
                this.loginload = false;
                console.log(err);
                this.$message.error('登录失败');
            })
        },
        init(){//初始化
            this.loading = true;
            let info = this.$cookies.get('double_class_info');
            if(info){
                this.$message.error(info);
                this.$cookies.remove('double_class_info',{path:'/'});
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        if(process.browser){
            verifyToken((type)=>{
                if(type){
                    next(vm=>{
                        vm.$router.push('/');
                    });
                }else{
                    next(vm=>{
                        vm.init();
                    })
                }
            })
        }else{
            next();
        }
    },
    mounted(){
    }
}
</script>
<style lang="scss"  scoped="scoped">
    .loginmain{
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 560px;
        min-width: 600px;
        background-image: url('~assets/img/login_bgi.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 0 center;
        overflow: hidden;
        .info{
            box-sizing: border-box;
            height: 100%;
            padding-left: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #ccc;
            font-weight: 400;
            .introduce{
                white-space:nowrap;
                width: 500px;
                b{
                    font-size: 22px;
                    line-height: 26px;
                    letter-spacing:2px;
                }
                h2{
                    font-weight: 500;
                    color: #fbfbfb;
                    margin-top: 16px;
                    letter-spacing:4px;
                    font-size: 40px;
                    line-height: 60px;
                }
                p{
                    margin-top: 20px;
                    font-size: 20px;
                    line-height: 20px;
                    letter-spacing:1px;
                }
            }
            .data{
                margin-top: 120px;
                width: 400px;
                .input{
                    height: 70px;
                    width: 400px;
                    ::-webkit-input-placeholder {
                        color: #999;
                    }
                    :-moz-placeholder {/* Firefox 18- */
                        color: #999;
                    }
                    ::-moz-placeholder{/* Firefox 19+ */
                        color: #999;
                    }
                    :-ms-input-placeholder {
                        color: #999;
                    }
                    .el-input{
                        height: 60px;
                        ::v-deep input{
                            height: 60px;
                            border-radius: 30px;
                            background-color: transparent;
                            font-size: 18px;
                            text-align: center;
                            color: #fff;
                            border-width: 2px;
                            letter-spacing: 1px;
                            border-color: #999;
                            font-weight: 500;
                            font-family:'Noto Sans SC';
                            &:focus{
                               border-color: #fff; 
                            }
                        }
                    }
                }
                .password{
                    margin-top: 20px;
                }
                .login{
                    width: 100%;
                    height: 40px;
                    margin-top: 30px;
                    .but{
                        width: 160px;
                        padding-left: 16px;
                        height: 40px;
                        line-height: 40px;
                        margin: 0 auto;
                        text-align: center;
                        border-radius: 20px;
                        color: #fff;
                        font-size: 18px;
                        letter-spacing: 2px;
                        background-image: linear-gradient(76deg, #0073FF 0%, #31D2FC 100%);
                        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10), 0 2px 4px 0 rgba(0,115,255,0.39);
                        cursor: pointer;
                    }
                }
            }
        }
        .foot{
            position: absolute;
            width: 600px;
            text-align: right;
            bottom: 20px;
            right: 0;
            font-size: 12px;
            padding: 0 40px;
            box-sizing: border-box;
            height: 24px;
            color:#777;
            line-height: 24px;
            white-space:nowrap;
            a{
                color:#777;
                display: inline;
            }
        }
    }
</style>