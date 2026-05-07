import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // #2.3 — подготавливаем шаблон кнопки и очищаем контейнер (это остается на месте)
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  // Переменная для хранения общего количества страниц между вызовами
  let pageCount;

  // ФУНКЦИЯ 1: Собираем параметры ДЛЯ сервера
  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // Переносим обработку действий кнопок из @todo: #2.6
    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }
    }

    // Добавляем лимит и страницу в объект запроса query, не ломая старый объект
    return Object.assign({}, query, {
        limit,
        page
    });
  }

  // ФУНКЦИЯ 2: Перерисовываем кнопочки ПОСЛЕ ответа сервера
  const updatePagination = (total, { page, limit }) => {
    // Вычисляем количество страниц на основе общего числа строк от сервера
    pageCount = Math.ceil(total / limit);

    // Переносим код из @todo: #2.4 (вывод кнопок)
    const visiblePages = getPages(page, pageCount, 5);

    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    // Переносим код из @todo: #2.5 (обновляем текстовый статус: Строки Х-Y из Z)
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  }

  // Возвращаем две функции вместо одной
  return {
    updatePagination,
    applyPagination
  };
};
