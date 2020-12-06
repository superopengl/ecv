import { httpGet, httpPost, httpDelete } from './http';


export async function getMyAccount() {
  return httpGet(`account`);
}

export async function getAccount(userId) {
  return httpGet(`user/${userId}/account`);
}

export async function adjustBalance(userId, amount) {
  return httpPost(`user/${userId}/balance`, {amount});
}

export async function listMyBalanceHistory() {
  return httpGet(`balance/history`);
}

export async function listUserBalanceHistory(userId) {
  return httpGet(`user/${userId}/balance/history`);
}

