<template>
    <div class="home" :style="'display:' + (loading ? 'flex' : 'none') + ';'" >
        <div class="top">
            <div class="left">
                <h1 class="logo" @click="menuInit" :style="'width:' + menuw + 'px;'">
                    <div :class="menuw == 80 ? 'mini' : ''">
                        <img src="~/assets/img/c-large.svg">
                    </div>
                </h1>
                <div class="nemus">
                    <Menuunf 
                        :menuwidth="40" 
                        :color="'#888'" 
                        @menuclick="menuclick"></Menuunf>
                </div>
            </div>
            <div class="mineinfo">
                <el-popover
                    placement="bottom"
                    width="200"
                    trigger="click">
                    <div class="home-mineinfo">
                        <div @click="logout">退出登录</div>
                    </div>
                    <div class="head" slot="reference">
                        <i class="iconfont icon-shezhi"></i>
                    </div>
                </el-popover>
            </div>
        </div>
        <div class="content">
            <div class="menu_main">
                <Menus ref="menu" @refresh="refresh"></Menus>
            </div>
            <div class="main" ref="main" :style="'width:calc(100% - ' + menuw + 'px);padding-left:' + menuw + 'px;'">
                <NuxtChild v-if="show" ref="nuxtchild"/>
            </div>
        </div>
    </div>
</template>

<script>
import Menuunf from '@/components/MenuUnfold.vue'
import Menus from '@/components/Menus.vue'
import {verifyToken} from '@/components/tools.js'
export default {
    name:'home',
    data() {
        return {
            loading:false,
            show:true,
            meundata:[
                {
                    name:'数据中心',
                    route:'data_center',
                    icon:'icon-zhexiantu'
                },{
                    name:'巡课管理',
                    route:'tour_management',
                    icon:'icon-xunke'
                },
                // {
                //     name:'学校管理',
                //     route:'school_management',
                //     icon:'icon-XX_006'
                // },{
                //     name:'班级管理',
                //     route:'class_management',
                //     icon:'icon-banji'
                // },
                {
                    name:'会议管理',
                    route:'meeting_management',
                    icon:'icon-huiyiguanli'
                }
                // ,{
                //     name:'设备管理',
                //     route:'device_management',
                //     icon:'icon-shebei'
                // },{
                //     name:'答题器',
                //     route:'clicker',
                //     icon:'icon-datiqia'
                // }
            ],
            menuw:'240'
        }
    },
    computed:{
    },
    components:{
        Menuunf,
        Menus,
    },
    methods: {
        refresh(){//内容刷新
            this.show = false;
            this.$nextTick(()=>{
                this.show = true;
            })
        },
        menuInit(){//初始化菜单
            this.$refs.menu.init();
        },
        menuclick(data){//是否压缩菜单栏
            this.menuw = data ? '80' : '240';
            this.$refs.menu.setMenuIf(data);
            this.$refs.nuxtchild.widthChange && this.$refs.nuxtchild.widthChange(data);
        },
        setMeunData(){//菜单设置数据
            this.$refs.menu.setMeunData(this.meundata);
        },
        logout(){//退出登录
            this.$axios.post('/logout').then(res => {
                if (res.data.code == "0") {
                    this.$cookies.remove('double_class_edu',{
                        path:'/'
                    });
                    this.$router.push('/login');
                }else{
                    this.$message.error(res.data.msg);
                }
            }).catch(err => {
                console.log(err);
                this.$message.error('退出失败');
            });
        },
        init(){//初始化
            this.loading = true;
            this.setMeunData(); 
        }
    },
    beforeRouteEnter(to, from, next) {
        if(process.browser){
            verifyToken((type)=>{
                if(type){
                    next(vm=>{
                        vm.init();
                    });
                }else{
                    next(vm=>{
                        vm.$router.push('/login')
                    })
                }
            })
        }else{
            next();
        }
    },
    mounted() {
    },
}
</script>

<style lang="scss" scoped="scoped">
.home{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction:column;
    .top{
        height: 64px;
        display: flex;
        justify-content: space-between;
        border-bottom: solid 1px #e6ecf5;
        .left{
            width: 320px;
            display: flex;
            .logo{
                background-color: #192539;
                transition: width 0.4s;
                height: 65px;
                display: flex;
                justify-content:center;
                align-items:center;
                cursor: pointer;
                >div{
                    width: 160px;
                    height: 48px;
                    transition:all 0.4s;
                    img{
                        width: 160px;
                        object-fit: cover;
                    }
                }
                .mini{
                    width: 33px;
                    height: 48px;
                    overflow: hidden;
                    transform: scale(1.1);
                }
            }
            .nemus{
                width: 40px;
                height: 40px;
                margin-left: 20px;
                margin-top: 10px;
            }
        }
        .mineinfo{
            height: 63px;
            display: flex;
            .head{
                width: 85px;
                height: 64px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &>i{
                    font-size: 32px;
                    color: #888;
                }
                .headown{
                    position: absolute;
                    top: 20px;
                    right: 9px;
                    background: #0f9aee;
                    background-image: linear-gradient(45deg, rgb(26, 214, 253) 0%, rgb(50, 113, 239) 100%);
                    width: 22px;
                    height: 22px;
                    border-radius: 11px;
                    text-align: center;
                    i{
                        color: #fff;
                        line-height: 22px;
                        font-size: 14px;
                        font-weight: 800;
                    }
                }
            }
            .el-dialog__body{
                padding: 10px 20px;
            }
            .chang-password{
                font-size: 16px;
                .chang-password-item{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    .chang-password-name{
                        width: 100px;
                    }
                }
            }
        }
    }
    .content{
        height: calc(100% - 65px);
        position: relative;
        .menu_main{
            position: absolute;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 10;
            transition:all 0.4s;
            overflow: hidden;
        }
        .main{
            transition-property: width , padding;
            transition-duration:0.4s , 0.4s;
            height: 100%;
            width:calc(100% - 240px);
            padding-left:240px;
            .child_content{
                min-height: calc(100% - 40px);
                padding: 20px;
                background-color: #f3f3f3;
            }
        }
    }
    
}

// 弹出框样式
.home-mineinfo{
    font-size: 15px;
    color:#888da8;
    >div{
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        cursor: pointer;
        &:hover{
            color: #555;
        }
    }
    .change-head{
        input{
            display: none;
        }
    }
}

</style>
