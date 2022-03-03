<template>
    <Frame :loading="loading">
        <div class="meeting_management">
            <div class="title">
                <h1>会议管理</h1>
                <div class="list_filter">
                    <div class="switch">
                        <el-radio-group v-model="show_info" size="small">
                            <el-radio-button label="mine">自己</el-radio-button>
                            <el-radio-button label="classroom" :disabled='!live_state'>教室</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="class_filter">
                        <el-cascader
                            size="small"
                            v-show="show_info == 'classroom'" 
                            placeholder="请选择班级"
                            v-model="class_filter"
                            :props="class_props"
                            @change="refresh"
                            clearable>
                        </el-cascader>
                    </div>
                    <div class="list_add">
                        <el-button size="small" type="primary" @click="addMeeting" v-show="!live_state" :disabled='live_disabled'>发起会议</el-button>
                        <el-button size="small" type="danger" @click="stopMeeting" v-show="live_state">停止会议</el-button>
                    </div>
                </div>
            </div>

            <div class="content">
                <div class="content_">
                    <div class="content_k">
                        <div class="meet_info">
                            <div class="meet_mine" 
                                v-show="show_info == 'mine'" 
                                :class="{ show_cursor: play_tool_show }" 
                                ref="meet_mine" 
                                @mouseenter="mouseenterL" 
                                @mouseleave="mouseleaveL" 
                                @mousemove="mousemoveL">
                                <video ref="mine_video"
                                    autoplay="autoplay"
                                    muted="muted"
                                    loop="loop">
                                    您的浏览器不支持 video 标签。
                                </video>
                                <div class="tool" 
                                    :class="{ show_tool: play_tool_show }" 
                                    @mouseenter="in_tool = true" 
                                    @mouseleave="in_tool = false" 
                                    @mousemove="in_tool = true">
                                    <div class="tool_l" :class="{'loading':mine_refresh_loading}">
                                        <i class="iconfont icon-shuaxin1"
                                            @click="mineRefresh"></i>
                                    </div>
                                    <div class="tool_r">
                                        <i class="iconfont icon-yinliang"></i>
                                        <i class="iconfont icon-shipin"></i>
                                        <i class="iconfont" 
                                            :class="is_full == 'meet_mine'? 'icon-suoxiao': 'icon-quanping'" 
                                            @click="fullScreen('meet_mine')">
                                        </i>
                                    </div>
                                </div>
                            </div>
                            <div class="meet_class" 
                                :class="{ show_cursor: play_tool_show }"
                                v-show="show_info == 'classroom'" 
                                ref="meet_class"
                                @mouseenter="mouseenterL" 
                                @mouseleave="mouseleaveL" 
                                @mousemove="mousemoveL">
                                <video src="https://v.moele.me/v/1304/9294669_a-01.webm"
                                    autoplay="autoplay"
                                    muted="muted"
                                    loop="loop">
                                    您的浏览器不支持 video 标签。
                                </video>
                                <div class="tool"
                                    :class="{ show_tool: play_tool_show }" 
                                    @mouseenter="in_tool = true" 
                                    @mouseleave="in_tool = false" 
                                    @mousemove="in_tool = true">
                                    <div class="tool_l">
                                        <i class="iconfont icon-shuaxin1"></i>
                                    </div>
                                    <div class="tool_r">
                                        <i class="iconfont icon-qiehuan"></i>
                                        <i class="iconfont" 
                                            :class="is_full == 'meet_class'? 'icon-suoxiao': 'icon-quanping'" 
                                            @click="fullScreen('meet_class')">
                                        </i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AddDialog ref="add_dialog" @meetAdd="meetAdd"></AddDialog>
    </Frame>
</template>

<script>
    import Frame from "@/components/frame.vue";
    import AddDialog from "./add_dialog";
    import { initFullScreen , initMedia , detectionCamera } from "@/components/tools.js";
    export default {
        name: "meeting_management",
        head: {
            title: "会议管理 - ",
        },
        data() {
            return {
                loading: false,
                show_info: "mine",

                class_filter:[],
                class_props:{
                    lazy : true,
                    lazyLoad : this.lazyLoad
                },

                live_state:false,


                camera_stream:null,
                live_disabled:false,

                mine_refresh_loading:false,
                camera:true,
                voice:true,

                // 全屏监听
                full_screen: {
                    judge: "webkitFullscreenElement",
                    open: "webkitRequestFullScreen",
                    close: "webkitCancelFullScreen",
                },
                is_full: null,
                play_tool_show: false,
                play_setTimeout: null,
                in_tool: false,
            };
        },
        computed: {},
        components: {
            Frame,
            AddDialog,
        },
        methods: {
            lazyLoad(node,resolve){//动态加载
                const { level } = node;
                if(level === 0){
                    this.getGradeData((data)=>{
                        resolve(data);
                    })
                }else if(level === 1){
                    this.getClassData(node,(data)=>{
                        resolve(data);
                    });
                }
            },
            getGradeData(cb){//获取年级信息
                this.$axios.post('/meeting/grade').then(res=>{
                    if(res.data.code && res.data.code != 0){
                        this.$message.error(res.data.msg);
                        cb && cb(null);
                    }else{
                        let info = [];
                        for(let l of res.data.obj){
                            info.push({
                                label:l,
                                value:l,
                                leaf:false
                            })
                        }
                        cb && cb(info);
                    }
                }).catch(err=>{
                    console.log(err)
                    if(!err || err.message !== null){
                        this.$message.error("获取年级数据失败");
                    }
                    cb && cb(null);
                });
            },
            getClassData(data,cb){//获取班级信息
                this.$axios.post('/meeting/class',{
                    grade_id :data.value
                }).then(res=>{
                    if(res.data.code && res.data.code != 0){
                        this.$message.error(res.data.msg);
                        cb && cb(null);
                    }else{
                        let info = [];
                        for(let l of res.data.obj){
                            info.push({
                                label:l.name,
                                value:l.id,
                                leaf:true
                            })
                        }
                        cb && cb(info);
                    }
                }).catch(err=>{
                    console.log(err)
                    if(!err || err.message !== null){
                        this.$message.error("获取数据失败");
                    }
                    cb && cb(null);
                });
            },

            
            addMeeting() {//发起会议
                this.$refs.add_dialog.open();
            },
            meetAdd(data){//会议发起后
                console.log(data);
                this.live_state = true;
            },
            stopMeeting(){//停止会议

            },
            









            //rtc
            showCamera(){//展示摄像
                let video = this.$refs.mine_video;
                if ("srcObject" in video) {
                    video.srcObject = this.camera_stream;
                } else {
                    video.src = window.URL.createObjectURL(this.camera_stream);
                }
                video.onloadedmetadata = function(e) {
                    video.play();
                };
            },
            mineRefresh(){//重新推流

            },
            refresh(){

            },

            //全屏
            mouseenterL(e) {//移入
                this.play_tool_show = true;
                this.play_setTimeout = setTimeout(() => {
                    this.play_tool_show = false;
                }, 3000);
            },
            mouseleaveL(e) {//移出
                this.play_setTimeout = setTimeout(() => {
                    this.play_tool_show = false;
                    clearTimeout(this.play_setTimeout);
                    this.play_setTimeout = null;
                }, 3000);
            },
            mousemoveL(e) {//移动
                this.play_tool_show = true;
                clearTimeout(this.play_setTimeout);
                if (!this.in_tool) {
                    this.play_setTimeout = setTimeout(() => {
                        this.play_tool_show = false;
                    }, 3000);
                }
            },
            fullScreen(data) {//打开全屏
                if (!document[this.full_screen.judge]) {
                    this.is_full = data;
                    if (Array.isArray(this.$refs[data])) {
                        this.$refs[data][0][this.full_screen.open]();
                    } else {
                        this.$refs[data][this.full_screen.open]();
                    }
                } else {
                    this.is_full = null;
                    document[this.full_screen.close]();
                }
            },
        },
        mounted() {
            initFullScreen(this);
            initMedia();
            // this.camera = new RTCPeerConnection({sdpSemantics:'unified-plan'});
            // this.screen = new RTCPeerConnection({sdpSemantics:'unified-plan'});
            detectionCamera((data)=>{
                if(data.type){
                    this.camera_stream = data.stream;
                    this.showCamera();
                    this.live_disabled = false;
                }else{
                    this.$message.error(this.lang[data.msg]);
                    this.live_disabled = true;
                }
            });

            window.onresize = () => {
                if (!document[this.full_screen.judge]) {
                    this.is_full = null;
                }
            };

            // this.getGradeData();
        },
    };
</script>

<style lang="scss" scoped="scoped">
    @keyframes loading_i {
        0%{
            transform: rotate(0deg);
        }
        50%{
            transform: rotate(180deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
    .meeting_management {
        height: 100%;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        .title {
            height: 42px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            border-bottom: solid 1px #e7e7e7;
            h1 {
                color: #333;
                font-size: 20px;
            }
            .list_filter {
                display: flex;
                .switch {
                    margin-right: 20px;
                }
                .class_filter {
                    width: 150px;
                    margin-right: 60px;
                }
            }
        }
        .content {
            height: calc(100% - 53px);
            width: 100%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            .content_ {
                width: 100%;
                max-width: calc(177.7778vh - 337.7778px);
                height: 100%;
                display: flex;
                align-items: center;
                .content_k {
                    width: 100%;
                    padding-top: 56.25%;
                    height: 0;
                    position: relative;
                    .meet_info {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                    }
                }
            }
            .meet_info {
                >div {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    overflow: hidden;
                    cursor: none;
                    >video{
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        background-color: #000;
                    }
                    .tool {
                        position: absolute;
                        width: 100%;
                        height: 40px;
                        background-color: #333;

                        bottom: -40px;
                        // bottom: 0;

                        left: 0;
                        transition: bottom 0.3s;
                        display: flex;
                        padding: 0 20px;
                        box-sizing: border-box;
                        justify-content: space-between;
                        >div {
                            i {
                                transition: color 0.2s;
                                color: #ccc;
                                line-height: 40px;
                                font-size: 22px;
                                cursor: pointer;
                                &:hover {
                                    color: #fff;
                                }
                            }
                        }
                        .loading{
                            transform-origin: center;
                            animation : loading_i 2s linear infinite;
                        }
                        .tool_r {
                            i {
                                margin-left: 20px;
                                &:nth-last-child(1) {
                                    margin-left: 40px;
                                }
                            }
                        }
                    }
                    .show_tool {
                        bottom: 0;
                    }
                }
                .show_cursor {
                    cursor: auto;
                }
                .meet_mine {
                    background-color: #999;
                }
                .meet_class {
                    background-color: #49f;
                }
            }
        }
    }
</style>