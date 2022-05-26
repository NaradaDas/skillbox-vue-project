<template lang="">
  <aside class="filter">
    <form class="filter__form form" action="#" @submit.prevent="filterCatalog(filterSettings)">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <!-- eslint-disable-next-line -->
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="number"
            name="min-price"
            v-model.number="filterSettings.minPrice"
          />
          <span class="form__value">От</span>
        </label>
        <!-- eslint-disable-next-line -->
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="number"
            name="max-price"
            v-model.number="filterSettings.maxPrice"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <!-- eslint-disable-next-line -->
        <label class="form__label form__label--select">
          <select class="form__select" name="category" v-model="filterSettings.categoryId">
            <option :value="0" selected>Все категории</option>
            <option
              v-for="category in propertiesForFilter.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li v-for="color in propertiesForFilter.colors" :key="color.id" class="colors__item">
            <!-- eslint-disable-next-line -->
            <label class="colors__label colors__label-hover">
              <input
                class="colors__radio sr-only"
                v-model="colorCheckboxes[`${color.id}`]"
                type="checkbox"
                @click="collectCheckboxElements"
              />
              <span
                class="colors__value"
                :style="[
                  {
                    backgroundColor: color.code,
                    border: '1px solid' + (color.id === 27 ? ' #e2e2e2' : ' transparent'),
                  },
                ]"
              >
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li
            v-for="material in propertiesForFilter.materials"
            :key="material.id"
            class="check-list__item"
          >
            <!-- eslint-disable-next-line -->
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                v-model="materialCheckboxes[`${material.id}`]"
                @click="collectCheckboxElements"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li
            v-for="season in propertiesForFilter.seasons"
            :key="season.id"
            class="check-list__item"
          >
            <!-- eslint-disable-next-line -->
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                v-model="seasonCheckboxes[`${season.id}`]"
                @click="collectCheckboxElements"
              />
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>
      <div v-if="isInvalid" class="filter__submit button button--primery error">
        Максимальная цена должна быть меньше минимальной
      </div>
      <button v-else class="filter__submit button button--primery" type="submit">Применить</button>
      <button
        v-if="isFiltered"
        class="filter__reset button button--second"
        type="button"
        @click.prevent="filterReset"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>
<script>
import {
  defineComponent, ref, watch, reactive,
} from 'vue';
import useApi from '@/composible/useApi';

export default defineComponent({
  props: ['pageSettings'],
  setup(props, { emit }) {
    const { fetchPropertiesForFilter, propertiesForFilter } = useApi();

    fetchPropertiesForFilter();

    const filterSettings = reactive({});
    const colorCheckboxes = reactive({});
    const materialCheckboxes = reactive({});
    const seasonCheckboxes = reactive({});
    const isFiltered = ref(false);
    const isInvalid = ref(false);
    const checkboxesElementsArray = reactive([]);

    const collectCheckboxElements = (e) => {
      if (e.target.checked) {
        checkboxesElementsArray.push(e.target);
      } else {
        checkboxesElementsArray.splice(checkboxesElementsArray.indexOf(e.target), 1);
      }
    };

    const renderSettings = () => {
      const valueArray = ref([]);
      Object.values(filterSettings).forEach((value) => {
        if (typeof value === 'object') {
          Object.values(value).forEach((item) => valueArray.value.push(Number(item)));
        } else {
          valueArray.value.push(Number(value));
        }
      });
      isFiltered.value = valueArray.value.some((number) => number > 0);
      isInvalid.value = filterSettings.minPrice && filterSettings.maxPrice
      && filterSettings.minPrice > filterSettings.maxPrice;
    };

    const filterCatalog = (settings) => {
      emit('update:pageSettings', Object.assign(props.pageSettings, settings));
    };

    const filterReset = () => {
      filterCatalog({
        page: 1,
        categoryId: 0,
        minPrice: 0,
        maxPrice: 0,
        colorIds: [],
        materialIds: [],
        seasonIds: [],
      });

      const deleteProperties = (objArr) => {
        objArr.forEach((obj) => {
          Reflect.ownKeys(obj).forEach((item) => Reflect.deleteProperty(obj, item));
        });
      };

      deleteProperties([colorCheckboxes, materialCheckboxes, seasonCheckboxes, filterSettings]);
      filterSettings.categoryId = 0;
      checkboxesElementsArray.forEach((element) => Reflect
        .deleteProperty(checkboxesElementsArray, element));
    };
    // eslint-disable-next-line
    watch(() => Object.assign({},filterSettings), renderSettings);

    const renderCheckboxes = (array) => {
      watch(
        // eslint-disable-next-line
        array.reduce((arr, item) => [...arr, () => Object.assign({}, item.obj)], []),
        () => {
          array.forEach((item) => {
            filterSettings[item.key] = Object.entries(item.obj).reduce(
              (arr, [id, value]) => (value ? [...arr, id] : arr),
              [],
            );
          });
        },
      );
    };

    renderCheckboxes([
      { obj: colorCheckboxes, key: 'colorIds' },
      { obj: materialCheckboxes, key: 'materialIds' },
      { obj: seasonCheckboxes, key: 'seasonIds' },
    ]);

    if (localStorage.getItem('categoryId')) {
      filterSettings.categoryId = Number(localStorage.getItem('categoryId'));
    }

    watch(
      () => filterSettings.categoryId,
      (value) => {
        localStorage.setItem('categoryId', value);
      },
    );

    return {
      filterReset,
      collectCheckboxElements,
      isInvalid,
      renderSettings,
      isFiltered,
      filterCatalog,
      colorCheckboxes,
      materialCheckboxes,
      seasonCheckboxes,
      filterSettings,
      propertiesForFilter,
    };
  },
});
</script>
<style>
.colors__radio:checked ~ .colors__value::before {
  border-color: #000;
}

.filter__submit.error {
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: #000;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
</style>
