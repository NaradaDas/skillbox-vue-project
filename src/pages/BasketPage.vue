<template lang="">
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{ name: 'main' }" class="breadcrumbs__link" href="index.html">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Корзина </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">Корзина</h1>
        <span class="content__info">
          {{ pluralizeProductAmount(basketData.reduce((acc, item) => item.quantity + acc, 0)) }}
        </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <BaseBigLoader class="container" :loading="isDataLoading" :failed="isDataLoadingFailed" />
          <BasketList v-if="!isDataLoading && !isDataLoadingFailed" :list-data="basketData" />
        </div>

        <div class="cart__block">
          <p class="cart__desc">Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе</p>
          <p class="cart__price">
            Итого: <span>{{ totalPrice }} ₽</span>
          </p>
          <div v-if="basketData.length">
            <BaseButtonError v-if="isInvalidProductQuantity">
              Колличество товара в корзине должно быть не менше 1.
            </BaseButtonError>
            <router-link
              :to="{ name: 'order' }"
              v-else
              class="cart__button button button--primery"
              type="submit"
            >
              Оформить заказ
            </router-link>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>
<script>
// eslint-disable-next-line
import { defineComponent, computed, ref, toRef } from 'vue';
import BasketList from '@/components/BasketList.vue';
import BaseButtonError from '@/components/BaseButtonError.vue';
import useHelpers from '@/composible/useHelpers';
import { useStore } from 'vuex';
import BaseBigLoader from '@/components/BaseBigLoader.vue';

export default defineComponent({
  components: { BasketList, BaseButtonError, BaseBigLoader },
  setup() {
    const store = useStore();
    localStorage.setItem('categoryId', 0);
    const { editNumberFormat, pluralizeProductAmount } = useHelpers();
    const isInvalidProductQuantity = ref(false);
    const totalPrice = computed(() => {
      // eslint-disable-next-line
      isInvalidProductQuantity.value = store.state.basketData.every((item) => item.quantity > 0)
        ? false
        : true;
      return editNumberFormat(
        store.state.basketData.reduce(
          (acc, item) => (item.quantity > 0 ? item.quantity * item.price + acc : acc),
          0,
        ),
      );
    });

    return {
      isDataLoading: toRef(store.state, 'isBasketLoading'),
      isDataLoadingFailed: toRef(store.state, 'isBasketLoadingFailed'),
      pluralizeProductAmount,
      isInvalidProductQuantity,
      totalPrice,
      basketData: toRef(store.state, 'basketData'),
    };
  },
});
</script>
<style lang=""></style>
