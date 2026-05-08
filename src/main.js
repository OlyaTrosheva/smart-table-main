import "./fonts/ys-display/fonts.css";
import "./style.css";

// import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";

import { initSorting } from "./components/sorting.js";
import { initSearching } from "./components/searching.js";
import { initFiltering } from "./components/filtering.js";
// @todo: подключение

// Исходные данные используемые в render()
const api = initData();

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  // Вместо копирования массива создаем пустой объект для параметров
  let query = {};

  // КОММЕНТИРУЕМ ЭТОТ БЛОК:
  // result = applySearching(result, state, action);
  // result = applyFiltering(result, state, action);
  // result = applySorting(result, state, action);
  // result = applyPagination(result, state, action);

  // Раскомментируем и адаптируем поиск под query
  query = applySearching(query, state, action);

  // Раскомментируем и адаптируем фильтрацию под query:
  query = applyFiltering(query, state, action);

  // Раскомментируем и адаптируем сортировку под query
  query = applySorting(query, state, action);

  // Применяем пагинацию ДО запроса к серверу и обновляем наш query
  query = applyPagination(query, state, action);

  // Идем в интернет за записями, передавая объект фильтров query
  const { total, items } = await api.getRecords(query);

  // Перерисовываем кнопочки страниц после того, как сервер вернул нам total
  updatePagination(total, query);

  sampleTable.render(items);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"], // Порядок правильный: search перед header
    after: ["pagination"],
  },
  render,
);

// Передаем только ОДИН аргумент — имя поля 'search', как и прописано в Шаге 5
const applySearching = initSearching("search");

// Шаг 3
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements,
);

const applySorting = initSorting([
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);

// Если у вас есть шаблон пагинации 'pagination', убедитесь, что он создается корректно.
// Ниже стандартная инициализация, если элементы берутся из под-шаблонов таблицы:
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination?.elements || {}, // защита на случай, если пагинация еще не добавлена в after
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");

    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;

    return el;
  },
);

// Переменная для хранения индексов, которые придут с сервера
let indexes = {};

// Шаг 1: Создаем функцию init() для первоначальной загрузки индексов

async function init() {
  // Скачиваем продавцов и покупателей с сервера Яндекса
  const serverIndexes = await api.getIndexes();

  // ЗАДАНИЕ: Передаем элементы формы и скачанных продавцов в функцию обновления
  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: serverIndexes.sellers,
  });
}

// Подключаем приложение к экрану
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

// ЗАДАНИЕ: Заменяем старый вызов render() на цепочку с промисом
init().then(render);
