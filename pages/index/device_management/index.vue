<template>
    <Frame :loading="loading">
        <div class="device_management">
            <div class="title">
                <h1>设备管理</h1>
                <div class="list_filter">
                    <div class="list_search">
                        <el-input v-model="search" size="small" prefix-icon="el-icon-search" placeholder="请输入设备号 / 班级" @change="refresh"></el-input>
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
                            prop="device"
                            label="设备号">
                        </el-table-column>
                        <el-table-column
                            label="班级">
                            <template slot-scope="props">
                                {{ props.row.grade + props.row.class }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="facility_count"
                            label="答题器数量">
                        </el-table-column>
                        <el-table-column
                            prop="duration"
                            label="时长">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="90">
                            <template slot-scope="props">
                                <el-button size="small" type="primary" plain @click="compileData(props.row)">编辑</el-button>
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
import CompileDialog from './compile_dialog'
export default {
    name:'device_management',
    head:{
        title:"设备管理 - "
    },
    data() {
        return {
            loading:false,
            search:"",
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
        refresh(){//刷新
            this.page = 1;
            this.getData();
        },
        getData(){//获取列表数据
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post('/facility/box',{
                page:this.page,
                // search:this.search
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
        compileData(data){
            this.$refs.compile_dialog.open(data);
        },
    },
    mounted() {
        this.getData();
    }
}
</script>


<style lang="scss" scoped="scoped"> 
.device_management{
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


