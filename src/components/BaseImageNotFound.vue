<template lang="">
  <div style="position: relative">
    <img :src="ERROR_IMAGE_URL" alt="Ошибка" />
    <div :class="{ 'basket-item': pageName === 'basket' }" class="error-text">
      Не удалось найти изображение
    </div>
  </div>
</template>
<script>
import { ERROR_IMAGE_URL } from '@/config';
import { useRoute } from 'vue-router';

export default {
  data() {
    return {
      ERROR_IMAGE_URL,
      pageName: useRoute().name,
    };
  },
};
</script>
<style>
.error-text {
  position: absolute;
  font-size: 20px;
  top: 15px;
  left: 10px;
  right: 10px;
  color: red;
  font-weight: 600;
  word-spacing: 4px;
  letter-spacing: 3px;
  line-height: 1.5em;
}

.basket-item {
  font-size: 10px;
  left: 0px;
  right: 0px;
  top: 4px;
  word-spacing: 0;
  letter-spacing: 0;
  line-height: 1.1em;
}
</style>
