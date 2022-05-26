import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/pages/CatalogPage.vue'),
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('@/pages/ProductPage.vue'),
  },
  {
    path: '/basket',
    name: 'basket',
    component: () => import('@/pages/BasketPage.vue'),
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/pages/OrderPage.vue'),
  },
  {
    path: '/order/info/:id',
    name: 'orderInfo',
    component: () => import('@/pages/OrderInfoPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory('/vue-moire/'),
  // history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
// git@github.com:NaradaDas/vue-moire.git