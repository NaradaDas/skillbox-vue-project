<template lang="">
  <OrderFormField :label-text="labelText" :error-text="errorValue">
  <!-- eslint-disable-next-line -->
    <input
      @input="updateErrorStatus"
      class="form__input"
      v-model="value"
      :type="placeholderText.includes('телефон') ? 'tel' : 'text'"
      :placeholder="placeholderText"
    />
  </OrderFormField>
</template>
<script>
import formFieldMixin from '@/mixins/formFieldMixin';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  mixins: [formFieldMixin],
  setup(props) {
    const errorValue = ref();

    const updateErrorStatus = (e) => {
      console.log(!!e.target.value.trim());
      errorValue.value = !e.target.value.trim() ? props.errorText : null;
    };

    watch(
      () => props.errorText,
      (value) => {
        errorValue.value = value;
      },
    );

    return {
      errorValue,
      updateErrorStatus,
    };
  },
});
</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
</style>
