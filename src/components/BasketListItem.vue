<template lang="">
  <li class="cart__item product">
    <div class="product__pic">
      <img
        v-if="item.color.gallery"
        :src="item.color.gallery ? item.color.gallery[0].file.url : false"
        width="120"
        height="120"
        :alt="item.product.title"
      />
      <BaseImageNotFound v-else />
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i
          :class="{ 'white-spote': item.color.color.id === 27 }"
          :style="{ backgroundColor: item.color.color.code }"
        ></i>
        {{ translateColorName(item.color.color.title) }}
      </span>
    </p>
    <p class="product__info product__info--size">Размер: {{ item.size.title }}</p>
    <span class="product__code"> Артикул: {{ item.id }} </span>

    <BaseProductCounter
      class="product__counter"
      @changeAmount="changeAmount(item)"
      v-model:quantity="item.quantity"
      v-model:error="isProductQuantityError"
    />

    <b class="product__price"> {{ editNumberFormat(item.price) }} ₽ </b>

    <button
      v-if="basketItemsQuantity"
      :class="{ 'button-del--loading': isDeleteLoading }"
      @click.prevent="deleteItem(item)"
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
    >
      <BaseSmallLoader
        class="button-del__preloader"
        :sending="isDeleteLoading"
        :failed="isDeleteFailed"
      >
        <teleport to="#basket-teleport">
          Не удалось удалить товар. Проверьте интернет соединение и попробуйте перезагрузите
          страницу.
        </teleport>
      </BaseSmallLoader>
      <svg width="20" height="20" fill="currentColor">
        <g id="color" />
        <g id="hair" />
        <g id="skin" />
        <g id="skin-shadow" />
        <g id="line">
          <line
            x1="0"
            x2="20"
            y1="0"
            y2="20"
            fill="none"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            stroke-width="2"
          />
          <line
            x1="20"
            x2="0"
            y1="0"
            y2="20"
            fill="none"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            stroke-width="2"
          />
        </g>
      </svg>
    </button>
  </li>
</template>
<script>
import { defineComponent, ref, toRef } from 'vue';
import BaseProductCounter from '@/components/BaseProductCounter.vue';
import useApi from '@/composible/useApi';
import useHelpers from '@/composible/useHelpers';
import BaseSmallLoader from '@/components/BaseSmallLoader.vue';
import BaseImageNotFound from '@/components/BaseImageNotFound.vue';

import { useStore } from 'vuex';

export default defineComponent({
  components: { BaseProductCounter, BaseSmallLoader, BaseImageNotFound },
  props: ['itemData'],
  setup(props) {
    const store = useStore();
    const { changeQuantityOfBasketItem, deleteBasketItem } = useApi();
    const isProductQuantityError = ref(false);
    const { editNumberFormat, translateColorName, findImage } = useHelpers();
    const changeAmount = (item) => {
      if (item.quantity < 1) return;
      changeQuantityOfBasketItem({ basketItemId: item.id, quantity: item.quantity });
    };

    const deleteItem = (item) => {
      store.commit('changeBasketItemDeleteLoadingIngicator', true);
      store.commit('changeBasketItemDeleteFailedIngicator', false);
      deleteBasketItem({ basketItemId: item.id })
        .catch(() => store.commit('changeBasketItemDeleteFailedIngicator', true))
        .then(() => store.commit('changeBasketItemDeleteLoadingIngicator', false));
    };

    return {
      findImage,
      translateColorName,
      basketItemsQuantity: toRef(store.state, 'basketItemsQuantity'),
      item: toRef(props, 'itemData'),
      isDeleteLoading: toRef(store.state, 'isBasketItemDeleteLoading'),
      isDeleteFailed: toRef(store.state, 'isBasketItemDeleteFailed'),
      deleteItem,
      deleteBasketItem,
      changeAmount,
      isProductQuantityError,
      editNumberFormat,
    };
  },
});
</script>
<style>
.white-spote {
  border: 0.1px solid #e2e2e2;
}

.button-del {
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: relative;
}

.button-del::after {
  z-index: -1;
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
  background-color: #e02d71;
  border-radius: 50px;
  transition: transform 0.2s ease-in-out;
  transform: scale(0);
}

.button-del:hover:after {
  transform: scale(1);
}

.button-del #line line {
  transition: stroke 0.2s ease-in-out;
}

.button-del:hover #line line {
  stroke: white;
}

.button-del:active:after {
  transform: scale(0);
}

.product__info.product__info--color {
  grid-row: 1/3;
}

.product__info.product__info--size {
  grid-row: 2/2;
}

.button-del--loading {
  pointer-events: none;
}

.button-del--loading svg {
  opacity: 0.4;
}

.button-del__preloader {
  position: absolute;
  top: -10px;
  bottom: -10px;
  right: -10px;
  left: -10px;
}
</style>
