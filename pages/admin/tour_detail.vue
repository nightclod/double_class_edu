<template>
    <div class="tour_detail center" v-loading="loading">
        <div class="bgi">
            <img src="@/assets/img/tour_.jpg">
        </div>
        <div class="info">
            <div class="title">
               <u>杭州闲林中小学</u>
               <i>一年级</i>
               <b>五十四班</b>
            </div>
            <div class="video" ref="video" :style="'height:' + video_height + 'px;'">
                <div class="video1" ref="video1" :class="{'video_full' : is_full == 'video1'}">
                    <div class="mask center" v-show="video1_loading">
                        <i class="el-icon-loading"></i>
                    </div>
                    <video :class="{'show_cursor' : play_tool_show}" 
                        @loadeddata="video1_loading = true"
                        @canplay="video1_loading = false"
                        oncontextmenu="return false;"></video>
                    <div class="tool" 
                    :class="{'show_tool' : play_tool_show}" 
                    @mouseenter="in_tool = true"
                    @mouseleave="in_tool = false"
                    @mousemove="in_tool = true">
                       <i class="iconfont icon-shuaxin1" ></i>
                       <i class="iconfont" :class="is_full ? 'icon-suoxiao' : 'icon-quanping'" @click="fullScreen('video1')"></i>
                    </div>
                </div>
                <div class="video2" ref="video2" :class="{'video_full' : is_full == 'video2'}">
                    <div class="mask center" v-show="video2_loading">
                        <i class="el-icon-loading"></i>
                    </div>
                    <video :class="{'show_cursor' : play_tool_show}"
                        @loadeddata="video2_loading = true"
                        @canplay="video2_loading = false"
                        oncontextmenu="return false;"></video>
                    <div class="tool" :class="{'show_tool' : play_tool_show}"
                        @mouseenter="in_tool = true"
                        @mouseleave="in_tool = false"
                        @mousemove="in_tool = true">
                       <i class="iconfont icon-shuaxin1" ></i>
                       <i class="iconfont" :class="is_full ? 'icon-suoxiao' : 'icon-quanping'" @click="fullScreen('video2')"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'tour_detail',
    head:{
        title:'巡课详情 - '
    },
    data() {
        return {
            loading:false,
            video_height:499,
            video1_loading:false,
            video2_loading:false,
            //#region 全屏监听
            full_screen:{
                judge : "webkitFullscreenElement",
                open : "webkitRequestFullScreen",
                close: "webkitCancelFullScreen"
            },
            is_full: null,
            play_tool_show:false,
            play_setTimeout:null,
            in_tool:false,
            //#endregion
        }
    },
    computed:{
    },
    methods: {



        detectionHeight(){//监听高度
            this.video_height = Math.round(this.$refs.video.offsetWidth * 0.28125) + 30;
        },
        fullListenN(data){//监听非全屏
            if(data){
                this.removePlay(data);
                return
            }
            this.removePlay("video1");
            this.removePlay("video2");
        },
        fullListen(data){//监听全屏
            this.listenPlay(data);
        },
        listenPlay(data){//添加直播视频监听
            this.$refs[data].addEventListener('mouseenter',this.mouseenterL);
            this.$refs[data].addEventListener('mouseleave',this.mouseleaveL);
            this.$refs[data].addEventListener('mousemove',this.mousemoveL);
        },
        removePlay(data){//移除直播视频监听
            this.$refs[data].removeEventListener('mouseenter',this.mouseenterL);
            this.$refs[data].removeEventListener('mouseleave',this.mouseleaveL);
            this.$refs[data].removeEventListener('mousemove',this.mousemoveL);
        },
        mouseenterL(e){//移入
            this.play_tool_show = true;
            this.play_setTimeout = setTimeout(()=>{
                this.play_tool_show = false;
            },3000);
        },
        mouseleaveL(e){//移出
            this.play_tool_show = false;
            clearTimeout(this.play_setTimeout);
            this.play_setTimeout = null;
        },
        mousemoveL(e){//移动
            this.play_tool_show = true;
            clearTimeout(this.play_setTimeout);
            if(!this.in_tool){
                this.play_setTimeout = setTimeout(()=>{
                    this.play_tool_show = false;
                },3000)
            }
            
        },
        fullScreen(data){//打开全屏
            if(!document[this.full_screen.judge]){
                this.is_full = data;
                if(Array.isArray(this.$refs[data])){
                    this.$refs[data][0][this.full_screen.open]();
                    this.fullListen(data);
                }else{
                    this.$refs[data][this.full_screen.open]();
                    this.fullListen(data);
                }
            }else{
                this.is_full = null;
                document[this.full_screen.close]();
                this.fullListenN(data);
            }
        },
        initFullScreen(){//初始化全屏
            if(document.mozCancelFullScreen){
                this.full_screen.judge = "mozFullScreenElement";
                this.full_screen.open = "mozRequestFullScreen";
                this.full_screen.close = "mozCancelFullScreen";
                return
            }
            if(document.webkitCancelFullScreen){
                this.full_screen.judge = "webkitFullscreenElement";
                this.full_screen.open = "webkitRequestFullScreen";
                this.full_screen.close = "webkitCancelFullScreen";
                return
            }
            if(document.msCancelFullScreen){
                this.full_screen.judge = "msFullscreenElement";
                this.full_screen.open = "msRequestFullScreen";
                this.full_screen.close = "msCancelFullScreen";
                return
            }
            if(document.exitFullscreen){
                this.full_screen.judge = "fullscreenElement";
                this.full_screen.open = "requestFullscreen";
                this.full_screen.close = "exitFullscreen";
                return
            }
        },
       
        init(){//初始化
            this.initFullScreen();
            this.detectionHeight();
            window.onresize=()=>{
                if(!document[this.full_screen.judge]){
                    this.detectionHeight();
                    this.is_full = null;
                    this.fullListenN();
                }
            } 
        }
    },
    
    mounted(){
        this.init();
        
    }
}
</script>
<style lang="scss"  scoped="scoped">
.tour_detail{
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 600px;
    overflow: hidden;
    .bgi{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-color: #eee;
        filter: blur(8px);
        img{
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }
    .info{
        width: 90%;
        box-sizing: border-box;
        background-color: rgba(255,255,255,0.8);
        border-radius: 14px;
        box-shadow: 0 2px 10px -4px rgba(0,0,0,0.5);
        padding: 10px 30px 30px;
        .title{
            height: 60px;
            color: #13304e;
            font-size: 30px;
            line-height: 50px;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            u{
                display: block;
                max-width: calc(100% - 300px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 50px;
            }
            i{
                font-weight: 500;
                flex-shrink: 0;
                display: block;
                margin: 0 30px;
            }
            b{
                
                flex-shrink: 0;
                display: block;
            }
            
        }
        .video{
            display: flex;
            justify-content: space-between;
            transition: height 0.1s;
            >div{
                width: 50%;
                position: relative;
                .mask{
                    position: absolute;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    background-color: rgba(0,0,0,0.3);
                    i{
                        color: #fff;
                        font-size: 40px;
                    }
                }
                video{
                    display: block;
                    height: calc(100% - 30px);
                    width: 100%;
                    background-color: rgba(0,0,0,0.1);
                }
                .tool{
                    position: absolute;
                    z-index: 2;
                    bottom: 0px;
                    left: 0;
                    height: 30px;
                    width: 100%;
                    background-color: #333;
                    transition: all 0.3s;
                    display: flex;
                    justify-content: space-between;
                    box-sizing: border-box;
                    align-items: center;
                    padding: 0 20px;
                    i{
                        color: #fff;
                        font-size: 20px;
                        cursor: pointer;
                    }
                }
            }
            .video2{
                border-left: solid 1px rgba(255,255,255,0.8);
            }
			.video_full{
				border:none;
                video{
                    height: 100%;
                    cursor: none;
                }
                .show_cursor{
                    cursor: auto;
                }
                .tool{
                    bottom: -30px;
                }
                .show_tool{
                    bottom: 0px;
                }
            }
        }
    }

    
}
</style>