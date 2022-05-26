<template lang="">
  <OrderFormField :label-text="labelText">
  <!-- eslint-disable-next-line -->
    <textarea
      class="form__input form__input--area"
      v-model="value"
      :placeholder="placeholderText"
    ></textarea>
  </OrderFormField>
</template>
<script>
import formFieldMixin from '@/mixins/formFieldMixin';

export default {
  mixins: [formFieldMixin],
};
</script>
