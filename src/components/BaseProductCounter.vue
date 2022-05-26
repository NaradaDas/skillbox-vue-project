<template lang="">
  <div class="form__counter">
    <button
      :class="{ counter_disabled: productAmount <= 1 }"
      type="button"
      aria-label="Убрать один товар"
      :disabled="productAmount <= 1"
      @click.prevent="productAmount--"
    >
      <svg class="button__plus" width="12" height="12" fill="currentColor">
        <path d="M8.287 2.574H.7V.765h7.587v1.809z" />
      </svg>
    </button>
    <!-- eslint-disable-next-line -->
    <input type="number" v-model.number="productAmount" name="count" />
    <button
      type="button"
      aria-label="Добавить один
                                товар"
      @click.prevent="productAmount++"
    >
      <svg width="12" height="12" fill="currentColor">
        <path
          d="M6.524 11.086h-1.43v-4.51H.54V5.102h4.554V.57h1.43v4.532h4.554v1.474H6.524v4.51z"
        />
      </svg>
    </button>
  </div>
</template>
<script>
export default {
  props: ['quantity'],
  emits: ['update:quantity', 'update:error', 'changeAmount'],
  computed: {
    productAmount: {
      get() {
        return this.quantity;
      },
      set(value) {
        // eslint-disable-next-line
        value < 1 ? this.$emit('update:error', true) : this.$emit('update:error', false);
        this.$emit('update:quantity', value);
        this.$emit('changeAmount');
      },
    },
  },
};
</script>
<style>
.button__plus {
  transform: translate(1px, 5px);
}
.counter_disabled:hover {
  background-color: red !important;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
</style>
