export default function () {
  // eslint-disable-next-line
  const pluralize = require('pluralize-ru');

  const pluralizeProductAmount = (quantity) => pluralize(quantity, 'Товаров нет', '%d товар', '%d товара', '%d товаров');

  const editNumberFormat = (number) => new Intl.NumberFormat('ru-RU').format(number);

  const translateColorName = (colorName) => {
    const translatationData = {
      red: 'Красный',
      blue: 'Синий',
      green: 'Зеленый',
      yellow: 'Желтый',
      purple: 'Фиолетовый',
      pink: 'Розовый',
      black: 'Черный',
      white: 'Белый',
    };
    return translatationData[colorName.toLowerCase().trim()];
  };

  const findImage = (item) => (item.gallery ? item.gallery[0].file.url : false);

  return {
    findImage,
    translateColorName,
    editNumberFormat,
    pluralizeProductAmount,
  };
}
