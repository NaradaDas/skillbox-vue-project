<template lang="">
  <div>
    <div v-if="sending"><img :src="PRELOADER_SMOLL_URL" alt="Прелоадер" /></div>
    <slot v-else-if="failed" />
  </div>
</template>
<script>
import { PRELOADER_SMOLL_URL } from '@/config';

export default {
  data() {
    return {
      PRELOADER_SMOLL_URL,
    };
  },
  props: ['sending', 'failed'],
};
</script>
<style>
.button__loader {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -20px;
}
</style>
