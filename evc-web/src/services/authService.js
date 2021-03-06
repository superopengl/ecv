import { httpPost, httpGet } from './http';

export async function login(name, password) {
  const data = { name, password };
  return httpPost(`auth/login`, data);
}

export async function signUp(user) {
  return httpPost(`auth/signup`, user);
}

export async function forgotPassword(email) {
  return httpPost(`auth/forgot_password`, { email });
}

export async function resetPassword(token, password) {
  return httpPost(`auth/reset_password`, { token, password });
}

export async function logout() {
  return httpPost(`auth/logout`).catch(() => {});
}

export async function getAuthUser() {
  return httpGet(`auth/user`);
}

export async function impersonate(email) {
  return httpPost(`auth/impersonate`, { email });
}

export async function inviteUser(email, role = 'member') {
  return httpPost(`auth/invite`, { email, role });
}

export async function ssoGoogle(token, referralCode) {
  return httpPost(`auth/sso/google`, { token, referralCode });
}