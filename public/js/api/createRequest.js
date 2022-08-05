/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = options.responseType;

    const formData = new FormData();
    let params = "";

    if (options.data) {
        if (options.method === "GET") {
        params =
        "?" +
        Object.entries(options.data)
            .map(
                ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join("&");
        } else {
        Object.entries(options.data).forEach((value) =>
        formData.append(...value)
        );
    }
    }

    xhr.onload = () => {
        options.callback(null, xhr.response);
    };

    xhr.onerror = () => {
        options.callback(xhr.response, null);
    };

    xhr.open(options.method, options.url + params);
    xhr.send(formData);

    return xhr;
};