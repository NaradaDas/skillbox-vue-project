<template lang="">
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a
      href="#"
        class="pagination__link pagination__link--arrow"
        aria-label="Предыдущая страница"
        :class="{ 'pagination__link--disabled': page === 1 }"
        @click.prevent="changePage(page - 1)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a
            href="#"

        class="pagination__link"
        :class="{ 'pagination__link--current': pageNumber === page }"
        @click.prevent="changePage(pageNumber)"
      >
        {{ pageNumber }}
      </a>
    </li>

    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        href="#"
        aria-label="Следующая страница"
        :class="{ 'pagination__link--disabled': page === pages }"
        @click.prevent="changePage(page + 1)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['pages', 'page'],
  setup(props, { emit }) {
    const changePage = (pageNumber) => {
      if (pageNumber < 1 || pageNumber > props.pages) return;
      emit('update:page', pageNumber);
    };
    return {
      changePage,
    };
  },
});
</script>
<style>
.pagination__item {
  cursor: pointer;
}
</style>
