import useHelpers from '@/composible/useHelpers';
import {
  ref,
  reactive,

} from 'vue';
import useApi from '@/composible/useApi';

export default function (productId) {
  const { editNumberFormat, findImage } = useHelpers();
  const {
    fetchProductData,
    postProduct,
  } = useApi();
  const isProductLoading = ref(false);
  const isProductLoadingFailed = ref(false);

  const productData = ref(null);
  const image = ref('');
  const productPostSettings = reactive({
    quantity: 1,
  });
  const isCounterError = ref(false);

  const loadProductData = () => {
    isProductLoading.value = true;
    fetchProductData(productId)
      .then((res) => {
        productData.value = res.data;
        image.value = productData.value.colors[0].gallery
          ? productData.value.colors[0].gallery[0].file.url
          : productData.value.colors[1].gallery[0].file.url;
        productPostSettings.productId = productData.value.id;
        productPostSettings.colorId = productData.value.colors[0].gallery
          ? productData.value.colors[0].color.id
          : productData.value.colors[1].color.id;
        productPostSettings.sizeId = productData.value.sizes[0].id;
      })
      .catch(() => {
        isProductLoadingFailed.value = true;
      })
      .then(() => {
        isProductLoading.value = false;
      });
  };
  const changeColor = (item) => {
    productPostSettings.colorId = item.color.id;
    if (item.gallery === null) {
      image.value = '';
      return;
    }
    image.value = item.gallery[0].file.url;
  };

  const saveToLocalStorage = (categoryId) => {
    localStorage.setItem('categoryId', categoryId);
  };

  const isSendingProduct = ref(false);
  const isSendingProductFailed = ref(false);
  const isProductAdded = ref(false);
  let timeoutId;
  const addProductToBasket = () => {
    clearTimeout(timeoutId);
    isProductAdded.value = false;
    isSendingProductFailed.value = false;
    isSendingProduct.value = true;
    postProduct(productPostSettings).then(() => {
      isProductAdded.value = true;
      timeoutId = setTimeout(() => {
        isProductAdded.value = false;
      }, 2100);
    }).catch(() => {
      isSendingProductFailed.value = true;
    }).then(() => {
      isSendingProduct.value = false;
    });
  };
  loadProductData();

  return {
    findImage,
    isProductAdded,
    editNumberFormat,
    isCounterError,
    isSendingProduct,
    isSendingProductFailed,
    addProductToBasket,
    saveToLocalStorage,
    productPostSettings,
    changeColor,
    image,
    isProductLoading,
    isProductLoadingFailed,
    productData,
  };
}
