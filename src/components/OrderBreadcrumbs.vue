<template lang="">
    <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
             <router-link :to="{name: 'main'}" class="breadcrumbs__link"> Каталог </router-link>
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html">
 <router-link :to="{name: 'basket'}" class="breadcrumbs__link"> Корзина </router-link>          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>
</template>
<script>
export default {};
</script>
<style lang="">

</style>
