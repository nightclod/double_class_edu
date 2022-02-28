<template>
    <Frame :loading="loading">
        <div class="clicker">
            <div class="title">
                <h1>答题器</h1>
                <div class="list_filter">
                    <div class="class_filter">
                        <el-cascader
                            size="small"
                            placeholder="请选择班级"
                            v-model="class_filter"
                            :props="class_props"
                            @change="refresh"
                            clearable>
                        </el-cascader>
                    </div>
                    <div class="unbund_button">
                        <el-button v-show="class_filter.length > 0"
                            @click="unbindClassData" 
                            type="warning" 
                            size="small" 
                            plain>全部解绑</el-button>
                    </div>
                    <div class="list_search">
                        <el-input v-model="search" size="small" prefix-icon="el-icon-search" placeholder="请输入答题器ID" @change="refresh"></el-input>
                    </div>
                </div>
            </div>
            
            <div class="list_info">
                <overlay-scrollbars class="list" :options='{className:"os-theme-thin-dark"}'>
                    <el-table
                    class="list_data"
                    :data="data"
                    style="width: 100%">
                        <el-table-column
                        prop="class_name"
                        label="班级">
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="名称">
                        </el-table-column>
                        <el-table-column
                        prop="facility"
                        label="答题器ID">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="170">
                            <template slot-scope="props">
                                <el-button size="small" type="primary" plain @click="compileData(props.row)">修改</el-button>
                                <el-button size="small" type="danger" plain @click="unbindData(props.row.facility)">解绑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
        <CompileDialog ref="compile_dialog" @getData="getData"></CompileDialog>
    </Frame>
</template>

<script>
import Frame from '@/components/frame.vue'
import CompileDialog from './compile_dialog.vue'
export default {
    name:'clicker',
    head:{
        title:"答题器 - "
    },
    data() {
        return {
            loading:false,
            search:"",
            class_filter:[],
            class_props:{
                lazy : true,
                lazyLoad : this.lazyLoad
            },
            data:[],
            page:1,
            total:0,
        }
    },
    computed:{
    },
    components:{ 
        Frame,
        CompileDialog
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
        refresh(){//刷新
            this.page = 1;
            this.getData();
        },
        getData(){//获取列表数据
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post('/click/list',{
                page:this.page,
                class_id:this.class_filter[1] || null
            }).then(res=>{
                this.loading = false;
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.total = res.data.obj.total;
                    this.data = res.data.obj.data;
                }
            }).catch(err=>{
                this.loading = false;
				console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取数据失败");
                }
            });
        },
        getGradeData(cb){//获取年级列表数据
            this.$axios.post('/click/grade').then(res=>{
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
        getClassData(data,cb){//获取班级列表数据
            this.$axios.post('/click/class',{
                grade:data.value
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
                    this.$message.error("获取班级数据失败");
                }
                cb && cb(null);
            });
        },
        unbindClassData(){//班级解绑
            if(this.loading){
                return
            }
            this.$confirm('确认解绑?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$axios.post('/click/unbind',{
                    class_id :this.class_filter[1]
                }).then(res=>{
                    this.loading = false;
                    if(res.data.code && res.data.code != 0){
                        this.$message.error(res.data.msg);
                    }else{
                        this.getData();
                    }
                }).catch(err=>{
                    this.loading = false;
                    console.log(err)
                    if(!err || err.message !== null){
                        this.$message.error("解绑数据失败");
                    }
                });
            });
        },
        unbindData(id){//个人解绑
            if(this.loading){
                return
            }
            this.$confirm('确认解绑?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$axios.post('/click/unbindStudent',{
                    facility_id :id
                }).then(res=>{
                    this.loading = false;
                    if(res.data.code && res.data.code != 0){
                        this.$message.error(res.data.msg);
                    }else{
                        this.getData();
                    }
                }).catch(err=>{
                    this.loading = false;
                    console.log(err)
                    if(!err || err.message !== null){
                        this.$message.error("解绑数据失败");
                    }
                });
            });
            
        },
        compileData(data){
            this.$refs.compile_dialog.open(data);
        },
        
        

        
        
    },
    mounted() {
        // this.getGradeData();
        this.getData();
    }
}
</script>

<style lang="scss" scoped="scoped"> 
.clicker{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .title{
        height: 42px;
        display: flex;
        justify-content: space-between;
        flex-shrink: 0;
        padding: 0 20px;
        h1{
            color: #333;
            font-size: 20px;
        }
        .list_filter{
            display: flex;
            .class_filter{
                width: 160px;
                margin-right: 10px;
            }
            .unbund_button{
                width: 80px;
                margin-right: 50px;
            }
        }
    }
    .list_info{
        flex: 1;
        overflow: hidden;
        flex-shrink: 0;
        .list{
            height: 100%;
            padding: 0 20px;
            .list_data{
                overflow: visible;
                /deep/ .el-table__header-wrapper{
                    position: sticky !important;
                    top: 0px;
                    z-index: 1;
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


