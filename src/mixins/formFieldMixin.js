import OrderFormField from '@/components/OrderFormField.vue';

export default {
  props: ['placeholderText', 'modelValue', 'labelText', 'errorText'],
  emits: ['update:modelValue'],
  components: { OrderFormField },
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
        return value;
      },
    },
  },

};
