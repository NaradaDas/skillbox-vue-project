<template>
  <BaseHeader />
  <router-view :key="$route.fullPath" />
  <BaseFooter />
  <div id="teleport-target"></div>
</template>

<script>
import BaseHeader from '@/components/BaseHeader.vue';
import BaseFooter from '@/components/BaseFooter.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { BaseHeader, BaseFooter },
  setup() {
    localStorage.setItem('categoryId', 0);
  },
});
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
