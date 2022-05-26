<template lang="">
  <li class="catalog__item">
    <router-link
      class="catalog__pic product-link"
      :to="{ name: 'product', params: { id: product.id } }"
    >
      <BaseImageNotFound v-if="!image" />
      <img v-else :src="image" :alt="product.title" />
    </router-link>

    <h3 class="catalog__title">
      <a href="#" @click.prevent="isQuickViewOpen = true"> Быстрый просмотр </a>
    </h3>

    <!-- <span class="catalog__price"> {{ price }} ₽ </span>

            <ul :id="product.id" class="colors colors--black">
              <li class="colors__item" v-for="item in product.colors" :key="item.id">
                <label class="colors__label colors__label-hover" >
                  <input
                    class="colors__radio sr-only"
                    type="radio"
                    :name="product.slug"
                    :value="item.id"
                    @click="changeImage(item)"
                  />
                  <span
                  class="colors__value"
                  :style="{ backgroundColor: item.color.code, border: '1px solid'
                  + (item.color.id === 27 ?' #e2e2e2' : ' transparent') }">
                  </span>
                </label>
              </li>
            </ul> -->
    <BaseModal v-model:open="isQuickViewOpen">
      <BaseProductView :product-id="product.id" />
    </BaseModal>
  </li>
</template>
<script>
import {
  defineComponent, ref, defineAsyncComponent, h,
} from 'vue';
import BaseImageNotFound from '@/components/BaseImageNotFound.vue';

import BaseModal from '@/components/BaseModal.vue';

import useHelpers from '@/composible/useHelpers';

export default defineComponent({
  components: {
    BaseImageNotFound,
    BaseModal,
    BaseProductView: defineAsyncComponent({
      loader: () => import('@/components/BaseProductView.vue'),
      loadingComponent: () => h('div', 'Загрузка компонента...'),
      delay: 0,
    }),
  },

  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { editNumberFormat } = useHelpers();
    const price = ref(editNumberFormat(props.product.price));

    const image = ref(
      props.product.colors[0].gallery
        ? props.product.colors[0].gallery[0].file.url
        : props.product.colors[1].gallery[0].file.url,
    );

    const changeImage = (item) => {
      if (item.gallery === null) {
        image.value = '';
      } else {
        image.value = item.gallery[0].file.url;
      }
    };

    // onMounted(() => {
    //   props.product.colors.forEach((color, index) => !color.gallery ? 1
    // : color.gallery[0].file.url === image.value ? document.getElementById(`${props.product.id}`)
    // .children[index].getElementsByTagName('input')[`${props.product.slug}`].checked = true : 1)
    // })

    const isQuickViewOpen = ref(false);

    return {
      isQuickViewOpen,
      changeImage,
      price,
      image,
    };
  },
});
</script>
<style>
.catalog__title a {
  cursor: pointer;
  color: #9d9d9d;
  font-size: 12px;
  line-height: 1em;
}

.product-link {
  position: relative;
}

.colors__value::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 23px;
  height: 23px;
  border: 2px solid transparent;
  border-radius: 100%;
  transition: border 0.2s ease;
}

.colors__label:focus .colors__value::after,
.colors__label:hover .colors__value::after {
  border-color: grey;
}

.catalog__pic img {
  width: 200px;
  height: 260px;
}

.catalog__pic {
  display: block;
  width: 200px;
  height: 260px;
  margin-bottom: 10px;
}
</style>
