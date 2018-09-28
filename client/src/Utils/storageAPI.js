export const setObject = (key, object) => localStorage.setItem(key, JSON.stringify(object));
export const getObject = key => JSON.parse(localStorage.getItem(key));
