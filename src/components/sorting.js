import { sortMap } from "../lib/sort.js"; // sortCollection больше не нужен, удаляем его

export function initSorting(columns) {
  // Меняем первый аргумент data на query
  return (query, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // Сохраняем логику запоминания клика из старого @todo: #3.1
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // Сбрасываем стрелочки у остальных колонок из старого @todo: #3.2
      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
        }
      });
    } else {
      // Читаем текущий режим стрелочек из старого @todo: #3.3
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    // ЗАДАНИЕ: Формируем параметр сортировки в виде "поле:направление" (например, "date:asc")
    const sort = (field && order !== 'none') ? `${field}:${order}` : null; 

    // ЗАДАНИЕ: Если сортировка активна — добавляем её в query, если нет — возвращаем query без изменений
    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
