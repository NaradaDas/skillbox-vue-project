<template lang="">
  <ul class="cart__list">
    <BasketListItem v-for="item in listData" :item-data="item" :key="item.id" />
  </ul>
  <div id="basket-teleport"></div>
</template>
<script>
import { defineComponent } from 'vue';
import BasketListItem from '@/components/BasketListItem.vue';

export default defineComponent({
  components: { BasketListItem },
  props: ['listData'],
  setup() {
    return {
    };
  },
});
</script>
