<template>
  <div>
    <div>Bot</div>
    <div>昵称：{{ bot_name }}</div>
    <div>战力：{{ bot_rating }}</div>
  </div>
  <router-view/>
</template>

<script>
import $ from 'jquery'; // 引入 jQuery 库，用于发送 AJAX 请求。
import { ref } from 'vue'; // 引入 ref 函数，用于创建响应式变量

export default {
  name: 'App',
  setup: () => { // setup 函数是一个可选的钩子函数，它可以在组件实例化之前执行一些初始化操作。是整个组件的入口点。
    let bot_name = ref(''); // 响应式变量，为了获取后端数据，需要将数据作为响应式变量传入，这样才能在模板中使用。
    let bot_rating = ref('');

    $.ajax({ // 发送 AJAX 请求，获取后端数据。
      url: 'http://localhost:8088/pk/getbotinfo/', // 后端 API 地址
      method: 'GET',
      success: function (data) {
        console.log(data);
        bot_name.value = data.name;
        bot_rating.value = data.rating;
      }
    });

    return {
      bot_name,
      bot_rating
    }
  }
}
</script>

<style>
</style>
