<template>
<div class="add_class_dialog">
    <el-dialog
        title="发起会议"
        :visible.sync="dialogVisible"
        :close-on-click-modal='false'
        top="15vh"
        width="40%" 
        v-loading="loading">
        <div class="info">
            <div class="list">
                <label>标题：</label>
                <div class="detail">
                    <el-input :maxlength="20"
                    v-model="title_info" 
                    placeholder="请输入标题"
                    ref="title_info"></el-input>
                </div>
            </div>
            <div class="list">
                <label>关联年级：</label>
                <div class="detail">
                    <el-select 
                        multiple
                        placeholder="请选择年级"
                        v-model="grade_info"
                        ref="grade_info"
                        @change="gradeChange"
                        clearable>
                        <el-option
                            v-for="(l,i) in grade_list"
                            :key="i"
                            :label="l.name"
                            :value="l.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="list">
                <label>关联学校：</label>
                <div class="detail">
                    <el-select 
                        multiple
                        placeholder="请选择学校"
                        v-model="school_info"
                        ref="school_info"
                        :loading="school_loading"
                        :disabled="school_disabled"
                        clearable>
                        <el-option
                            v-for="(l,i) in school_list"
                            :key="i"
                            :label="l.title"
                            :value="l.id">
                        </el-option>
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
    name:'add_class_dialog',
    data() {
        return {
            dialogVisible:false,
            loading:false,
            school_loading:false,
            school_disabled:true,
            grade_info:[],
            grade_list:[],
            school_info:[],
            school_list:[],
            title_info:""
        }
    },
    methods: {
        open(){//打开页面
            this.title_info = "",
            this.grade_info = [];
            this.school_info = [];
            this.school_list = [];
            this.school_loading = false;
            this.school_disabled = true;
            this.dialogVisible = true;
        },
        gradeChange(){//年级修改
            this.school_info = [];
            if(this.grade_info.length == 0){
                this.school_disabled = true;
            }else{
                this.school_disabled = false;
                this.getSchoolData();
            }
        },
        
        verify(){//验证数据
            if(this.title_info === '' || this.title_info === null ){
                this.$message.error("请填写标题");
                this.$refs.title_info.focus();
                return
            }
            if(this.grade_info.length == 0 || this.grade_info === null){
                this.$message.error("请选择年级");
                this.$refs.grade_info.focus();
                return
            }
            if(this.school_info.length == 0 || this.school_info === null){
                this.$message.error("请选择学校");
                this.$refs.school_info.focus();
                return
            }
            this.postData();
        },
        postData(){//提交数据
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post('/meeting/add',{
                title : this.title_info,
                school_ids : this.school_info,
                grade_ids : this.grade_info
            }).then(res=>{
                this.loading = false;
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.$emit('meetAdd',res.data.obj.room)
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
        getGradeData(){//获取年级数据
            this.$axios.post('/meeting/grade').then(res=>{
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.grade_list = res.data.obj;
                }
            }).catch(err=>{
				console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取年级数据失败");
                }
            });
        },
        getSchoolData(){//获取学校数据
            this.school_loading = true;
            this.$axios.post('/meeting/school',{
                grade_ids:this.grade_info
            }).then(res=>{
                 this.school_loading = false;
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.school_list = res.data.obj;
                }
            }).catch(err=>{
                 this.school_loading = false;
				console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取学校数据失败");
                }
            });
        },
    },
    mounted() {
        this.getGradeData();
    }
}
</script>

<style lang="scss" scoped="scoped"> 
.add_class_dialog{
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
                width: 90px;
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
