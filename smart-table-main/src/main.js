import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";

import { initSorting } from "./components/sorting.js";
import { initSearching } from "./components/searching.js";
import { initFiltering } from "./components/filtering.js";
// @todo: подключение

// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

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
function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let result = [...data]; // копируем для последующего изменения
  // @todo: использование


  result = applySearching(result, state, action);
  result = applyFiltering(result, state, action);
  result = applySorting(result, state, action);
  result = applyPagination(result, state, action);
  

  sampleTable.render(result);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ['search', 'header', 'filter'], // Порядок правильный: search перед header
    after: ['pagination'],
  },
  render,
);

// --- ИСПРАВЛЕННАЯ ИНИЦИАЛИЗАЦИЯ ---

// Передаем только ОДИН аргумент — имя поля 'search', как и прописано в Шаге 5
const applySearching = initSearching('search'); 

const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Если у вас есть шаблон пагинации 'pagination', убедитесь, что он создается корректно. 
// Ниже стандартная инициализация, если элементы берутся из под-шаблонов таблицы:
const applyPagination = initPagination(
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

// Подключаем приложение к экрану
const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

// Запускаем первый рендер таблицы
render();

