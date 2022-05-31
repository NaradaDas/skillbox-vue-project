<template lang="">
  <main :class="{ 'quick-view': isQuickView }" class="content container">
    <div v-if="!isQuickView" class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{ name: 'main' }" class="breadcrumbs__link"> Каталог </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link
            @click="saveToLocalStorage(productData.category.id)"
            :to="{ name: 'main' }"
            class="breadcrumbs__link"
            href="#"
          >
            {{ !!productData ? productData.category.title : '' }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> {{ !!productData ? productData.title : '' }} </a>
        </li>
      </ul>
    </div>

    <BaseBigLoader class="container" :loading="isProductLoading" :failed="isProductLoadingFailed">
      Не удалось получить данные о товаре.
    </BaseBigLoader>

    <section v-if="!isProductLoading && !isProductLoadingFailed" class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <BaseImageNotFound class="item__image" v-if="!image" />
          <img
            class="item__image"
            v-else
            width="570"
            height="570"
            :src="image"
            :alt="productData.title"
          />
        </div>
      </div>
      <div class="item__info">
        <span class="item__code">Артикул: 150030</span>
        <h2 class="item__title">{{ productData.title }}</h2>
        <div class="item__form">
          <form class="form" action="#" @submit.prevent="addProductToBasket">
            <div class="item__row item__row--center">
              <BaseProductCounter
                v-model:quantity="productPostSettings.quantity"
                v-model:error="isCounterError"
              />
              <b class="item__price"> {{ editNumberFormat(productData.price) }} ₽ </b>
            </div>
            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul :id="`product-colors-${productId}`" class="colors colors--black">
                  <li v-for="(item, index) in productData.colors" :key="index" class="colors__item">
                    <!-- eslint-disable-next-line -->
                    <label class="colors__label">
                      <input
                        :checked="image === findImage(item)"
                        :id="`color-checkboxes-${item.id}`"
                        class="colors__radio sr-only"
                        type="radio"
                        :name="`color-checkboxes-${productData.id}`"
                        :value="item.id"
                        @click="changeColor(item)"
                      />
                      <span
                        class="colors__value"
                        :style="{
                          backgroundColor: item.color.code,
                          border:
                            '1px solid' + (item.color.id === 27 ? ' #e2e2e2' : ' transparent'),
                        }"
                      >
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>
              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <!-- eslint-disable-next-line -->
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" name="category" v-model="productPostSettings.sizeId">
                    <option v-for="size in productData.sizes" :key="size.id" :value="size.id">
                      {{ size.title }}
                    </option>
                  </select>
                </label>
              </fieldset>
            </div>
            <BaseButtonError v-if="isCounterError">
              Колличество товаров должно быть не меньше 1
            </BaseButtonError>

            <button
              :class="{ button_success: isProductAdded }"
              :disabled="isSendingProduct"
              v-else
              class="item__button button button--primery"
              type="submit"
            >
              В корзину
              <div class="button_success__text" v-if="isProductAdded">Товар добавлен в корзину</div>
              <BaseSmallLoader
                :class="{ button__loader: !isSendingProductFailed }"
                :sending="isSendingProduct"
                :failed="isSendingProductFailed"
              >
                <p class="button__fail">
                  Не удалось положить товар в корзину, проверьте интернет-соединение и попробуйте
                  перезагрузить страницу.
                </p>
              </BaseSmallLoader>
            </button>
          </form>
        </div>
      </div>
      <div v-if="!!productData.content" class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current"> Информация о товаре </a>
          </li>
          <li class="tabs__item"><a class="tabs__link" href="#"> Доставка и возврат </a></li>
        </ul>
        <div class="item__content">
          {{ productData.content }}
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import BaseImageNotFound from '@/components/BaseImageNotFound.vue';
import BaseBigLoader from '@/components/BaseBigLoader.vue';
import BaseSmallLoader from '@/components/BaseSmallLoader.vue';
import BaseProductCounter from '@/components/BaseProductCounter.vue';
import BaseButtonError from '@/components/BaseButtonError.vue';
// eslint-disable-next-line
import { defineComponent, ref, watch, onMounted, toRef, watchEffect, toRefs } from 'vue';
import useProduct from '@/composible/useProduct';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: {
    BaseButtonError,
    BaseBigLoader,
    BaseImageNotFound,
    BaseSmallLoader,
    BaseProductCounter,
  },
  props: ['productId'],
  setup(props) {
    // eslint-disable-next-line
    const isQuickView = ref(useRoute().name === 'main');

    return {
      ...useProduct(props.productId),
      isQuickView,
    };
  },
});
</script>

<style>
.button--primery {
  position: relative;
  min-width: 200px;
  max-height: 70px;
  max-width: 300px;
}
.button_success__text {
  position: absolute;
  left: 0;
  bottom: 15%;
  font-size: 10px;
  right: 0;
  animation: added 2.1s ease;
}

.button_success {
  background-color: #06ac55;
}

.button_success.button:hover {
  background-color: #008344;
}

@keyframes added {
  0% {
    transform: translateY(20px);
  }
  20% {
    transform: translateY(0px);
  }
  80% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(20px);
  }
}
.quick-view.container {
  width: auto;
}
.quick-view .container {
  width: auto;
}

.quick-view.content {
  padding-bottom: 50px;
}

.quick-view .item {
  grid-template-columns: auto;
  grid-gap: 0px 30px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  flex-direction: column;
}

.quick-view .item__row--center {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.quick-view .item__row {
  justify-content: center;
}

.quick-view .item__image {
  width: 350px;
  height: 350px;
}

.quick-view .item__title {
  margin: 10px 0 22px;
  font-size: 20px;
  line-height: 20px;
  font-weight: 400;
}

.button__fail {
  position: absolute;
  color: black;
  width: 350px;
  left: -35%;
  bottom: -45px;
  font-size: 10px;
}
</style>
