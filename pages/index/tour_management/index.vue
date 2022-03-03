<template>
    <Frame :loading="loading" :scroll="false">
        <div class="tour">
            <div class="title">
                <h1>巡课管理</h1>
                <div class="list_filter">
                    <div class="region">
                        <el-cascader
                            clearable
                            placeholder="请选择学校"
                            size="small"
                            v-model="region"
                            collapse-tags
                            :props="{ multiple: true }"
                            :options="region_options"
                            @change="refresh">
                        </el-cascader>
                    </div>
                    <div class="list_screen">
                        <el-button size="small" type="primary" @click="showFull">大屏展示</el-button>
                    </div>
                </div>
            </div>
            <div class="filter"><!-- 筛选 -->
                <div class="filter_list" v-for="(l,i) in filter_info" :key="i">
                    <div class="filter_list_l">{{ l.name }}:</div>
                    <div class="filter_list_r" :style="'height:' + l.height + 'px;'">
                        <div class="filter_list_r_" :ref="l.id">
                            <div class="filter_list_open" v-show="l.show" @click="openInfo(i)">
                                <span>{{ l.open ? "收起" : '展开' }}</span>
                                <i class="el-icon-arrow-down" :class="{'open_i' : l.open}"></i>
                            </div>
                            <div class="filter_list_info" 
                                :class="{'active' : l.active == n}" 
                                v-for="(m,n) in l.list" 
                                :key="n"
                                @click="selectInfo(i,n)">{{ m.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="list_info">
                <overlay-scrollbars class="list" :options='{className:"os-theme-thin-dark"}'>
                <div class="list_info" ref="list_info">
                    <div class="list_hint" v-show="data.length == 0">暂无数据</div>
                    <div class="list_li" v-for="(l,i) in data" :key="i" :style="'width:' + list_width + 'px;' + (list_state ? 'transition: width 0.3s;' : '')">
                        <div class="list_i">
                            <div class="video_show" @click="showDetail(l.id)">
                                <el-image
                                    style="width: 100%; height: 100%"
                                    :src="l.url"
                                    fit="contain">
                                </el-image>
                            </div>
                            <div class="video_info">
                                <div class="video_school" v-show="!!l.school">
                                    <span>学校：</span><i>{{ l.school || '' }}</i>
                                </div>
                                <div class="video_class">
                                    <span>班级：</span><i>{{ l.grade + l.class }}</i>
                                </div>
                                <div class="video_subject">
                                    <span>学科：</span><i>{{ l.subject }}</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </overlay-scrollbars>
            </div>
            
            <div class="page">
                <el-pagination
                    background
                    layout="total, prev, pager, next, jumper"
                    @current-change="getData"
                    :current-page.sync="page"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </Frame>
</template>

<script>
import Frame from '@/components/frame.vue'
export default {
    name:'tour_management',
    head:{
        title:"巡课管理 - "
    },
    data() {
        return {
            loading:false,
            region:[],
            region_options:[],
            filter_info:[{
                id:'grade',
                name:'年级',
                active:0,
                list:[{id:null,name:'不限'}],
                height:48,
                show:false,
                open:false
            },{
                id:"subject",
                name:'学科',
                active:0,
                list:[{id:null,name:'不限'}],
                height:48,
                show:false,
                open:false
            }],
            data:[],
            grade:null,
            subject:null,
            list_width:320,
            list_state:false,
            search:"",
            page:1,
            total:0,
        }
    },
    computed:{
    },
    components:{ 
        Frame
    },
    methods: {
        //数据
        getRegion(){//获取地区
            this.$axios.post('/tour/region').then(res=>{
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    let info = this.$cookies.get('double_class_edu');
                    if(info.type == 1){
                        this.region_options = [];
                        for(let l of res.data.obj){
                            let info = {
                                label : l.region,
                                value : l.region,
                                children : []
                            }
                            for(let m of l.district){
                                let data = {
                                    label : m.region,
                                    value : m.region,
                                    children : []
                                }
                                for(let k of m.school){
                                    data.children.push({
                                        label : k.title,
                                        value : k.id
                                    })
                                }
                                info.children.push(data)
                            }
                            this.region_options.push(info);
                        }
                    }else if(info.type == 2){
                        this.region_options = [];
                        for(let l of res.data.obj){
                            let info = {
                                label : l.region,
                                value : l.region,
                                children : []
                            }
                            for(let m of l.school){
                                info.children.push({
                                    label : m.title,
                                    value : m.id
                                })
                            }
                            this.region_options.push(info);
                        }
                    }else if(info.type == 3){
                        this.region_options = [];
                        for(let l of res.data.obj){
                            this.region_options.push({
                                label : l.title,
                                value : l.id
                            })
                        }
                    }
                }
            }).catch(err=>{
                console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取地区数据失败");
                }
            });
        },
        getGrade(){//获取年级
            this.$axios.post('tour/grade').then(res=>{
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.$set(this.filter_info[0],"list",[{id:null,name:'不限'},...res.data.obj]);
                    this.$nextTick(()=>{
                        this.detectionFilter();
                    })
                }
            }).catch(err=>{
                console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取学科失败");
                }
            });
            
        },
        getSubject(){//获取学科
            this.$axios.post('tour/subject').then(res=>{
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.$set(this.filter_info[1],"list",[{id:null,name:'不限'},...res.data.obj]);
                    this.$nextTick(()=>{
                        this.detectionFilter();
                    })
                }
            }).catch(err=>{
                console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取学科失败");
                }
            });
            
        },
        refresh(){//刷新
            this.page = 1;
            this.getData();
        },
        getData(){//获取列表数据
            if(this.loading){
                return
            }
            this.loading = true;
            let school_ids = null;
            if(this.region.length !== 0){
                school_ids = [];
                for(let l of this.region){
                    school_ids.push(l[l.length - 1])
                }
            }
            this.$axios.post('/tour/video',{
                subject:this.subject,
                school_ids:school_ids,
                grade:this.grade
            }).then(res=>{
                this.loading = false;
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.total = res.data.total;
                    this.data = res.data.obj.data;
                    this.$nextTick(()=>{
                        this.detectionList();
                    })
                }
            }).catch(err=>{
                this.loading = false;
                console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取年级失败");
                }
            });
            
        },
        
        //页面逻辑
        showDetail(id){//展示详情
            window.open('/admin/tour_detail/?id=' + id, '_blank');
        },
        showFull(){//展示大屏
            window.open('/admin/tour_full', '_blank');
        },
        selectInfo(i,n){//筛选面板 选择信息
            if(this.filter_info[i].active !== n){
                this.$set(this.filter_info[i],"active",n);

                if(this.filter_info[i].id == 'subject'){
                    this.subject = this.filter_info[i].list[n].id;
                }
                if(this.filter_info[i].id == 'grade'){
                    this.grade = this.filter_info[i].list[n].id;
                }
                this.refresh();
            }
        },
        openInfo(i){//筛选面板 展开、关闭
            let data = this.$refs[this.filter_info[i].id];
            if(Array.isArray(data)){
                data = data[0];
            }
            this.$set(this.filter_info[i],"height",this.filter_info[i].open ? 48 : data.offsetHeight);
            this.$set(this.filter_info[i],"open",!this.filter_info[i].open);
        },
        detectionFilter(){//检测筛选面板
            for(let l of this.filter_info){
                let data = this.$refs[l.id];
                if(Array.isArray(data)){
                    data = data[0];
                }
                this.$set(l,"show",data.offsetHeight > 50);
                this.$set(l,"height",l.open ? data.offsetHeight : 48);
            }
        },
        detectionList(){//检测列表宽度
            let w = this.$refs.list_info.offsetWidth - 20;
            let i = 2;
            for(;;i++){
                let k = w / i;
                if(k < 320){
                    break;
                }
            }
            this.list_width = w / --i;
        },
        widthChange(){//宽度变化
            let k = setTimeout(()=>{
                this.list_state = true;
                this.detectionFilter();
                this.detectionList();
                let p = setTimeout(()=>{
                    this.list_state = false;
                    clearTimeout(p);
                    p = null;
                    clearTimeout(k);
                    k = null;
                },300);
            },450);
        }
    },
    mounted() {
        this.getRegion();
        this.getGrade();
        this.getSubject();
        this.getData();
        window.onresize=()=>{
            this.detectionFilter();
            this.detectionList();
        } 
    }
}
</script>

<style lang="scss" scoped="scoped"> 
.tour{
    height: 100%;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .title{
        height: 42px;
        display: flex;
        justify-content: space-between;
        border-bottom: solid 1px #e7e7e7;
        flex-shrink: 0;
        h1{
            color: #333;
            font-size: 20px;
        }
        .list_filter{
            display: flex;
            align-items: center;
            .region{
                width: 240px;
                margin-right: 40px;
                .el-cascader{
                    width: 100%;
                    ::v-deep .el-cascader__tags{
                        flex-wrap: nowrap;
                        >.el-tag{
                            &:first-child{
                                width: calc(100% - 36px);
                            }
                        }
                    }
                }
            }
        }
    }
    .filter{
        flex-shrink: 0;
        margin: 10px 0;
        padding-left: 10px;
        .filter_list{
            display: flex;
            .filter_list_l{
                height: 48px;
                width: 60px;
                line-height: 48px;
                color: #777;
                font-size: 16px;
            }
            .filter_list_r{
                flex: 1;
                padding-right: 50px;
                height: 48px;
                overflow: hidden;
                transition: all 0.3s;
                .filter_list_r_{
                    width: 100%;
                    position: relative;
                    display: flex;
                    flex-wrap: wrap;
                    .filter_list_open{
                        position: absolute;
                        right: -35px;
                        top: 0;
                        width: 43px;
                        height: 48px;
                        font-size: 12px;
                        color: #999;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        &:hover{
                            color: #666;
                        }
                        >span{
                            margin-right: 2px;
                        }
                        >i{
                            text-align: center;
                            transition: transform 0.2s;
                        }
                        .open_i{
                            transform: rotate(180deg);
                        }
                    }
                    .filter_list_info{
                        height: 34px;
                        cursor: pointer;
                        color: #000;
                        padding: 0 16px;
                        border-radius: 5px;
                        line-height: 34px;
                        font-size: 14px;
                        margin: 7px 10px;
                        &:hover{
                            color: #409EFF;
                        }
                    }
                    .active{
                        background-color: #409EFF;
                        color: #fff;
                        &:hover{
                            color: #fff;
                        }
                    }
                }
            }
            
        }
    }
    .list_info{
        flex: 1;
        flex-shrink: 0;
        overflow: hidden;
    }
    .list{
        height: 100%;
        border-top: solid 1px #eee;
        .list_info{
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            .list_hint{
                width: 100%;
                text-align: center;
                font-size: 16px;
                color: #999;
                line-height: 20px;
            }
            .list_li{
                width: 320px;
                height: 244px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .list_i{
                    width: 288px;
                    height: 214px;
                    .video_show{
                        height: 162px;
                        width: 288px;
                        margin-bottom: 8px;
                        cursor: pointer;
                    }
                    .video_info{
                        height: 40px;
                        background-color: #fff;
                        font-size: 14px;
                        line-height: 22px;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        >div{
                            span{
                                color: #409EFF;
                            }
                            i{
                                font-style: normal;
                            }
                        }
                        .video_school{
                            width: 100%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
                
            }
        }  
    }
    .page{
        flex-shrink: 0;
        height: 32px;
        padding-top: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
        /deep/ .el-pager{
            li{
                border-radius: 4px;
                border: solid 1px #eee;
                background-color: #fff;
                box-sizing: border-box;
            }
        }
        
    }
}

    
</style>


