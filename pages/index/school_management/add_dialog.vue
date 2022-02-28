<template>
<div class="add_school_dialog">
    <el-dialog
        title="添加学校"
        :visible.sync="dialogVisible"
        :close-on-click-modal='false'
        top="15vh"
        width="35%" 
        v-loading="loading">
        <div class="info">
            <div class="list">
                <label>选择学校：</label>
                <div class="detail">
                    <el-select
                        v-model="school"
                        ref="school"
                        filterable
                        remote
                        placeholder="请输入学校"
                        :remote-method="remoteMethod"
                        :loading="loading_">
                        <el-option
                            v-for="(l,i) in schools"
                            :key="i"
                            :label="l.title"
                            :value="l.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="list">
                <label>关联年级：</label>
                <div class="detail">
                    <el-select multiple
                    v-model="grade" 
                    placeholder="请选择"
                    ref="grade">
                        <el-option 
                        v-for="(l,i) in grades" 
                        :key="i" 
                        :label="l"
                        :value="i + 1"></el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="medium">返回</el-button>
            <el-button @click="verify" type="primary" size="medium">确定</el-button>
        </span>
    </el-dialog>
</div>
    
</template>

<script>
export default {
    name:'add_school_dialog',
    data() {
        return {
            dialogVisible:false,
            loading:false,
            loading_:false,
            school:null,
            schools:[],
            restaurants:[],
            grade:[],
            grades:['一年级','二年级','三年级','四年级','五年级','六年级','初一','初二','初三','高一','高二','高三'],
        }
    },
    methods: {
        remoteMethod(query){
            if (query !== '') {
                this.loading_ = true;
                this.$axios.post('/relation/school',{
                    search : query
                }).then(res=>{
                    this.loading_ = false;
                    if(res.data.code && res.data.code != 0){
                        this.$message.error(res.data.msg);
                    }else{
                        
                        this.schools = res.data.obj;
                    }
                }).catch(err=>{
                    this.loading_ = false;
                    console.log(err)
                    this.$message.err('获取学校列表失败');
                });
            } else {
                this.schools = [];
            }
        },
        open(){//打开页面
            this.dialogVisible = true;
            this.school = null;
            this.grade = [];
        },
        verify(){//验证数据
            if(this.school === '' || this.school === null){
                this.$message.error("请选择学校");
                this.$refs.school.focus();
                return
            }
            this.postData();
        },
        postData(){//提交数据
            if(this.loading){
                return
            }
            this.loading = true;
           
            this.$axios.post('/relation/add',{
                school_id : this.school,
                grade_ids : this.grade.sort((a,b)=>{return a-b})
            }).then(res=>{
                this.loading = false;
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.$emit('getData');
                    this.dialogVisible = false;
                }
            }).catch(err=>{
                this.loading = false;
				console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("提交数据失败");
                }
            });
        },
    },
    mounted() {
    }
}
</script>

<style lang="scss" scoped="scoped"> 
.add_school_dialog{
    /deep/ .el-dialog{
        min-width: 400px;
        .el-dialog__body{
            padding: 0 15px 20px;
            background-color: #f7f7f7;
            border-top: solid 1px #e8e8e8;
            border-bottom: solid 1px #e8e8e8;
            max-height: 530px;
            overflow: auto;
        }
    }
    .info{
        font-size: 16px;
        background: #fff;
        margin-top: 15px;
        padding: 20px 25px 10px;
        box-sizing: border-box;
        box-shadow: 0 5px 15px -5px rgba(0,0,0,0.5);
        border-radius: 10px;
        .list{
            display: flex;
            line-height: 40px;
            margin-bottom: 14px;
            label{
                width: 100px;
                flex-shrink: 0;
            }
            .detail{
                flex:1;
                >div{
                    width: 100%;
                }
            }
        }
    }
 }
</style>
