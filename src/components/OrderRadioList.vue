<template lang="">
  <p class="options__error" v-if="error && !modelValue">Пожалуйста, сделайте выбор.</p>
  <ul class="cart__options options">
    <li v-for="(item, index) in variety" :key="index + item.id" class="options__item">
      <!-- eslint-disable-next-line -->
      <label class="options__label">
        <input
          class="options__radio sr-only"
          type="radio"
          :name="name"
          :value="item.id"
          @input="selectType"
          ref="selectElement"
        />
        <span class="options__value">
          {{ item.title }}
          <b v-if="item.price">{{ item.price == 0 ? 'бесплатно' : item.price + ' ₽' }} </b>
          <b v-else>при получении</b>.
        </span>
      </label>
    </li>
  </ul>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  props: ['variety', 'modelValue', 'name', 'error'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectElement = ref(null);

    const selectType = (e) => {
      emit('update:modelValue', Number(e.target.value));
    };

    onMounted(() => {
      if (props.variety.length === 1) {
        selectElement.value.forEach((item) => {
          // eslint-disable-next-line
          item.checked = true;
          // eslint-disable-next-line
          item.disabled = true;
          emit('update:modelValue', Number(item.value));
        });
      }
    });

    return {
      selectElement,
      selectType,
    };
  },
});
</script>
<style>
.options__error {
  margin-top: -20px;
  font-size: 11px;
  line-height: 14px;
  color: #e02d71;
}

.options__radio:checked ~ .options__value::before {
  background-color: black;
}
</style>
