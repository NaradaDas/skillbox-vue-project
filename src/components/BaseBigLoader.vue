<template lang="">
  <div v-bind="$attrs" v-if="loading"><img :src="PRELOADER_BIG_URL" alt="Прелоадер" /></div>
  <slot v-bind="$attrs" v-else />
</template>
<script>
import { PRELOADER_BIG_URL } from '@/config';

export default {
  data() {
    return {
      PRELOADER_BIG_URL,
    };
  },
  props: ['loading', 'failed'],
};
</script>
<style lang=""></style>
