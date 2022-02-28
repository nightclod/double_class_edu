<template>
<div class="add_class_dialog">
    <el-dialog
        :title="(add ? '添加' : '编辑') + '班级'"
        :visible.sync="dialogVisible"
        :close-on-click-modal='false'
        top="15vh"
        width="30%" 
        v-loading="loading">
        <div class="info">
            <div class="list">
                <label>班级：</label>
                <div class="detail">
                    <el-select 
                    v-model="class_info" 
                    placeholder="请选择"
                    ref="class_info">
                        <el-option 
                            v-show="!add"
                            :label="compile.class_name"
                            :value="compile.class_id">
                        </el-option>
                        <el-option 
                            v-for="(l,i) in class_list" 
                            :key="i" 
                            :label="l.grade + l.name"
                            :value="l.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="list">
                <label>账号：</label>
                <div class="detail">
                    <el-input :maxlength="20"
                    :disabled='!add'
                    v-model="account" 
                    placeholder="由5-20位字母数字下划线组成"
                    ref="account"></el-input>
                </div>
            </div>
            <div class="list">
                <label>密码：</label>
                <div class="detail">
                    <el-input :maxlength="20"
                    :disabled='!add'
                    v-model="password" 
                    placeholder="由5-20位字母数字下划线组成"
                    ref="password"></el-input>
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
            add:true,
            compile:{class_name:'',class_id:''},
            class_info:null,
            class_list:[],
            account:"",
            password:"",
            id:null
        }
    },
    watch:{
        account:function(value){
            if(value) {
			    this.account = value.replace(/[^\w]/g,'');
		    }
        },
        password:function(value){
            if(value) {
			    this.password = value.replace(/[^\w]/g,'');
		    }
        },
    },
    methods: {
        open(data){//打开页面
            this.getClassData();
            if(data){
                this.add = false;
                this.class_info = data.class_id;
                this.account = data.username;
                this.password = data.password;
                this.compile.class_name = data.class_name;
                this.compile.class_id = data.class_id;
                this.id = data.id;
            }else{
                this.add = true;
                this.class_info = null;
                this.account = '';
                this.password = '';
                this.id = null;
            }
            this.dialogVisible = true;
        },
        
        verify(){//验证数据
            if(this.class_info === '' || this.class_info === null){
                this.$message.error("请选择班级");
                this.$refs.class_info.focus();
                return
            }
            if(this.account === '' || this.account === null || this.account.length < 5){
                this.$message.error("5-20位字母数字下划线组成");
                this.$refs.account.focus();
                return
            }
            if(this.password === '' || this.password === null || this.password.length < 5){
                this.$message.error("5-20位字母数字下划线组成");
                this.$refs.password.focus();
                return
            }
            this.postData();
        },
        postData(){//提交数据
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post(this.add ? '/account/add' : '/account/bind',{
                class_id : this.class_info,
                username : this.account,
                password : this.password,
                account_id : this.id
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
        getClassData(){//获取班级列表
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post('/account/class').then(res=>{
                this.loading = false;
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.class_list = res.data.obj;
                }
            }).catch(err=>{
                this.loading = false;
				console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取班级列表数据失败");
                }
            });
        }
    },
    mounted() {
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
                width: 60px;
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
