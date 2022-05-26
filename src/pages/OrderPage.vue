<template lang="">
  <main class="content container">
    <div class="content__top">
      <OrderBreadcrumbs />
      <div class="content__row">
        <h1 class="content__title">Оформление заказа</h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <OrderFormInput
              v-model="formData.name"
              :placeholder-text="'Введите ваше полное имя'"
              :label-text="'ФИО'"
              :error-text="formError.name"
            />
            <OrderFormInput
              v-model="formData.address"
              :placeholder-text="'Введите ваш адрес'"
              :label-text="'Адрес доставки'"
              :error-text="formError.address"
            />
            <OrderFormInput
              v-model="formData.phone"
              :placeholder-text="'Введите ваш телефон'"
              :label-text="'Телефон'"
              :error-text="formError.phone"
            />
            <OrderFormInput
              v-model="formData.email"
              :placeholder-text="'Введи ваш Email'"
              :label-text="'Email'"
              :error-text="formError.email"
            />
            <OrderFormTextarea
              v-model="formData.comment"
              :placeholder-text="'Ваши пожелания'"
              :label-text="'Комментарий к заказу'"
              :error-text="formError.comment"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>

            <BaseSmallLoader
              v-if="isDeliveryLoading || isDeliveryLoadingFailed"
              :sending="isDeliveryLoading"
              :failed="isDeliveryLoadingFailed"
            >
              <p>
                Не удалось получить варианты доставки. Проверьте интернет-соединие и попробуйте
                перезагрузить страницу.
              </p></BaseSmallLoader
            >

            <OrderRadioList
              v-else
              v-model="deliveryTypeId"
              :variety="deliveryVariety"
              :name="'delivery'"
              :error="formError.deliveryTypeId"
            />

            <h3 class="cart__title">Оплата</h3>

            <div v-if="paymentVariety.length === 0 && !isPaymentLoading && !isPaymentLoadingFailed">
              Варианты оплаты отобразятся после того, как вы выбирите способ доставки.
            </div>

            <BaseSmallLoader
              v-if="isPaymentLoading || isPaymentLoadingFailed"
              :sending="isPaymentLoading"
              :failed="isPaymentLoadingFailed"
            >
              <p>
                Не удалось получить варианты оплаты. Проверьте интернет-соединие и попробуйте
                перезагрузить страницу.
              </p>
            </BaseSmallLoader>
            <OrderRadioList
              v-if="paymentVariety.length > 0 && !isPaymentLoading && !isPaymentLoadingFailed"
              v-model="formData.paymentTypeId"
              :variety="paymentVariety"
              :name="'payment'"
              :error="formError.paymentTypeId"
            />
          </div>
        </div>

        <OrderBasketItemsList
          :delivery="{ deliveryTypeId, deliveryVariety }"
          :list="store.state.basketData"
          :errorMessage="formErrorMessage"
          :error="isOrderLoadingFailed"
          :sending="isOrderLoading"
        />
        <div id="teleport"></div>
      </form>
    </section>
  </main>
</template>
<script>
import OrderFormTextarea from '@/components/OrderFormTextarea.vue';
import OrderFormInput from '@/components/OrderFormInput.vue';
import OrderBasketItemsList from '@/components/OrderBasketItemsList.vue';
import OrderRadioList from '@/components/OrderRadioList.vue';
import BaseSmallLoader from '@/components/BaseSmallLoader.vue';
import OrderBreadcrumbs from '@/components/OrderBreadcrumbs.vue';

import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  defineComponent, reactive, ref, computed,
} from 'vue';
import useApi from '@/composible/useApi';

export default defineComponent({
  components: {
    OrderBreadcrumbs,
    OrderFormTextarea,
    OrderFormInput,
    OrderBasketItemsList,
    OrderRadioList,
    BaseSmallLoader,
  },
  setup() {
    const {
      fetchDeliveryVariety, fetchPaymentVariety, sendOrder,
    } = useApi();
    const formData = reactive({});
    const router = useRouter();
    const store = useStore();
    const isDeliveryLoading = ref(true);
    const isDeliveryLoadingFailed = ref(false);
    const deliveryVariety = ref([]);
    fetchDeliveryVariety()
      .then((res) => {
        deliveryVariety.value = res.data;
      })
      .catch(() => {
        isDeliveryLoadingFailed.value = true;
      })
      .then(() => {
        isDeliveryLoading.value = false;
      });

    const paymentVariety = ref([]);
    const isPaymentLoading = ref(false);
    const isPaymentLoadingFailed = ref(false);
    const deliveryTypeId = computed({
      get() {
        return formData.deliveryTypeId;
      },
      set(value) {
        Reflect.deleteProperty(formData, 'paymentTypeId');
        isPaymentLoadingFailed.value = false;
        isPaymentLoading.value = true;
        fetchPaymentVariety(value)
          .then((res) => {
            paymentVariety.value = res.data;
          })
          .catch(() => {
            isPaymentLoadingFailed.value = true;
          })
          .then(() => {
            isPaymentLoading.value = false;
          });
        return Reflect.set(formData, 'deliveryTypeId', value);
      },
    });

    const formError = ref({});
    const formErrorMessage = ref('');
    const isOrderLoading = ref(false);
    const isOrderLoadingFailed = ref(false);
    const order = () => {
      isOrderLoadingFailed.value = false;
      isOrderLoading.value = true;
      sendOrder(formData)
        .then((res) => {
          router.push({ name: 'orderInfo', params: { id: res.data.id } });
          store.commit('changeBasketItemsQuantity', 0);
          store.commit('updateBasketData', []);
        })
        .catch((error) => {
          formError.value = error.response.data.error.request;
          formErrorMessage.value = error.response.data.error.message;
          isOrderLoadingFailed.value = true;
        })
        .then(() => {
          isOrderLoading.value = false;
        });
    };

    return {
      store,
      isOrderLoadingFailed,
      isOrderLoading,
      order,
      deliveryTypeId,
      paymentVariety,
      isPaymentLoading,
      isPaymentLoadingFailed,
      deliveryVariety,
      isDeliveryLoading,
      isDeliveryLoadingFailed,
      formError,
      formErrorMessage,
      formData,
    };
  },
});
</script>
<style lang=""></style>
