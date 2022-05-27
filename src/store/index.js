import { createStore } from 'vuex';

export default createStore({
  state: {
    basketItemsQuantity: 0,
    isBasketLoading: false,
    isBasketLoadingFailed: false,
    isBasketItemDeleteLoading: false,
    isBasketItemDeleteFailed: false,
    basketData: [],
  },
  getters: {
  },
  mutations: {
    deleteItemInBasket(state, id) {
      state.basketData = state.basketData.filter((item) => item.id !== id);
    },
    changeBasketItemsQuantity(state, quantity) {
      state.basketItemsQuantity = quantity;
    },
    changeBasketLoadingIndicator(state, boolean) {
      state.isBasketLoading = boolean;
    },
    changeBasketFailedLoadingIndicator(state, boolean) {
      state.isBasketLoadingFailed = boolean;
    },
    updateBasketData(state, data) {
      state.basketData = data;
    },
    changeBasketItemDeleteLoadingIngicator(state, boolean) {
      state.isBasketItemDeleteLoading = boolean;
    },
    changeBasketItemDeleteFailedIngicator(state, boolean) {
      state.isBasketItemDeleteFailed = boolean;
    },
  },
  actions: {
  },
  modules: {
  },
});
