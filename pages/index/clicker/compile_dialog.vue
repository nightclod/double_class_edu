<template>
<div class="compile_device_dialog">
    <el-dialog
        title="编辑答题器"
        :visible.sync="dialogVisible"
        :close-on-click-modal='false'
        top="15vh"
        width="30%"
        v-loading="loading">
        <div class="info">
            <div class="list">
                <label>答题器ID：</label>
                <div class="detail">
                    <el-select 
                        v-model="clicker_id" 
                        placeholder="请选择"
                        ref="clicker_id">
                        <el-option 
                            v-for="(l,i) in clicker_list" 
                            :disabled="l.id == init_id"
                            :key="i" 
                            :label="l.facility_id"
                            :value="l.facility_id">
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
            clicker_id:null,
            clicker_list:[]
        }
    },
    
    methods: {
        open(data){//打开页面
            this.id = data.id || null;
            
            this.clicker_id = data.facility || "";
            this.init_id = data.facility || "";
            
            this.dialogVisible = true;
            this.getClickData();
        },
        
        verify(){//验证数据
            if(this.clicker_id === '' ){
                this.$message.error("请选择答题器");
                this.$refs.clicker_id.focus();
                return
            }
            if(this.clicker_id === this.init_id ){
                this.$message.error("请选择其他答题器");
                this.$refs.clicker_id.focus();
                return
            }
            this.postData();
        },
        postData(){//提交数据
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post('/click/bind',{
                student_id  : this.id,
                facility_id : this.clicker_id
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
        getClickData(){//获取答题器列表数据
            if(this.loading){
                return
            }
            this.loading = true;
            this.$axios.post('/click/part').then(res=>{
                this.loading = false;
                if(res.data.code && res.data.code != 0){
                    this.$message.error(res.data.msg);
                }else{
                    this.clicker_list = res.data.obj;
                }
            }).catch(err=>{
                this.loading = false;
				console.log(err)
                if(!err || err.message !== null){
                    this.$message.error("获取列表数据失败");
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
