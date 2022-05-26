import { API_BASE_URL } from '@/config';
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

export default function () {
  const store = useStore();
  let userAccessKey = localStorage.getItem('accessKey') ? localStorage.getItem('accessKey') : '';
  const productsData = ref([]);
  const productsQuantity = ref(0);
  const pagesNumber = ref(0);
  const status = reactive({
    isCatalogLoading: false,
    isCatalogLoadingFailed: false,
    isBasketLoading: false,
    isBasketLoadingFailed: false,
    isOrderSending: false,
    isOrderSendingFailed: false,
  });

  const fetchProductList = (params) => {
    status.isCatalogLoading = true;
    status.isCatalogLoadingFailed = false;
    return axios
      .get(`${API_BASE_URL}/api/products`, { params })
      .then((res) => {
        productsData.value = res.data.items;
        pagesNumber.value = res.data.pagination.pages;
        productsQuantity.value = res.data.pagination.total;
        return res;
      })
      .catch(() => {
        status.isCatalogLoadingFailed = true;
      })
      .then((res) => {
        status.isCatalogLoading = false;
        return res;
      });
  };

  const propertiesForFilter = reactive({});
  const fetchPropertiesForFilter = () => Promise.all([
    axios.get(`${API_BASE_URL}/api/productCategories`),
    axios.get(`${API_BASE_URL}/api/colors`),
    axios.get(`${API_BASE_URL}/api/materials`),
    axios.get(`${API_BASE_URL}/api/seasons`),
  ]).then(([categories, colors, materials, seasons]) => {
    Reflect.set(propertiesForFilter, 'categories', categories.data.items);
    Reflect.set(propertiesForFilter, 'colors', colors.data.items);
    Reflect.set(propertiesForFilter, 'materials', materials.data.items);
    Reflect.set(propertiesForFilter, 'seasons', seasons.data.items);
  });

  const productData = ref(null);
  const fetchProductData = (id) => axios
    .get(`${API_BASE_URL}/api/products/${id}`);

  const postProduct = (productProperties) => {
    store.commit('changeBasketLoadingIndicator', true);
    return axios
      .post(
        `${API_BASE_URL}/api/baskets/products`,
        productProperties,
        {
          params: {
            userAccessKey,
          },
        },
      )
      .then((res) => {
        store.commit('updateBasketData', res.data.items);
        store.commit('changeBasketLoadingIndicator', false);
        store.commit('changeBasketItemsQuantity', res.data.items.length);
        return res;
      });
  };

  const fetchBasket = () => {
    store.commit('changeBasketLoadingIndicator', true);
    store.commit('changeBasketFailedLoadingIndicator', false);
    return axios.get(`${API_BASE_URL}/api/baskets`, {
      params: {
        userAccessKey,
      },
    })
      .then((res) => {
        store.commit('changeBasketItemsQuantity', res.data.items.length);
        store.commit('updateBasketData', res.data.items);
        // eslint-disable-next-line
        localStorage.getItem('accessKey') ? userAccessKey = localStorage.getItem('accessKey')
          : (userAccessKey = res.data.user.accessKey, localStorage.setItem('accessKey', userAccessKey));
        return res;
      })
      .catch(() => store.commit('changeBasketFailedLoadingIndicator', true))
      .then((res) => {
        store.commit('changeBasketLoadingIndicator', false);
        return res;
      });
  };

  const changeQuantityOfBasketItem = (productProperties) => axios
    .put(
      `${API_BASE_URL}/api/baskets/products`,
      productProperties,
      {
        params: {
          userAccessKey,
        },
      },
    )
    .then((res) => {
      store.commit('updateBasketData', res.data.items);
      return res;
    });

  const deleteBasketItem = (productProperties) => axios
    .delete(
      `${API_BASE_URL}/api/baskets/products`,
      {
        params: {
          userAccessKey,
        },
        data: productProperties,
      },
    )
    .then((res) => {
      store.commit('changeBasketItemsQuantity', res.data.items.length);
      store.commit('updateBasketData', res.data.items);
      return res;
    });

  const fetchDeliveryVariety = () => axios.get(`${API_BASE_URL}/api/deliveries`);

  const fetchPaymentVariety = (deliveryTypeId) => axios.get(`${API_BASE_URL}/api/payments`, {
    params: {
      deliveryTypeId,
    },
  });

  const sendOrder = (orderProperties) => axios.post(
    `${API_BASE_URL}/api/orders`,
    orderProperties,
    {
      params: {
        userAccessKey,
      },
    },
  );

  const fetchOrderData = (orderId) => axios
    .get(`${API_BASE_URL}/api/orders/${orderId}`, {
      params: {
        userAccessKey,
      },
    });

  return {
    fetchOrderData,
    sendOrder,
    fetchPaymentVariety,
    fetchDeliveryVariety,
    deleteBasketItem,
    changeQuantityOfBasketItem,
    userAccessKey,
    fetchBasket,
    postProduct,
    productData,
    fetchProductData,
    productsQuantity,
    fetchPropertiesForFilter,
    propertiesForFilter,
    status,
    fetchProductList,
    productsData,
    pagesNumber,
  };
}
