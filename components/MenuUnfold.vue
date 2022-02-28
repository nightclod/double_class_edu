<template>
    <div class="mun" 
        :class="munif ? 'incline' : ''" 
        @click="muns" 
        :style="'transform:scale(' + (menuwidth / 80) + ');'"
    >
        <div class="line" :style="'background-color: ' + color"></div>
        <div class="line" :style="'background-color: ' + color"></div>
        <div class="line" :style="'background-color: ' + color"></div>
    </div>
</template>

<script>
// 默认黑色，宽高80px
export default {
    name:'menubut',
    props: {
        menuwidth: {
            type: Number
        },
        color: {
            type: String
        }
    },
    data() {
        return {
            munif:false
        }
    },
    methods: {
        muns(){
            this.munif = this.munif ? false : true;
            this.$emit("menuclick", this.munif);
        }
    }
}
</script>

<style lang="scss">
.mun{
    cursor:pointer;
    font-size: 80px;
    width: 80px;
    height: 80px;
    position: relative;
    transform-origin: 0 0;
    .line{
        position: absolute;
        width: 80px;
        height: 4px;
        border-radius: 2px;
        background-color: #000;
        transform-origin:80px;
        transition:all 0.4s;
        &:nth-child(1){
            top:18px;
        }
        &:nth-child(2){
            top:38px;
        }
        &:nth-child(3){
            top:58px;
        }
    }
}
.incline{
    .line{
        &:nth-child(1){
            width: 35px;
            transform:translate(32px, -12px) rotate(-45deg);
        }
        &:nth-child(3){
            width: 35px;
            transform:translate(32px,12px)rotate(45deg)
        }
    }
}
</style>
