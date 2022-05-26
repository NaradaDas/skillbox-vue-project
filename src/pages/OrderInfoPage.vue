<template lang="">
  <main class="content container">
    <div class="content__top">
      <OrderBreadcrumbs />

      <h1 class="content__title">Заказ оформлен <span>№ 23621</span></h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо
            с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для
            уточнения деталей доставки.
          </p>
          <BaseBigLoader
            v-if="isOrderLoading || isOrderLoadingFailed"
            class="dictionary"
            :loading="isOrderLoading"
            :failed="isOrderLoadingFailed"
            >Не удалось получить информацию о заказе. Попробуйте перезагрузить
            страницу.</BaseBigLoader
          >
          <ul v-else class="dictionary">
            <OrderDictionaryItem :title="'Получатель'" :value="orderData.name" />
            <OrderDictionaryItem :title="' Адрес доставки'" :value="orderData.address" />
            <OrderDictionaryItem :title="'Телефон'" :value="orderData.phone" />
            <OrderDictionaryItem :title="'Email'" :value="orderData.email" />
            <OrderDictionaryItem :title="'Способ оплаты'" :value="orderData.paymentType" />
          </ul>
        </div>

        <OrderBasketItemsList
          :list="orderData.name ? orderData.basket.items : []"
          :delivery="
            orderData.name
              ? {
                  deliveryTypeId: orderData.deliveryType.id,
                  deliveryVariety: [orderData.deliveryType],
                }
              : {}
          "
        />
      </form>
    </section>
  </main>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseBigLoader from '@/components/BaseBigLoader.vue';
import OrderDictionaryItem from '@/components/OrderDictionaryItem.vue';
import OrderBreadcrumbs from '@/components/OrderBreadcrumbs.vue';
import OrderBasketItemsList from '@/components/OrderBasketItemsList.vue';

import useApi from '@/composible/useApi';

export default defineComponent({
  components: {
    BaseBigLoader, OrderDictionaryItem, OrderBreadcrumbs, OrderBasketItemsList,
  },
  setup() {
    const { fetchOrderData } = useApi();
    const isOrderLoading = ref(true);
    const isOrderLoadingFailed = ref(false);
    const orderData = ref({});

    fetchOrderData(useRoute().params.id)
      .then((res) => {
        orderData.value = res.data;
      })
      .catch(() => {
        isOrderLoadingFailed.value = true;
      })
      .then(() => {
        isOrderLoading.value = false;
      });
    return {
      isOrderLoading,
      isOrderLoadingFailed,
      orderData,
    };
  },
});
</script>
<style lang=""></style>
