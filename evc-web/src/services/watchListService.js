import { httpGet, httpPost, httpDelete, httpPut } from './http';

export async function getWatchList(tags) {
  return httpPost(`stock/watchlist`, {tags});
}

export async function watchStock(symbol) {
  return httpPost(`stock/s/${symbol}/watch`);
}

export async function unwatchStock(symbol) {
  return httpPost(`stock/s/${symbol}/unwatch`);
}

export async function bellStock(symbol) {
  return httpPost(`stock/s/${symbol}/bell`);
}

export async function unbellStock(symbol) {
  return httpPost(`stock/s/${symbol}/unbell`);
}

export async function listCustomTags() {
  return httpGet(`custom_tags`);
}

export async function createCustomTag(name) {
  return httpPost(`custom_tags`, { name });
}

export async function deleteCustomTag(id) {
  return httpDelete(`custom_tags/${id}`);
}

export async function saveStockCustomTags(symbol, tags) {
  return httpPost(`/stock/s/${symbol}/custom_tags`, { tags });
}