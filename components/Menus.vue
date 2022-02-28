<template>
    <div class="menu" ref="menu" :style="'width:' + (meunif ? 80 : 240) + 'px'">
        <div class="menuh">
            <ul class="menuk">
                <li v-for="(data,index) in meundata" :key="index">
                    <div class="list" :class="data.select ? 'pick' : ''"  @click="open(index,data)">
                        <el-tooltip
                            :content="data.name"
                            placement="right"
                            :disabled='!meunif'
                            >
                            <div class="info" :style="meunif ? 'width:76px;' : ''">
                                <div class="con" :class="meunif ? 'conm' : ''">
                                    <div class="icon">
                                        <i class="iconfont" :class="data.icon"></i>
                                    </div>
                                    <div class="text">{{ data.name }}</div>
                                </div>
                                <b v-show="data.list" class="el-icon-arrow-down" :class=" data.open ? '' : 'iconclose'"></b>
                            </div>
                        </el-tooltip>
                    </div>
                    <ul v-if="data.list" :style="'height:' + (data.open && data.list ? data.list.length * 40 : 0) + 'px'">
                        <li
                            v-for="(info,num) in data.list"
                            :key="num"
                            :class="info.select ? 'pickli' : ''"
                            @click="openSec(index,num,data)"
                            >
                            <el-tooltip
                                :content="info.name"
                                placement="right"
                                :disabled='!meunif'
                                >
                                <div class="info" :style="meunif ? 'width:76px;' : ''">
                                    <div class="icons" :class="meunif ? 'iconms' : ''">
                                        <i class="iconfont" :class="info.icon"></i>
                                    </div>
                                    <div class="text">{{ info.name }}</div>
                                </div>
                            </el-tooltip>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        
    </div>
</template>

<script>
export default {
    name:'menus',
    data() {
        return {
            type:"/",
            openid:null,
            firstid:null,
            secondid:null,
            meunif:false,
            meundata:[],
            opens:false
        }
    },
    watch:{
        '$route'(){
            this.setSelect();
        }
    },
    methods: {
        setMeunData(data){//设置菜单数据并选中当前菜单
            for(let l of data){
                l.select = false;
                if(l.list){
                    l.open = false;
                    for(let a of l.list){
                        a.select = false;
                    }
                }
            }
            this.meundata = data;
            this.type = '/';
            this.setSelect();
        },
        setSelect(){//设置选中
            let route = this.$route.path.split("/");
            let first = route[1];
            let second = route[2];
            if(this.firstid !== null){
                this.meundata[this.firstid].select = false;
            }
            if(this.secondid !== null){
                this.meundata[this.firstid].list[this.secondid].select = false;
            }
            if(route){
                if(first){
                    for(let k in this.meundata){
                        if(this.meundata[k].route == first){
                            this.firstid = k;
                            this.meundata[k].select = true;
                            if(this.meundata[k].list){
                                this.meundata[k].open = true;
                            }
                            if(this.meundata[k].list && this.meundata[k].list.length > 0){
                                if(second){
                                    for(let i in this.meundata[k].list){
                                        if(second.search(this.meundata[k].list[i].route) == 0){
                                            this.secondid = i;
                                            this.meundata[k].list[i].select = true;
                                            break;
                                        }
                                    }
                                }else{
                                    this.$router.push(this.type + this.meundata[k].route + '/' +this.meundata[k].list[0].route);
                                }
                            }else{
                                this.secondid = null;
                            }
                            this.meundata.splice(k,1,this.meundata[k]);
                            break;
                        }
                    }
                }else{
                    this.init();
                }
            }
        },
        setMenuIf(data){//折叠菜单
            this.meunif = data;
        },
        open(id,data){//菜单栏折叠或者跳转
            if(data.list){//折叠
               data.open = !data.open;
               this.meundata.splice(id,1,data);
            }else{//跳转
                if(this.$route.path == (this.type + this.meundata[id].route)){
                    this.$router.go(0);
                }else{
                    this.$router.push(this.type + this.meundata[id].route);
                }
            }
        },
        openSec(firstid,secondid){//菜单栏跳转
            if(this.$route.path == (this.type + this.meundata[firstid].route + '/' + this.meundata[firstid].list[secondid].route)){
                this.$router.go(0);
            }else{
                this.$router.push(this.type + this.meundata[firstid].route + '/' + this.meundata[firstid].list[secondid].route);
            }
        },
        init(){//初始化
            if(this.meundata.length == 0){
                return
            }
            this.firstid = 0;
            this.meundata[0].select = true;
            if(typeof this.meundata[0].open == 'boolean'){
                this.meundata[0].open = true;
                this.meundata[0].list[0].select = true;
                this.secondid = 0;
                this.$router.push(this.type + this.meundata[0].route + '/' + this.meundata[0].list[0].route);
            }else{
                this.$router.push(this.type + this.meundata[0].route);
            }
        }
    },
    mounted(){}
}
</script>

<style lang="scss">
    .menu{
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        transition:all 0.4s;
        background-color:#192539;
        .menuh{
            overflow-y: auto;
            height: 100%;
            width: calc(100% + 20px);
        }
        .menuk{
            overflow: hidden;
            width: 100%;
            color: #a3a8b0;
            font-size: 15px;
            >li{
                .list{
                    height: 55px;
                    border-left: solid 3px #192539;
                    cursor: pointer;
                    transition:width 0.3s;
                    .info{
                        display: flex;
                        align-items: center;
                        outline: none;
                        .con{
                            display: flex;
                            width: 190px;
                            height: 55px;
                            line-height: 55px;
                            margin-left: 18px;
                            overflow: hidden;
                            flex-shrink: 0;
                            .icon{
                                transition:all 0.3s;
                                width: 18px;
                                margin: 0 10px;
                                flex-shrink: 0;
                                i{
                                    transition:all 0.3s;
                                    font-size: 20px;
                                }
                            }
                            .text{
                                transition:all 0.3s;
                                margin-left: 15px;
                                white-space: nowrap;
                            }
                        }
                        .conm{
                            .icon{
                                margin:0 0 0 9px;
                                width: 46px;
                                i{
                                    font-size: 24px;
                                }
                            }
                        }
                        >b{
                            transition:all 0.3s;
                            font-size: 16px;
                            transform:rotate(0deg);
                            transform-origin:50% 50%;
                        }
                        .iconclose{
                            transform:rotate(-90deg);
                        }
                    }
                    &:hover{
                        background-color: #2C3750;
                        border-left: solid 3px #0f9aee;
                        .con{
                            .icon i{color: #fff;}
                            .text{color: #fff;}
                        }
                        b{color: #fff;}
                    }
                }
                .pick{
                    background-color: #2C3750;
                    border-left: solid 3px #0f9aee;
                    .con{
                        .icon i{color: #fff;}
                        .text{color: #fff;}
                    }
                    b{color: #fff;}
                }
                >ul{
                    overflow: hidden;
                    transition:all 0.3s;
                    li{
                        height: 40px;
                        line-height: 40px;
                        cursor: pointer;
                        transition:width 0.3s;
                        .info{
                            display: flex;
                            outline: none;
                            .icons{
                                transition:all 0.4s;
                                margin: 0 20px 0 50px;
                                width: 20px;
                                flex-shrink: 0;
                                i{
                                    transition:all 0.4s;
                                    font-size: 18px;
                                }
                            }
                            .iconms{
                                margin:0 0 0 32px;
                                width: 48px ;
                                i{
                                    font-size: 20px;
                                }
                            }
                            .text{
                                transition:all 0.4s;
                                white-space: nowrap;
                                font-size: 15px;
                            }
                        }
                        &:hover{
                            background-color: #2C3750;
                            .icons i{color: #fff;}
                            .text{color: #fff;}
                        }
                    }
                    .pickli{
                        background-color: #2C3750;
                        .icons i{color: #fff;}
                        .text{color: #fff;}
                    }
                }
            }

        }
    }
</style>
