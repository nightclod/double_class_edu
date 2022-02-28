<template>
    <Frame :loading="loading">
        <div class="class_management">
            <div class="title">
                <h1>班级管理</h1>
                <div class="list_filter">
                    <div class="list_search">
                        <el-input v-model="search" size="small" prefix-icon="el-icon-search" placeholder="请输入用户名 / 班级" @change="refresh"></el-input>
                    </div>
                    <div class="list_add">
                        <el-button size="small" type="primary" @click="addClass">添加班级</el-button>
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
                        prop="username"
                        label="账号">
                        </el-table-column>
                        <el-table-column
                        prop="password"
                        label="密码">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="180">
                            <template slot-scope="props">
                                <el-button size="small" type="primary" plain @click="compileData(props.row)">编辑</el-button>
                                <el-button size="small" type="danger" plain @click="deteleData(props.row.id)">删除</el-button>
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
        <AddDialog ref="add_dialog" @getData="getData"></AddDialog>
    </Frame>
</template>

<script>
import Frame from '@/components/frame.vue'
import AddDialog from './add_dialog'
export default {
    name:'class_management',
    head:{
        title:"班级管理 - "
    },
    data() {
        return {
            loading:false,
            search:"",
            grades:['','一年级','二年级','三年级','四年级','五年级','六年级','初一','初二','初三','高一','高二','高三'],
            data:[],
            page:1,
            total:0,
        }
    },
    computed:{
    },
    components:{ 
        Frame,
        AddDialog
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
            this.$axios.post('account/list',{
                page:this.page,
                // name:this.search,
                // status:this.type
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
            this.$refs.add_dialog.open(data);
        },
        deteleData(id){
            if(this.loading){
                return
            }
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$axios.post('account/del',{
                    account_id:id
                }).then(res=>{
                    this.loading = false;
                    if(res.data.code && res.data.code != 0){
                        this.$message.error(res.data.msg);
                    }else{
                        if(this.total == 1 && this.page > 1){
                            this.page --;
                        }
                        this.getData();
                    }
                }).catch(err=>{
                    this.loading = false;
                    console.log(err)
                    if(!err || err.message !== null){
                        this.$message.error("删除数据失败");
                    }
                });
            });
        },
        addClass(){
            this.$refs.add_dialog.open();
        },
    },
    mounted() {
        this.getData();
    }
}
</script>

<style lang="scss" scoped="scoped"> 
.class_management{
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
            .list_search{
                margin-right: 40px;
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


