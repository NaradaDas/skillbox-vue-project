<template lang="">
  <div class="cart__block">
    <ul class="cart__orders">
      <li v-for="item in list" :key="item.id" class="cart__order">
        <h3>{{ item.product.title }}</h3>
        <b>{{ editNumberFormat(item.price) }} ₽</b>
        <span>Размер: {{ item.size.title }}</span>
        <span>Колличество: {{ item.quantity }}</span>
        <span>Цвет: {{ translateColorName(item.color.color.title) }}</span>
        <span>Артикул: {{ item.id }}</span>
      </li>
    </ul>

    <div class="cart__total">
      <p>
        Доставка: <b>{{ deliveryPrice.string }}</b>
      </p>
      <p>
        Итого: <b>{{ totalQuantity }}</b>
        {{ pluralizeProductAmount(totalQuantity).split(' ').slice(-1).toString() }} на сумму
        <b>{{ totalPrice }} ₽</b>
      </p>
    </div>

    <button
      :disabled="sending"
      v-if="route.name !== 'orderInfo'"
      class="cart__button button button--primery"
      type="submit"
    >
      <BaseSmallLoader class="button__loader" :sending="sending" :failed="error">
        <teleport to="#teleport">
          <div class="cart__error form__error-block">
            <h4>Заявка не отправлена!</h4>
            <p>Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.</p>
            {{ errorMessage }}
          </div>
        </teleport>
      </BaseSmallLoader>
      Оформить заказ
    </button>
  </div>
</template>
<script>
import { defineComponent, toRefs, computed } from 'vue';
import BaseSmallLoader from '@/components/BaseSmallLoader.vue';
import useHelpers from '@/composible/useHelpers';
import { useRoute } from 'vue-router';

export default defineComponent({
  props: ['error', 'errorMessage', 'sending', 'list', 'delivery'],
  components: { BaseSmallLoader },
  setup(props) {
    const route = useRoute();
    const { editNumberFormat, pluralizeProductAmount, translateColorName } = useHelpers();
    const { list, delivery } = toRefs(props);
    const totalQuantity = computed(() => list.value.reduce((acc, item) => item.quantity + acc, 0));
    const deliveryPrice = computed(() => {
      if (delivery.value.deliveryTypeId > 0) {
        const price = Number(
          delivery.value.deliveryVariety.find((item) => item.id === delivery.value.deliveryTypeId)
            .price,
        );
        const string = price === 0 ? 'бесплатно' : `${price} ₽`;
        return { string, price };
      }

      return { string: 'не выбрано', price: 0 };
    });

    const totalPrice = computed(() => editNumberFormat(
      list.value.reduce((acc, item) => item.quantity * item.price + acc, 0)
        + deliveryPrice.value.price,
    ));

    return {
      translateColorName,
      route,
      deliveryPrice,
      totalPrice,
      totalQuantity,
      editNumberFormat,
      pluralizeProductAmount,
    };
  },
});
</script>
<style>
.button--primery {
  position: relative;
}
</style>
