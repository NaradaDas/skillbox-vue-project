<template lang="">
  <BaseProductView :product-id="productId" />
</template>

<script>
import { defineComponent } from 'vue';
import BaseProductView from '@/components/BaseProductView.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: {
    BaseProductView,
  },
  setup() {
    localStorage.setItem('categoryId', 0);
    return {
      productId: useRoute().params.id,
    };
  },
});
</script>
