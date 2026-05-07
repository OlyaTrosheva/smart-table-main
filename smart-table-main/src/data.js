import { makeIndex } from "./lib/utils.js";

const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api'; 

export function initData(sourceData) {
    // Переменные для кеширования данных сервера
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    // Преобразуем данные от сервера в формат, который ждет наша таблица
    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    // Функция получения индексов с сервера (продавцы и покупатели)
    const getIndexes = async () => {
        if (!sellers || !customers) { 
            // Загружаем данные параллельно через Promise.all
            [sellers, customers] = await Promise.all([ 
                fetch(`${BASE_URL}/sellers`).then(res => res.json()), 
                fetch(`${BASE_URL}/customers`).then(res => res.json()), 
            ]);
        }
        return { sellers, customers };
    }

    // Функция получения записей о продажах с сервера с учетом фильтров
    const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query); 
        const nextQuery = qs.toString(); 

        // КЕШИРОВАНИЕ: если фильтры не менялись, не мучаем сервер — отдаем прошлый результат
        if (lastQuery === nextQuery && !isUpdated) { 
            return lastResult; 
        }

        // Если фильтры изменились, делаем новый асинхронный запрос
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        lastQuery = nextQuery; 
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    };
}
