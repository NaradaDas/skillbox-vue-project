<template lang="">
  <!-- eslint-disable-next-line -->
  <label class="form__label">
    <slot />
    <span class="form__value">{{ labelText }}</span>
    <span v-if="errorText" class="form__error">{{ errorText }}</span>
  </label>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['labelText', 'errorText'],
  setup() {
    return {};
  },
});
</script>
<style lang=""></style>
