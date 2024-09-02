<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <router-link :to="{name: 'home'}" class="navbar-brand">King of Bots</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
                aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarText">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link :to="{name:'pk_index'}" :class="route_name == 'pk_index' ? 'nav-link active' : 'nav-link'">对战</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{name:'record_index'}" :class="route_name == 'record_index' ? 'nav-link active' : 'nav-link'">对局记录</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{name:'ranklist_index'}" :class="route_name == 'ranklist_index' ? 'nav-link active' : 'nav-link'">排行榜</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            DanceMn
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                            <router-link :to="{name:'userbot_index'}" class="dropdown-item">我的Bot</router-link>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                            <router-link :to="{name:'home'}" class="dropdown-item">退出</router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { useRoute } from 'vue-router' // 获取当前路由
import { computed } from 'vue'; // 用于实时计算变量

export default {
    setup() {
        const route = useRoute();
        let route_name = computed(() => route.name)

        return {
            route_name
        }
    }
}
</script>

<!-- scoped的作用是让样式只在当前文件内生效 -->
<style scoped></style>