<template>
    <div class="echarts"
        :id="id"
        ref="chart"
        :style=" (width ? ('width:' + width + 'px;' ) : '') + (height ? ('height:' + height + 'px;' ) : '')">
    </div>
</template>
<script type="text/javascript">
export default {
    name: "Echarts",
    data() {
        return {
            id:"chart",
            width:"",
            height:"",
            data:{},
            chart:null, 
        };
    },
    methods: {
        getData(data,id,width,height){//数据、id、宽度、高度
            this.data = data;
            this.id = id || "chart";
            this.width = width || "";
            this.height =  height || "";
            this.$nextTick(()=>{
                if(this.chart){//只更变数据
                    let y_info = [];
                    for(let i of data.y){
                        y_info.push({
                            name:i.name,
                            data:i.data
                        })
                    }
                    this.chart.setOption({
                        xAxis: {
                            data: data.x,
                        },
                        series: y_info
                    });
                }else{//初始化
                    this.chart = this.$echarts.init(document.getElementById(this.id));
                    this.chart.setOption(this.echartsOption(data));
                    if(data.configuration){//额外配置项
                        this.chart.setOption(data.configuration);
                    }
                    this.Listening();
                }
            })
        },
        init(option,id = "chart",width = "",height = "",type = false){//自定义图表
            this.id = id;
            this.width = width;
            this.height =  height;
            this.$nextTick(()=>{
                if(!this.chart){
                    this.chart = this.$echarts.init(document.getElementById(this.id));
                }
                this.chart.setOption(option,type);
            })
        },
        echartsOption({title="", type="line", x, y, unit="", color}){//echarts 配置 
            let y_info = [],y_axis=[{
                type: 'value',
                axisTick:{show:false},
                axisLabel:{formatter: '{value}' + ( unit ? ("(" + unit + ")") : '')}
            }];
            for(let i of y){
                let jsons = {
                    name:i.name,
                    type:type,
                    data:i.data,
                    itemStyle:{}
                }
                if(type === "bar"){
                    jsons.barMaxWidth = "8";
                    jsons.itemStyle.borderRadius = [6, 6, 0, 0];
                }
                if(color){
                    jsons.itemStyle.color = color;
                }
                if(i.yAxisIndex){
                    jsons.yAxisIndex = i.yAxisIndex;
                    y_axis.push({
                        type: 'value',
                        axisTick:{show:false},
                        axisLabel:{
                            formatter: '{value}' + ( unit ? ("(" + unit + ")") : ''),
                        }
                    })
                }
                y_info.push(jsons)
            }
            let echarts = {
                title: {
                    text: title,
                    show: !!title
                },
                legend:{
                    show: y.length == 1 ? false : true,
                    top:10
                },
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
                        margin:20,
                        formatter: function (value, index) {
                            return value.length > 10 ? (value.substring(0, 10) + '...') : value
                        }
                    }
                },
                yAxis: y_axis,
                series: y_info
            }
            return echarts
        },
        Listening(){
            // window.onresize = ()=>{
            //     this.resize();
            // }
        },
        resize(data){
            if(this.chart){
                this.chart.resize(data);
            }
        }
    },
    mounted() {
    }
};
</script>
<style lang="scss" scoped="scoped">
    .echarts{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>