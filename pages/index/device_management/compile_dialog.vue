<template>
<div class="compile_device_dialog">
    <el-dialog
        title="编辑设备"
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
                            v-for="(l,i) in class_list" 
                            :disabled="l.id == init_id"
                            :key="i" 
                            :label="l.grade + l.name"
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
    name:'compile_device_dialog',
    data() {
        return {
            dialogVisible:false,
            loading:false,
            init_id:null,
            class_info:null,
            class_list:[],
            id:null
        }
    },
    
    methods: {
        open(data){//打开页面
            this.id = data.id || null;
            this.class_info = "";
            this.init_id = "";
            this.dialogVisible = true;
            this.getClassData({
                id:"",
                grade:data.grade,
                name:data.class
            });
        },
        
        verify(){//验证数据
            if(this.class_info === ''){
                this.$message.error("请选择其他班级");
                this.$refs.class_info.focus();
                return
            }
            this.postData();
        },
        postData(){//提交数据
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post('/facility/bind',{
                box_id : this.id,
                class_id:this.class_info
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
        getClassData(data){//获取年级列表数据
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post('/facility/class').then(res=>{
                this.loading = false;
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.class_list = [data,...res.data.obj];
                }
            }).catch(err=>{
                this.loading = false;
				console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取年级数据失败");
                }
            });
        },
    },
    
    mounted() {
    }
}
</script>

<style lang="scss" scoped="scoped"> 
.compile_device_dialog{
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
