export function initSearching(searchField) {
    // Возвращаем функцию, которая теперь работает с конвертом параметров (query) вместо данных
    return (query, state, action) => { 
        // Проверяем, ввёл ли пользователь что-то в текстовое поле поиска
        return state[searchField] ? Object.assign({}, query, { 
            search: state[searchField] // Если да, кладём этот текст в параметр 'search' для сервера
        }) : query; // Если поле поиска пустое, отдаём конверт query обратно без изменений
    }
}
 