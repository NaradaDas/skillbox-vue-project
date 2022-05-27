<template lang="">
  <div v-bind="$attrs" v-if="loading"><img :src="PRELOADER_BIG_URL" alt="Прелоадер" /></div>
  <slot v-bind="$attrs" v-else-if="failed" />
</template>
<script>
import { PRELOADER_BIG_URL } from '@/config';
import { useRoute, useRouter } from 'vue-router';
import { defineComponent, watch, toRef } from 'vue';

export default defineComponent({
  props: ['loading', 'failed'],
  setup(props) {
    const failed = toRef(props, 'failed');
    const pageName = useRoute().name;
    const router = useRouter();

    watch(
      () => failed.value,
      (value) => {
        if (value && pageName === 'product') {
          router.push({ name: 'notFound' });
        }
      },
    );
    return {
      PRELOADER_BIG_URL,
    };
  },
});
</script>
<style lang=""></style>
