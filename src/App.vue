<script setup>
import { RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue';
import Header from './components/Header.vue';
import Aside from './components/Aside.vue';
</script>

<template>

    <div class="container_app">
        <!-- <Sidebar /> -->
        <!-- <HelloWorld /> -->
        <Aside />
        <main class="main-content">
            <div class="top-container">
                
                <Header />
            </div>
            <div class="bottom-container">
                <RouterView />
            </div>
        </main>
    </div>
</template>

<!-- <style scoped>
  @import '../public/'; /* injected */

</style>  -->
