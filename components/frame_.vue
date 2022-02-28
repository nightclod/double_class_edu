<template>
<div class="frame" v-loading="loading">
    <overlay-scrollbars class="scrollbar" ref="scrollbar" :options='option'>
        <div class="data" :style="scroll ? '' : 'overflow:hidden;height:calc(100% - 20px);'">
            <slot></slot>
        </div>
        <div style="height:20px;"></div>
    </overlay-scrollbars>
</div>
</template>

<script>
export default {
    props:{
        loading:{
            type:Boolean,
            default:false
        },
        scroll:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            option:{
                className:"os-theme-thin-dark",
                scrollbars:{
                    autoHide:"move"
                }
            },
            scrollbar:null
        }
    },
    mounted() {
        this.scrollbar = this.$refs.scrollbar.osInstance();
        // this.scrollbar_option = {
		// 	className : "os-theme-thin-dark",
        //     callbacks:{
        //         onScroll : this.handleScroll
        //     }
        // }
    }
}
</script>

<style scoped="scoped"> 
.frame{
    height: 100%;
    width: 100%;
    background-color: #f3f3f3;
}
.scrollbar{
    height: 100%;
    width: 100%;
    padding: 20px 20px 0;
    box-sizing: border-box;
}
.data{
    background: #fff;
    padding:16px 20px;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0 5px 15px -5px rgba(0,0,0,0.5);
    border-radius: 10px;
    min-height:calc(100% - 20px);
}
</style>
