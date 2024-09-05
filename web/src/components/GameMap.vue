<template>
    <div ref="parent" class="gamemap"> 
        <!-- ref="parent"，这样parent才能指向这个div -->
        <canvas ref="canvas" tabindex="0">
        </canvas>
    </div>
</template>

<script>
import { GameMap } from "../assets/scripts/GameMap.js"
import { ref, onMounted } from "vue"; 
// 引入ref，用于声明一个响应式变量
// 引入onMounted，用于在组件挂载后执行某些操作

export default {
    setup() {
        let parent = ref(null); // 访问值需要使用.value
        let canvas = ref(null);

        onMounted(() => {
            new GameMap(canvas.value.getContext('2d'), parent.value);
        });

        return { // 返回之后才能在template中使用
            parent,
            canvas
        }
    }
}
</script>

<style scoped>
div.gamemap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}
</style>