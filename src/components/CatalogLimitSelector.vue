<template lang="">
  <div class="content__limit limit">
    <fieldset class="limit__field">
      <legend class="form__legend">Колличество товаров на одной странице</legend>

      <ul class="limit__list">
        <li v-for="(limit, index) in limitVariety" :key="index" class="limit__item">
          <!-- eslint-disable-next-line -->
          <label class="limit__label limit__label-hover">
            <input
              :id="`limit-${limit}`"
              class="limit__radio sr-only"
              name="limit"
              type="radio"
              @click="changeLimit(limit)"
            />
            <span class="limit__value" :style="{ backgroundColor: 'white' }">
              {{ limit }}
            </span>
          </label>
        </li>
      </ul>
    </fieldset>
  </div>
</template>
<script>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const limitVariety = [12, 24, 32];
    const changeLimit = (pageLimit) => {
      localStorage.setItem('pageLimit', pageLimit);
      emit('update:modelValue', pageLimit);
    };

    onMounted(() => {
      document.getElementById(`limit-${props.modelValue}`).checked = true;
    });

    return {
      changeLimit,
      limitVariety,
    };
  },
});
</script>
<style>
.content__limit {
  left: 50%;
  top: -20px;
  transform: translateX(-50%);
  position: absolute;
}

.limit__field {
  max-width: 350px;
  margin: 0 auto;
}

.limit__list {
  margin: 0;
  padding: 0;
  list-style: none;
  --border-color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.limit__label {
  position: relative;
  cursor: pointer;
  display: block;
  border-radius: 50%;
  padding: 3px;
  font-weight: 600;
}

.limit__value {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
}

.limit__value,
.limit__value::before {
  border-radius: 50%;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}

.limit__radio:checked ~ .limit__value::before {
  border-color: #000;
}

.limit__value::before {
  content: '';
  position: absolute;
  top: 45%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 35px;
  height: 35px;
  border: 1px solid transparent;
}

.limit__value::after {
  content: '';
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 2px solid transparent;
  border-radius: 100%;
  transition: border 0.2s ease;
}

.limit__label:hover .limit__value::after {
  border-color: #e02d71;
}
</style>
