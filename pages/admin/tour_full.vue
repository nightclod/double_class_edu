<template>
    <div class="tour_full" v-loading="loading" ref="tour_full"
        @mouseenter="mouseenterL"
        @mouseleave="mouseleaveL"
        @mousemove="mousemoveL">
        <overlay-scrollbars 
            class="scroll_list" 
            :options='{className:"os-theme-thin-dark"}'
            :class="{'show_cursor':tool_show}">
            <ul class="list">
                <li v-for="(l,i) in data" :key="i"
                :class="{'hind_top' : i < wide , 'hind_left' : (i % wide == 0)}"
                :style="'width:calc(100vw / ' + wide + ');height:calc(100vw / ' + wide + ' / ' + aspect_list[aspect].num + ');min-height:' + (1000 / wide / aspect_list[aspect].num) + 'px;min-width:' + (1000 / wide) + 'px;'">
                    <div class="li_title">
                        <div class="li_school">杭州闲林镇中心小学</div>
                        <div class="li_info">
                            <i>六年级五班</i>
                            <b>数学</b>
                        </div>
                    </div>
                    <video src=""></video>
                    <div class="li_tool" v-show="tool_show">
                        <div class="li_refresh li_icon" >
                            <i class="iconfont icon-shuaxin"></i>
                        </div>
                        <div class="li_reversal li_icon" >
                            <i class="iconfont icon-qiehuan"></i>
                        </div>
                    </div>
                    
                </li>
            </ul>
        </overlay-scrollbars>
        <div class="tool" 
            :class="{'tool_open':tool_show && tool_open,'tool_show':tool_show,'tool_opacity':in_tool,'tool_light':tool_l}"
            @mouseenter="in_tool = true"
            @mouseleave="in_tool = false"
            @mousemove="in_tool = true">
            <div class="open_i" :class="{'reversal': tool_open}" @click="openTool">
                <i class="iconfont icon-xiangyou2"></i>
            </div>
            <div class="interval"></div>
            <div class="pagination">
                <div class="prev pagebut" @click="prevPage">
                    <i class="iconfont icon-shangyiye"></i>
                </div>
                <div class="page_num">
                    <i>{{ page }}</i>
                    <b>/</b>
                    <u>{{ total }}</u>
                </div>
                <div class="next pagebut" @click="nextPage">
                    <i class="iconfont icon-shangyiye"></i>
                </div>
            </div>
			<div class="select resolution">
				<el-popover
				placement="top"
				popper-class="select_popover"
				:disabled="!show_popover || loading"
				width="80"
				@show="popoverShow"
				@hide="popoverHide"
				trigger="hover">
					<div class="select_list">
						<div class="select_title">分辨率</div>
						<ul>
							<li v-for="(l,i) in resolution_list" 
                            :key="i"
                            @click="activeResolution(i)"
                            :class="{'active' : resolution == i}">{{ l }}p</li>
						</ul>
					</div>
					<div slot="reference" class="select_i">
						<i>{{ resolution_list[resolution] }}p</i>
					</div>
				</el-popover>
			</div>
			<div class="select aspect_ratio">
				<el-popover
				placement="top"
				popper-class="select_popover"
				:disabled="!show_popover || loading"
				width="80"
				@show="popoverShow"
				@hide="popoverHide"
				trigger="hover">
					<div class="select_list">
						<div class="select_title">纵横比</div>
						<ul>
                            <li v-for="(l,i) in aspect_list" 
                            :key="i"
                            @click="activeAspect(i)"
                            :class="{'active' : aspect == i}">{{ l.data }}</li>
						</ul>
					</div>
					<div slot="reference" class="select_i">
						<i>{{ aspect_list[aspect].data }}</i>
					</div>
				</el-popover>
			</div>
			<div class="select layout_">
				<el-popover
				placement="top"
				popper-class="select_popover"
				:disabled="!show_popover || loading"
				width="120"
				@show="popoverShow"
				@hide="popoverHide"
				trigger="hover">
					<div class="select_list">
						<div class="select_title">布局</div>
						<div class="layout_info">
							<div class="layout_list">
								<div class="name_i">宽 ：</div>
								<div class="num_i">
									<el-input-number
                                    @change='getDataNext' 
                                    :min="1"
                                    :max="10"
                                    :step-strictly="true"
                                    size="mini" 
                                    v-model="wide"></el-input-number>
								</div>
							</div>
							<div class="layout_list">
								<div class="name_i">高 ：</div>
								<div class="num_i">
									<el-input-number 
                                    @change='getDataNext' 
                                    :min="1"
                                    :max="10"
                                    :step-strictly="true"
                                    size="mini" 
                                    v-model="high"></el-input-number>
								</div>
							</div>
							
						</div>
					</div>
					<div slot="reference" class="select_i">
						<i>{{ wide }}×{{ high }}</i>
					</div>
				</el-popover>
			</div>
			<div class="full_screen">
				<i class="iconfont" :class="is_full ? 'icon-suoxiao' : 'icon-quanping'" @click="fullScreen()"></i>
			</div>
        </div>
    </div>
</template>
<script>
export default {
    name:'tour_full',
    head:{
        title:'巡课大屏 - '
    },
    data() {
        return {
            //#region 数据
            resolution_list:[1080,720,360,240],
            resolution:0,
            aspect_list:[{data:'16 : 9',num: 16/9},{data:'4 : 3',num: 4/3}],
            aspect:0,
			wide:3,
			high:3,
            page:1,
            total:10,
            data:[],
            //#endregion

            //#region 状态
            loading:false,
            full_screen:{
                judge : "webkitFullscreenElement",
                open : "webkitRequestFullScreen",
                close: "webkitCancelFullScreen"
            },
            is_full: false,
            tool_open:true,
            tool_show:false,
            tool_setTimeout:null,
            in_tool:false,
            tool_l:0,
			show_popover:true,
			show_popover_setTimeout:null,
            //#endregion
        }
    },
    watch:{
    },
    computed:{
    },
    methods: {
        getDataNext(){//延迟获取数据
            this.$nextTick(()=>{
                this.getData();
            });
        },
        getData(){//获取数据
            let num = this.wide * this.high;
            this.data = [];
            for(let i = 0; i < num; i ++){
                this.data.push({
                    id:i,
                    url:"",
                    url_:'',
                    show_last:true,
                    judge:'英语',
                    grade:'三年级五班',
                    school:"杭州闲林镇中心小学"
                })
            }
        },
        prevPage(){//上一页
            if(this.page == 1){
                return
            }
            this.page -= 1;
            this.getData();
        },
        nextPage(){//下一页
            if(this.page == this.total){
                return
            }
            this.page += 1;
            this.getData();
        },
        activeResolution(i){//选择分辨率
            this.resolution = i;
        },
        activeAspect(i){//选择纵横比
            this.aspect = i;
        },
        openTool(){//打开工具栏
            this.tool_open = !this.tool_open;
            if(!this.tool_open){
                clearTimeout(this.tool_setTimeout);
                this.tool_setTimeout = setTimeout(()=>{
                    this.tool_show = false;
                },3000);
            }
			this.show_popover_setTimeout = setTimeout(()=>{
				this.show_popover = !this.show_popover;
			},400);
        },
		popoverShow(){//弹窗展示
			this.tool_l += 1;
			clearTimeout(this.tool_setTimeout); 
            console.log(this.tool_l)
		},
		popoverHide(){//弹窗隐藏
			this.tool_l -= 1;
            console.log(this.tool_l)
		},
        mouseenterL(e){//移入
            clearTimeout(this.tool_setTimeout);
            this.tool_show = true;
            this.tool_setTimeout = setTimeout(()=>{
                this.tool_show = false;
            },3000);
        },
        mouseleaveL(e){//移出
            clearTimeout(this.tool_setTimeout);
			if(!this.tool_l){
                this.tool_setTimeout = setTimeout(()=>{
                    this.tool_show = false;
					this.tool_setTimeout = null;
                },3000)
            }
        },
        mousemoveL(e){//移动
            this.tool_show = true;
            clearTimeout(this.tool_setTimeout);
            if(!this.in_tool && !this.tool_l){
                this.tool_setTimeout = setTimeout(()=>{
                    this.tool_show = false;
                },3000)
            }
        },
        fullScreen(){//打开全屏
            if(!document[this.full_screen.judge]){
                document.documentElement[this.full_screen.open]();
            }else{
                document[this.full_screen.close]();
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
            window.addEventListener('keydown',(e)=>{
                e = e || window.event;
                if(e.keyCode === 122){
                    e.preventDefault();
                    this.fullScreen();
                }
            })
            window.onresize = ()=>{
                this.is_full = !!document[this.full_screen.judge];
            }
        }
    },
    
    mounted(){
        
        this.init();
        this.getData();
        
    }
}
</script>
<style>
.select_popover{
	min-width: 0;
}
</style>
<style lang="scss"  scoped="scoped">
.tour_full{
    width: 100%;
    height: 100%;
    background-color: #000;
    position: relative;
    overflow: hidden;
    .scroll_list{
        height: 100%;
        width: 100%;
        cursor:none;
        .list{
            display: flex;
            flex-wrap: wrap;
            li{
                background-color: #409EFF;
                border-top: solid 1px #ddd;
                border-left: solid 1px #ddd;
                box-sizing: border-box;
                position: relative;
                .li_title{
                    position: absolute;
                    width: 100%;
                    height: 16px;
                    top: 8px;
                    left: 0;
                    padding: 0 12px;
                    box-sizing: border-box;
                    font-size: 12px;
                    line-height: 14px;
                    color: #fff;
                    display: flex;
                    justify-content: space-between;
                    opacity: 0.5;
                    text-shadow:#000 1px 1px 2px;
                    .li_school{
                        flex:1;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .li_info{
                        font-size: 14px;
                        margin-left: 10px;
                    }
                }
                video{
                    width: 100%;
                    height: 100%;
                    display: block;
                }
                .li_tool{
                    position: absolute;
                    left: 0;
                    bottom: 6px;
                    height: 26px;
                    padding: 0 12px;
                    box-sizing: border-box;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    color: #fff;
                    .li_icon{
                        cursor: pointer;
                        opacity: 0.4;
                        transition: opacity 0.2s;
                        &:hover{
                            opacity: 1;
                        }
                        i{
                            font-size: 24px;
                        }
                    }
                }
            }
            .hind_top{
                border-top:none;
            }
            .hind_left{
                border-left: none;
            }
        }
        
    }
    .show_cursor{
        cursor:auto;
    }
    .tool{
        color: #333;
        opacity: 0.6;
        position: absolute;
        height: 50px;
        width: 550px;
        bottom: 40px;
        right: -550px;
        background-color:#fff;
        z-index: 100;
        border-top-left-radius: 25px;
        border-bottom-left-radius: 25px;
        display: flex;
        align-items: center;
        transition: all 0.3s;
        overflow: hidden;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
        .open_i{
            height: 50px;
            width: 50px;
            line-height: 50px;
            text-align: center;
            transform-origin:center;
            transform: rotate(180deg);
            transition: transform 0.3s;
            cursor: pointer;
            i{
                font-size: 20px;
                line-height: 50px;
            }
            
        }
        .reversal{
            transform: rotate(0deg);
        }
        .interval{
            width: 1px;
            height: 30px;
            margin: 10px 0;
            background: #bbb;
            border-left: solid 1px #ddd;
        }
        .pagination{
            display: flex;
            align-items: center;
            width: 145px;
            justify-content: center;
            margin:0 20px 0 10px;
            .pagebut{
                width: 22px;
                height: 25px;
                margin: 0 10px;
                line-height: 22px;
                i{
                    line-height: 25px;
                    cursor: pointer;
                    font-size: 22px;
                    &:hover{
                        color: #409EFF;
                    }
                }
            }
            .page_num{
                text-align: center;
                font-size: 14px;
                i{
                    color: #409EFF;
                }
                
            }
            .next{
                transform: rotate(180deg);
                transform-origin: center;
            }
        }
		.select{
			width: 80px;
			display: flex;
			justify-content: center;
			.select_i{
				height: 22px;
				font-size: 12px;
				line-height: 22px;
				border:solid 1px #333;
				padding: 0 4px;
				cursor: pointer;
				color: #333;
				border-radius: 3px;
				&:hover{
					color: #409EFF;
					border-color: #409EFF;
				}
			}
		}
		.full_screen{
			width: 60px;
			text-align: center;
			margin-left: 20px;
			&:hover{
				color: #409EFF;
			}
			i{
				line-height: 24px;
				font-size: 20px;
				cursor: pointer;
			}
		}
    }
    .tool_show{
        right: -500px;
    }
    .tool_open{
        right: 0px;
    }
    .tool_opacity{
        opacity: 1;
    }
	.tool_light{
		opacity: 1;
	}
}
.select_list{
	font-size: 12px;
	text-align: center;
	.select_title{
		font-size: 14px;
		padding-bottom: 8px;
		border-bottom: solid 1px #eee;
		margin-bottom: 4px;
	}
	ul{
		color: #000;
		li{
			height: 30px;
			line-height: 30px;
			cursor: pointer;
			&:hover{
				color: #409EFF;
			}
		}
        .active{
            color: #409EFF;
        }
	}
	.layout_info{
		.layout_list{
			display: flex;
			height: 30px;
			align-items: center;
			margin: 10px 0;
			.num_i{
				width: 92px;
				>div{
					width: 92px;
				}
			}
		}
	}
}

</style>