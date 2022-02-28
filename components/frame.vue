<template>
<div class="frame" v-loading="loading">
    <div class="data">
        <slot></slot>
    </div>
</div>
</template>

<script>
export default {
    props:{
        loading:{
            type:Boolean,
            default:false
        }
    }
}
</script>

<style scoped="scoped"> 
.frame{
    height: 100%;
    width: 100%;
    background-color: #f3f3f3;
    padding: 20px ;
    box-sizing: border-box;
    position: relative;
}
.data{
    background: #fff;
    padding:16px 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    box-shadow: 0 5px 15px -5px rgba(0,0,0,0.5);
    border-radius: 10px;
}
</style>
