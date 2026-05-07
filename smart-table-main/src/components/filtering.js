export function initFiltering(elements) {
    // ФУНКЦИЯ 1: Заполняем выпадающий список продавцов ПОСЛЕ получения данных с сервера
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            if (elements[elementName]) {
                elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    return el;
                }))
            }
        })
    }

    // ФУНКЦИЯ 2: Собираем данные из полей фильтра ДО отправки запроса на сервер
    const applyFiltering = (query, state, action) => {
        // Переносим код обработки очистки поля по крестику из старого @todo: #4.2
        if (action?.name === 'clear') {
            const field = action.dataset.field;
            const input = action.closest('form')?.querySelector(`[name="${field}"]`);

            if (input) input.value = '';
            state[field] = '';
        }

        // Формируем параметры фильтрации для сервера
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                // Ищем заполненные поля INPUT или SELECT
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { 
                    // Формируем вложенный объект в формате, который ждет сервер Яндекса: filter[имя_поля]
                    filter[`filter[${elements[key].name}]`] = elements[key].value; 
                }
            }
        })

        // Если в фильтре что-то заполнено — склеиваем с query, если нет — отдаем query без изменений
        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; 
    }

    // Возвращаем две новые функции коробкой
    return {
        updateIndexes,
        applyFiltering
    }
}
