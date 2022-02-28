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
                    <el-cascader
                    placeholder="请选择班级"
                    v-model="class_info"
                    :options="class_list"
                    :props="{ multiple: true }"
                    ref="class_info"
                    clearable></el-cascader>
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

            
            class_info:[],
            class_list:[{
                value:1,
                label:'一年级',
                children:[{
                    value:1,
                    label:'一班'
                },{
                    value:2,
                    label:'二班'
                }]
            },{
                value:2,
                label:'二年级',
                children:[{
                    value:1,
                    label:'一班'
                },{
                    value:2,
                    label:'二班'
                },{
                    value:3,
                    label:'三班'
                }]
            }],
            title_info:""
        }
    },
    methods: {
        open(){//打开页面
            this.title_info = "",
            this.class_info = [];
            this.dialogVisible = true;
        },
        
        verify(){//验证数据
            if(this.title_info === '' || this.title_info === null ){
                this.$message.error("请填写标题");
                this.$refs.title_info.focus();
                return
            }
            if(this.class_info === [] || this.class_info === null){
                this.$message.error("请选择班级");
                this.$refs.class_info.focus();
                return
            }
           
            
            this.postData();
        },
        postData(){//提交数据
            if(this.loading){
                return
            }
            // this.loading = true;
           
            // this.$axios.post('/commission/save',{
            //     id : this.school,
            //     grade:this.grade.sort((a,b)=>{return a-b})
            // }).then(res=>{
            //     this.loading = false;
            //     if(res.data.code && res.data.code != 0){
            //         this.$message.error(res.data.msg);
            //     }else{
            //         this.$parent.getData();
            //         this.dialogVisible = false;
            //     }
            // }).catch(err=>{
            //     this.loading = false;
			// 	console.log(err)
            //     if(!err || err.message !== null){
            //         this.$message.error("提交数据失败");
            //     }
            // });
        },
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
