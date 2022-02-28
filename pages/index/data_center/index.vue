<template>
    <div class="data_center" v-loading="loading">
        <div class="data_left">
            <div class="tour_title">
                <h2>双师系统数据图表</h2>
                <div class="option">
                    <ul>
                        <li :class="{'active' : option == 'all'}"
                            @click="cutData('all')">全部</li>
                        <i></i>
                        <li :class="{'active' : option == 'lecture'}"
                            @click="cutData('lecture')">授课</li>
                        <i></i>
                        <li :class="{'active' : option == 'attend'}"
                             @click="cutData('attend')">听课</li>
                    </ul>
                </div>
            </div>
            <div class="tour_data">
                <div class="tour_course tour_info">
                    <div class="tour_info_title">
                        <div class="title_i"></div>
                        <div class="title_info">课次数据</div>
                    </div>
                    <div class="tour_chart">
                        <div class="tour_chart_line">
                            <Chart ref="course_month"></Chart>
                        </div>
                        <div class="tour_chart_pie"
                            ref="course_grade_frame"
                            :class="{'full' : detail == 'course_grade'}">
                            <div class="mask"
                                @click="showDetail('course_grade')"
                                :style="detail == 'course_grade' ? ('top:-' + full_top + 'px;left:-' + full_left + 'px;') : ''"> 
                            </div>
                            <div class="chart_pie_i" 
                                @click="showDetail('course_grade')"
                                :style="detail == 'course_grade' ? ('top:calc(40px - ' + full_top + 'px);right:calc(' + (50 + full_width + full_left) + 'px - 100vw);') : ''">
                                <i :class="detail == 'course_grade' ? 'icon-guanbi1' : 'icon-detail'" class="iconfont"></i>
                            </div>
                            <div class="tour_chart_pie_info"
                                :style="detail == 'course_grade' ? ('top:-' + (full_top) + 'px;left:calc(20vw - ' + (full_left) + 'px);') : ''">
                                <Chart ref="course_grade"></Chart>
                            </div>
                            
                        </div>
                        <div class="tour_chart_pie"
                            ref="course_subject_frame" 
                            :class="{'full' : detail == 'course_subject'}">
                            <div class="mask" 
                                @click="showDetail('course_subject')"
                                :style="detail == 'course_subject' ? ('top:-' + full_top + 'px;left:-' + full_left + 'px;') : ''"> 
                            </div>
                            <div class="chart_pie_i" 
                                @click="showDetail('course_subject')"
                                :style="detail == 'course_subject' ? ('top:calc(40px - ' + full_top + 'px);right:calc(' + (50 + full_width + full_left) + 'px - 100vw);') : ''">
                                <i :class="detail == 'course_subject' ? 'icon-guanbi1' : 'icon-detail'" class="iconfont"></i>
                            </div>
                            <div class="tour_chart_pie_info"
                                :style="detail == 'course_subject' ? ('top:-' + (full_top) + 'px;left:calc(20vw - ' + full_left + 'px);') : ''">
                                <Chart ref="course_subject"></Chart>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="tour_person tour_info">
                    <div class="tour_info_title">
                        <div class="title_i"></div>
                        <div class="title_info">人次数据</div>
                    </div>
                    <div class="tour_chart">
                        <div class="tour_chart_line">
                            <Chart ref="person_month"></Chart>
                        </div>
                        <div class="tour_chart_pie"
                            ref="person_grade_frame"
                            :class="{'full' : detail == 'person_grade'}">
                            <div class="mask"
                                @click="showDetail('person_grade')"
                                :style="detail == 'person_grade' ? ('top:-' + full_top + 'px;left:-' + full_left + 'px;') : ''"> 
                            </div>
                            <div class="chart_pie_i" 
                                @click="showDetail('person_grade')"
                                :style="detail == 'person_grade' ? ('top:calc(40px - ' + full_top + 'px);right:calc(' + (50 + full_width + full_left) + 'px - 100vw);') : ''">
                                <i :class="detail == 'person_grade' ? 'icon-guanbi1' : 'icon-detail'" class="iconfont"></i>
                            </div>
                            <div class="tour_chart_pie_info"
                                :style="detail == 'person_grade' ? ('top:-' + (full_top) + 'px;left:calc(20vw - ' + (full_left) + 'px);') : ''">
                                <Chart ref="person_grade"></Chart>
                            </div>
                            
                        </div>
                        <div class="tour_chart_pie"
                            ref="person_subject_frame" 
                            :class="{'full' : detail == 'person_subject'}">
                            <div class="mask" 
                                @click="showDetail('person_subject')"
                                :style="detail == 'person_subject' ? ('top:-' + full_top + 'px;left:-' + full_left + 'px;') : ''"> 
                            </div>
                            <div class="chart_pie_i" 
                                @click="showDetail('person_subject')"
                                :style="detail == 'person_subject' ? ('top:calc(40px - ' + full_top + 'px);right:calc(' + (50 + full_width + full_left) + 'px - 100vw);') : ''">
                                <i :class="detail == 'person_subject' ? 'icon-guanbi1' : 'icon-detail'" class="iconfont"></i>
                            </div>
                            <div class="tour_chart_pie_info"
                                :style="detail == 'person_subject' ? ('top:-' + (full_top) + 'px;left:calc(20vw - ' + full_left + 'px);') : ''">
                                <Chart ref="person_subject"></Chart>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="data_right">
            <div class="extreme">
                <div class="extreme_title">
                    <span>单次课程最多数据</span>
                </div>
                <ul class="extreme_data">
                    <li>
                        <div class="extreme_li_left">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-renyuan"></use>
                            </svg>
                        </div>
                        <div class="extreme_li_right">
                            <div class="extreme_num">{{ partake.sum }}</div>
                            <div class="extreme_txt">参与人数</div>
                        </div>
                    </li>
                    <div class="hr"></div>
                    <li>
                        <div class="extreme_li_left">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-banji1"></use>
                            </svg>
                        </div>
                        <div class="extreme_li_right">
                            <div class="extreme_num">{{ partake.class }}</div>
                            <div class="extreme_txt">参与班级数</div>
                        </div>
                    </li>
                    <div class="hr"></div>
                    <li>
                        <div class="extreme_li_left">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-xuexiao1"></use>
                            </svg>
                        </div>
                        <div class="extreme_li_right">
                            <div class="extreme_num">{{ partake.school }}</div>
                            <div class="extreme_txt">参与学校数</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="cooperation">
                <div class="cooperation_top">
                    <div class="cooperation_info">
                        <div class="cooperation_title">合作学校</div>
                        <div class="cooperation_num">{{ cooperation.relation }}</div>
                    </div>
                    <div class="hr"></div>
                    <div class="cooperation_info">
                        <div class="cooperation_title">合作学科</div>
                        <div class="cooperation_num">{{ cooperation.subject }}</div>
                    </div>
                </div>
                <div class="cooperation_bottom">
                    <div class="cooperation_live_i">
                        <div class="live_i"></div>
                    </div>
                    <div class="cooperation_live">
                        <span>在线课堂</span>
                    </div>
                    <div class="cooperation_num">{{ classroom }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Chart from '@/components/Chart.vue'
export default {
    name:'data_center',
    head:{
        title:"数据中心 - "
    },
    data() {
        return {
            loading:false,
            option:'all',
            colors:['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],

            course_month:{all:{},lecture:{},attend:{}},
            course_grade:{all:{},lecture:{},attend:{}},
            course_subject:{all:{},lecture:{},attend:{}},
            person_month:{all:{},lecture:{},attend:{}},
            person_grade:{all:{},lecture:{},attend:{}},
            person_subject:{all:{},lecture:{},attend:{}},
            partake:{class: 0,school: 0,sum: 0},
            classroom: 0,
            cooperation: {relation: 0,subject: 0},

            detail:null,
            full_left:0,
            full_top:0,
            full_height:0,
            full_width:0,
            full_loading:false,
        }
    },
    computed:{
    },
    components:{ 
        Chart
    },
    methods: {
        cutData(data){//切换数据
            this.option = data;
            this.$refs.course_month.init(this.echartsLineReset(data,'course_month'));
            this.$refs.course_grade.init(this.echartsPieReset(data,'course_grade'));
            this.$refs.course_subject.init(this.echartsPieReset(data,'course_subject'));
            this.$refs.person_month.init(this.echartsLineReset(data,'person_month'));
            this.$refs.person_grade.init(this.echartsPieReset(data,'person_grade'));
            this.$refs.person_subject.init(this.echartsPieReset(data,'person_subject'));
        },

        echartsLineOption(x,y,name){//折线图配置
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '0',
                    right: '0',
                    top:'20',
                    bottom: '0',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    splitLine:{
                        show:false,
                    },
                    data: x,
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel: {
                        color:"#909399",
                        interval:0,
                        margin:10,
                        formatter: function (value, index) {
                            return value.length > 10 ? (value.substring(0, 10) + '...') : value
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            color : '#f2f2f2'
                        }
                    },
                    nameTextStyle:{
                        color:"#909399"
                    }
                },
                series: [{
                    name:name,
                    type:'line',
                    data:y,
                    smooth:true,
                    showSymbol:false,
                    itemStyle:{
                        color:'#409EFF'
                    },
                    areaStyle:{
                        color:{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#409EFF' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#409EFF00' // 100% 处的颜色
                            }]
                        }
                    }
                }]
            }
            return option
        },
        echartsPieOption(data,name){//饼状图配置
            for(let l of data.detail){
                l.itemStyle = {
                    color : l.color
                }
            }
            for(let m of data.simple){
                m.itemStyle = {
                    color : m.color
                }
            }
            let option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show:true,
                    top: '4%',
                    left: 'center',
                    data: data.simple
                },
                series: [{
                    name:name,
                    type:'pie',
                    radius: '80%',
                    avoidLabelOverlap: false,
                    center: ['50%', '55%'],
                    data:data.simple,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{b}\n{d}%'
                    },
                },{
                    name:name,
                    type:'pie',
                    radius: ['80%','80%'],
                    avoidLabelOverlap: false,
                    center: ['50%', '55%'],
                    data:data.detail,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{b}\n{d}%',
                        fontSize: 0
                    },
                }]
            }
            return option
        },
        echartsPieDetail(){//饼状图展示详情
            let option = {
                series: [{
                    radius: '50%',
                },{
                    radius: ['60%','85%'],
                    label: {
                        fontSize: 12
                    }
                }]
            }
            return option
        },
        echartsPieSimple(){//饼状图展示精简
            let option = {
                series: [{
                    radius: '80%',
                },{
                    radius: ['80%','80%'],
                    label: {
                        fontSize: 0
                    }
                }]
            }
            return option
        },
        echartsLineReset(type,str){//折线图重置数据
            let option = {
                xAxis: {
                    data: this[str][type].x,
                },
                series: [{
                    data:this[str][type].y,
                }]
            }
            return option
        },
        echartsPieReset(type,str){//饼状图重置数据
            for(let l of this[str][type].detail){
                l.itemStyle = {
                    color : l.color
                }
            }
            for(let m of this[str][type].simple){
                m.itemStyle = {
                    color : m.color
                }
            }
            let option = {
                legend: {
                    data: this[str][type].simple
                },
                series: [{
                    data:this[str][type].simple
                },{
                    data:this[str][type].detail
                }]
            }
            return option
        },

        courseMonth(data){//课次月份数据
            this.$refs.course_month.init(this.echartsLineOption(data.x,data.y,'课次'),'course_month');
        },
        courseGrade(data){//课次年级数据
            this.$refs.course_grade.init(this.echartsPieOption(data,'课次'),'course_grade');
        },
        courseSubject(data){//课次科目数据
            this.$refs.course_subject.init(this.echartsPieOption(data,'课次'),'course_subject');
        },
        personMonth(data){//人次月份数据
            this.$refs.person_month.init(this.echartsLineOption(data.x,data.y,'人次'),'person_month');
        },
        personGrade(data){//人次年级数据
            this.$refs.person_grade.init(this.echartsPieOption(data,'人次'),'person_grade');
        },
        personSubject(data){//人次科目数据
            this.$refs.person_subject.init(this.echartsPieOption(data,'人次'),'person_subject');
        },

        showDetail(str){//展示详情
            if(this.detail){
                if(this.full_loading){
                    return
                }
                this.detail = null;
                this.$nextTick(()=>{
                    this.$refs[str].resize();
                    this.$refs[str].init(this.echartsPieSimple(),[str]);
                })
            }else{
                this.full_loading = true;
                this.detail = str;
                let data = this.$refs[str + '_frame'].getBoundingClientRect();
                this.full_left = data.left;
                this.full_top = data.top;
                this.full_height = data.height;
                this.full_width = data.width;
                let time = setTimeout(()=>{
                    this.$refs[str].resize();
                    this.$refs[str].init(this.echartsPieDetail(),[str]);
                    clearInterval(time);
                    time = null;
                    this.full_loading = false;
                },400);
            } 
            
        },
        echartsResize(){//图表重置大小
            this.$refs.course_month.resize();
            this.$refs.course_grade.resize();
            this.$refs.course_subject.resize();
            this.$refs.person_month.resize();
            this.$refs.person_grade.resize();
            this.$refs.person_subject.resize();
        },
        widthChange(){//宽度改变
            setTimeout(()=>{
                this.echartsResize();
            },350);
        },

        getData(){//获取数据
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post('/datacenter/participate').then(res=>{
                this.loading = false;
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.dataProcessing(res.data.obj);
                }
            }).catch(err=>{
                this.loading = false;
				console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取数据失败");
                }
            });
        },
        dataProcessing(data){//处理数据
            this.partake = data.partake;
            this.cooperation = data.cooperation;
            this.classroom = data.classroom;

            this.dataLine('course_month',data.course);
            this.courseMonth(this.course_month[this.option]);

            this.dataPie('course_grade',data.course_grade,1);
            this.courseGrade(this.course_grade[this.option]);

            this.dataPie('course_subject',data.course_subject,2);
            this.courseSubject(this.course_subject[this.option]);

            this.dataLine('person_month',data.people);
            this.personMonth(this.person_month[this.option]);

            this.dataPie('person_grade',data.people_grade,1);
            this.personGrade(this.person_grade[this.option]);

            this.dataPie('person_subject',data.people_subject,2);
            this.personSubject(this.person_subject[this.option]);

        },
        dataLine(str,data){//折线图数据处理
            this[str].all = {x:[],y:[]}
            this[str].lecture = {x:[],y:[]}
            this[str].attend = {x:[],y:[]}
            let x = [];
            for(let l of data){
                x.push(l.month);
                this[str].all.y.push(l.total);
                this[str].lecture.y.push(l.Lecture);
                this[str].attend.y.push(l.attend);
            }
            this[str].all.x = x;
            this[str].lecture.x = x;
            this[str].attend.x = x;
        },
        dataPie(str,data,num){//饼状图处理
            this[str].all = {simple:[],detail:[]};
            this[str].lecture = {simple:[],detail:[]};
            this[str].attend = {simple:[],detail:[]};
            for(let i in data){
                this[str].all.simple.push({
                    name:data[i][num == 1 ? 'grade' : 'subject'],
                    value:data[i].total,
                    color:this.colors[i % 10]
                });
                this[str].lecture.simple.push({
                    name:data[i][num == 1 ? 'grade' : 'subject'],
                    value:data[i].lecture,
                    color:this.colors[i % 10]
                });
                this[str].attend.simple.push({
                    name:data[i][num == 1 ? 'grade' : 'subject'],
                    value:data[i].attend,
                    color:this.colors[i % 10]
                });
                for(let n in data[i][num == 1 ? 'subject' : 'grade']){
                    this[str].all.detail.push({
                        name:data[i][num == 1 ? 'grade' : 'subject'] + '(' + data[i][num == 1 ? 'subject' : 'grade'][n][num == 1 ? 'subject' : 'grade'] + ')',
                        value:data[i][num == 1 ? 'subject' : 'grade'][n].total,
                        color:this.colors[n % 10]
                    });
                    this[str].lecture.detail.push({
                        name:data[i][num == 1 ? 'grade' : 'subject'] + '(' + data[i][num == 1 ? 'subject' : 'grade'][n][num == 1 ? 'subject' : 'grade'] + ')',
                        value:data[i][num == 1 ? 'subject' : 'grade'][n].lecture,
                        color:this.colors[n % 10]
                    });
                    this[str].attend.detail.push({
                        name:data[i][num == 1 ? 'grade' : 'subject'] + '(' + data[i][num == 1 ? 'subject' : 'grade'][n][num == 1 ? 'subject' : 'grade'] + ')',
                        value:data[i][num == 1 ? 'subject' : 'grade'][n].attend,
                        color:this.colors[n % 10]
                    });
                }
            }
        }

    },
    mounted() {
        window.onresize = ()=>{
            this.echartsResize();
        }
        this.getData();
    }
}
</script>

<style lang="scss" scoped="scoped"> 
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
@media screen and (max-width:1370px ) {
    .data_left{
        width: calc(100% - 220px);
    }
    .data_right{
        width: 200px;
    }
}
@media screen and (min-width:1370px)and(max-width:1920px ) {
    .data_left{
        width: calc(100% - 320px);
    }
    .data_right{
        width: 300px;
    }
}
@media screen and (min-width:1921px ) {
    .data_left{
        width: calc(100% - 420px);
    }
    .data_right{
        width: 400px;
    }
}
.data_center{
    min-height: 650px;
    height: 100%;
    width: 100%;
    background-color: #f3f3f3;
    padding: 10px 20px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: relative;
    .data_left{
        height: 100%;
        .tour_title{
            height: 50px;
            line-height: 40px;
            text-align: center;
            position: relative;
            h2{
                font-size: 30px;
                color: #333;
                letter-spacing: 2px;
            }
            .option{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 156px;
                height: 30px;
                line-height: 30px;
                background-color: #fff;
                color: #444;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                box-shadow: 0 5px 15px -5px rgba(0,0,0,0.5);
                overflow: hidden;
                ul{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    font-size: 14px;
                    align-items: center;
                    li{
                        width: 52px;
                        cursor: pointer;
                        transition: all 0.2s;
                        &:hover{
                            color: #409EFF;
                        }
                    }
                    .active{
                        background-color: #409EFF;
                        color: #fff;
                        &:hover{
                            background-color: #409EFF;
                            color: #fff;
                        }
                    }
                    i{
                        display: block;
                        width: 1px;
                        height: 50%;
                        background-color: #eee;
                    }
                }
            }
        }
        .tour_data{
            height: calc(100% - 50px);
            background-color: #fff;
            box-shadow: 0 5px 15px -5px rgba(0,0,0,0.5);
            border-radius: 10px;
            border-top-left-radius: 0px;
            color: #222;
            position: relative;
            z-index: 1000;
            .tour_info{
                height: 50%;
                width: 100%;
                box-sizing: border-box;
                padding: 10px;
                .tour_info_title{
                    height: 20px;
                    line-height: 20px;
                    width: 100px;
                    display: flex;
                    .title_i{
                        height: 100%;
                        width: 3px;
                        background-color: #409EFF;
                        margin-right: 8px;
                    }
                }
                .tour_chart{
                    height: calc(100% - 30px);
                    margin-top: 10px;
                    width: 100%;
                    display: flex;
                    .tour_chart_line{
                        width: 42.857%;
                        box-sizing: border-box;
                        padding: 20px;
                        overflow: hidden;
                    }
                    .tour_chart_pie{
                        width: 28.571%;
                        position: relative;
                        .mask{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 1;
                            background-color: rgba(255,255,255,0.8);
                        }
                        .chart_pie_i{
                            position: absolute;
                            bottom: 10px;
                            right: 20px;
                            z-index: 3;
                            i{
                                font-size: 26px;
                            }
                            font-size: 12px;
                            cursor: pointer;
                            color: #999;
                        }
                        .tour_chart_pie_info{
                            box-sizing: border-box;
                            position: absolute;
                            z-index: 2;
                            height: 100%;
                            width: 100%;
                            top: 0;
                            left: 0;
                            transition-property: width ,height ,left ,top; 
                            transition-duration: 0s;
                            padding: 0 20px;
                            background-color: rgba(255,255,255,0.7);
                        }
                    }
                    .full{
                        .mask{
                            width: 100vw;
                            height: 100vh;
                            background-color: rgba(0,0,0,0.2);
                            z-index: 10;
                        }
                        .chart_pie_i{
                            z-index: 30;
                            color: #f44336;
                            i{
                                font-size: 40px;
                                font-weight: 800;
                            }
                        }
                        .tour_chart_pie_info{
                            z-index: 20;
                            width: 60vw;
                            height: 100vh;
                            padding: 20px;
                            transition-duration: 0.4s;
                        }
                    }
                }
            }
        }
    }
    .data_right{
        height: 100%;
        .extreme{
            height: 70%;
            width: 100%;
            background-color: #fff;
            box-shadow: 0 5px 15px -5px rgba(0,0,0,0.5);
            border-radius: 10px;
            .extreme_title{
                height: 40px;
                color: #555;
                font-size: 16px;
                line-height: 40px;
                text-align: center;
                border-bottom: solid 1px #e9e9e9;
            }
            .extreme_data{
                height: calc(100% - 41px);
                li{
                    height: 33.333%;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .extreme_li_left{
                        font-size: 40px;
                        height: 40px;
                        line-height: 0;
                        text-align: center;
                    }
                    .extreme_li_right{
                        margin-left: 10%;
                        height: 70px;
                        .extreme_num{
                            font-size: 36px;
                            line-height: 36px;
                            color: #67C23A;
                        }
                        .extreme_txt{
                            margin-top: 6px;
                            font-size: 14px;
                            line-height: 14px;
                            color: #909399;
                        }
                    }
                }
                .hr{
                    width: 68%;
                    height: 1px;
                    background-color: #DCDFE6;
                    margin: 0 auto;
                }
            }
        }
        .cooperation{
            margin-top: 20px;
            height: calc(30% - 20px);
            width: 100%;
            background-color: #fff;
            box-shadow: 0 5px 15px -5px rgba(0,0,0,0.5);
            border-radius: 10px;
            .cooperation_top{
                height: 60%;
                border-bottom: solid 1px #ccc;
                display: flex;
                align-items: center;
                .cooperation_info{
                    height: 100%;
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    .cooperation_title{
                        color: #909399;
                        font-size: 14px;
                    }
                    .cooperation_num{
                        font-size: 34px;
                        color: #303133;
                    }
                }
                .hr{
                    height: 50%;
                    width: 1px;
                    background-color: #E4E7ED;
                }
            }
            .cooperation_bottom{
                height: 40%;
                display: flex;
                align-items: center;
                justify-content: center;
                .cooperation_live_i{
                    width: 24px;
                    height: 24px;
                    background-color: #fff;
                    border: solid 3px #F56C6C;
                    border-radius: 20px;
                    .live_i{
                        margin: 5px;
                        width: 14px;
                        height: 14px;
                        border-radius: 7px;
                        background-color: #F56C6C;
                    }
                }
                .cooperation_live{
                    color: #909399;
                    font-size: 14px;
                    margin-left: 8px;
                }
                .cooperation_num{
                    color: #409EFF;
                    font-size: 40px;
                    margin-left: 10%;
                }
            }
        }
    }
}
    
</style>
