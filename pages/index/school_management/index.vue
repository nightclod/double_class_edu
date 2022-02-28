<template>
    <Frame :loading="loading">
        <div class="school_management">
            <div class="title">
                <h1>学校管理</h1>
                <div class="list_filter">
                    <div class="list_search">
                        <el-input v-model="search" prefix-icon="el-icon-search" size="small" placeholder="请输入学校" @change="refresh"></el-input>
                    </div>
                    <div class="list_add">
                        <el-button size="small" type="primary" @click="addSchool">添加学校</el-button>
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
                        prop="school_title"
                        label="学校名称">
                        </el-table-column>
                        <el-table-column
                        prop="region"
                        label="地区">
                            <template slot-scope="props">
                                {{ props.row.province + props.row.city }}
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="username"
                        label="关联年级"
                        min-width="160">
                            <template slot-scope="props">
                                <div class="relevance_grade">
                                    <div class="relevance_li" v-for="(l,i) in props.row.grade_ids" :key="i">
                                        <div class="rel_popover">
                                            <el-popover
                                                placement="bottom"
                                                :disabled="props.row.grade_ids.length >= 12"
                                                popper-class="relevance_popover"
                                                :ref="'rel_' + props.row.id + '_' + i"
                                                width="90"
                                                trigger="click">
                                                <ul class="relevance_list">
                                                    <li v-for="(m,n) in grades" 
                                                    :key="n" 
                                                    v-show="n !== 0 && !props.row.grade_ids.includes(n)"
                                                    @click="compileGrade(props.row,i,n)"> {{ m }} </li>
                                                </ul>
                                                <div slot="reference" class="rel_popover_i">
                                                    <b>{{ grades[l] }}</b><i class="el-icon-edit"></i>
                                                </div>
                                            </el-popover>
                                        </div>
                                        <div class="rel_detele" @click="deteleGrade(props.row,i)">
                                            <i class="el-icon-close"></i>
                                        </div>
                                    </div>
                                    <div class="relevance_add">
                                        <el-popover
                                        placement="bottom"
                                        popper-class="relevance_popover"
                                        :disabled="props.row.grade_ids.length >= 12"
                                        :ref="'rel_' + props.row.id "
                                        width="90"
                                        trigger="click">
                                            <ul class="relevance_list">
                                                <li v-for="(j,k) in grades" 
                                                :key="k" 
                                                v-show="k !== 0 && !props.row.grade_ids.includes(k)"
                                                @click="addGrade(props.row,k)"> {{ j }} </li>
                                            </ul>
                                            <div slot="reference" class="rel_popover_i" :class="{'disabled' : props.row.grade_ids.length >= 12}">
                                                <i class="el-icon-circle-plus-outline"></i>
                                            </div>
                                        </el-popover>
                                        
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="created_at"
                        label="添加时间">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="90">
                            <template slot-scope="props">
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
        <AddDialog ref="add_dialog" @getData='getData'></AddDialog>
    </Frame>
</template>

<script>
import Frame from '@/components/frame.vue'
import AddDialog from './add_dialog'
export default {
    name:'school_management',
    head:{
        title:"学校管理 - "
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
            this.$axios.post('/relation/list',{
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
        compileGrade(data,i,n){//编辑关联年级
            if(this.loading){
                return
            }
            this.$refs['rel_' + data.id + '_' + i][0].doClose();
            let nums = JSON.parse(JSON.stringify(data.grade_ids));
            nums.splice(i,1,n);
            let infos = nums.sort((a,b)=>{return a-b});
            this.replaceData(data.id,infos,()=>{
                this.$set(data,'grade_ids',infos);
            });
        },
        deteleGrade(data,i){//删除关联年级
            if(this.loading){
                return
            }
            this.$refs['rel_' + data.id + '_' + i][0].doClose();
            let nums = JSON.parse(JSON.stringify(data.grade_ids));
            nums.splice(i,1);
            this.replaceData(data.id,nums,()=>{
                this.$set(data,'grade_ids',nums);
            });
        },
        addGrade(data,k){//添加关联年级
            if(this.loading){
                return
            }
            this.$refs['rel_' + data.id ].doClose();
            let nums = JSON.parse(JSON.stringify(data.grade_ids));
            nums.push(k);
            let infos = nums.sort((a,b)=>{return a-b});
            this.replaceData(data.id,infos,()=>{
                this.$set(data,'grade_ids',infos);
            });
        },
        replaceData(id,data,cb){//编辑关联年级
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post('relation/replace',{
                relation_id : id,
                grade_ids : data
            }).then(res=>{
                this.loading = false;
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    cb && cb();
                }
            }).catch(err=>{
                this.loading = false;
                console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("修改数据失败");
                }
            });
        },
        deteleData(id){//删除学校
            if(this.loading){
                return
            }
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loading = true;
                this.$axios.post('relation/del',{
                    relation_id:id
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
        addSchool(){//添加学校
            this.$refs.add_dialog.open();
        },
        
    },
    mounted() {
        this.getData();
    }
}
</script>

<style>
    .relevance_popover{
        min-width: 0;
        padding: 8px 0;
    }
</style>
<style lang="scss" scoped="scoped"> 
.school_management{
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
            .relevance_grade{
                display: flex;
                flex-wrap: wrap;
                .relevance_li{
                    margin: 8px 10px 6px 0;
                    display: flex;
                    align-items: center;
                    border: solid 1px #d9ecff;
                    background-color: #ecf5ff;
                    color: #409eff;
                    border-radius: 4px;
                    height: 24px;
                    line-height: 22px;
                    padding: 0 6px 0 8px;
                    position: relative;
                    font-size: 12px;
                    &:hover{
                        .rel_detele{
                            display: block;
                        }
                    }
                    .rel_popover{
                        .rel_popover_i{
                            cursor: pointer;
                            i{
                                margin-left: 6px;
                                line-height: 16px;
                                font-size: 12px;
                            }
                        }
                    }
                    .rel_detele{
                        display: none;
                        position: absolute;
                        transform: scale(0.8);
                        top: -8px;
                        right: -8px;
                        color: #fff;
                        background-color: #F56C6C;
                        height: 16px;
                        width: 16px;
                        border-radius: 8px;
                        line-height: 15px;
                        text-align: center;
                        cursor: pointer;
                        &:hover{
                            background-color: #c11b1b;
                        }
                        i{
                            
                            line-height: 16px;
                            font-size: 12px;
                        }
                    }
                }
                .relevance_add{
                    height: 24px;
                    margin-top: 8px;
                    .rel_popover_i{
                        height: 24px;
                        cursor: pointer;
                        i{
                            
                            line-height: 24px;
                            font-size: 24px;
                        }
                    }
                    .disabled{
                        color: #aaa;
                        cursor:no-drop;
                        
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
.relevance_list{
    li{
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: #606266;
        cursor: pointer;
        &:hover{
            background-color: #f5f7fa;
        }
    }
    
}

    
</style>


