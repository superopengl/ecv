import { httpGet, httpPost, httpDelete } from './http';

export async function changePassword(password, newPassword) {
  return httpPost(`user/change_password`, { password, newPassword });
}

export async function searchUsers(payload) {
  return httpPost(`user/search`, { page: 0, size: 50, ...payload });
}

export async function listAllUsers() {
  return httpGet(`user`);
}

export async function deleteUser(id) {
  return httpDelete(`user/${id}`);
}

export async function setPasswordForUser(id, password) {
  return httpPost(`user/${id}/set_password`, { password });
}

export async function saveProfile(userId, profile) {
  return httpPost(`user/${userId}/profile`, profile);
}

export async function setUserTags(userId, tags) {
  return httpPost(`user/${userId}/tags`, { tags });
}

export async function getUserGuestSignUpChart(params) {
  return httpGet(`user/metrics/guest_signup`, params);
}

export async function guestUserPing(deviceId) {
  if (deviceId) {
    return httpPost(`user/guest/ping`, { deviceId });
  }
}