import Cookies from 'js-cookie';

const SystemKey = 'system_id';
const TokenKey = 'access_token';
const UserKey = 'user_info';

// 获取cookies中存储的系统ID
export function getSystemId() {
  return Cookies.get(SystemKey);
}

// 往cookies中存储系统ID
export function setSystemId(systemId) {
  return Cookies.set(SystemKey, systemId);
}

// 移除系统ID
export function removeSystemId() {
  return Cookies.remove(SystemKey);
}

// 获取cookies中存储的token
export function getToken() {
  return Cookies.get(TokenKey);
}

// 往cookies中存储token
export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

// 移除token
export function removeToken() {
  return Cookies.remove(TokenKey);
}

// 获取用户信息
export function getUserInfo(key) {
  let
    userJson = Cookies.get(UserKey),
    userInfo = userJson ? JSON.parse(userJson) : {};

  return key ? userInfo[key] : userInfo;
}

// 设置用户信息：可以设置整个userInfo，也可设置单个属性
export function setUserInfo(value, key) {
  let userInfo = getUserInfo();
  if (key) {
    userInfo[key] = value;
  } else {
    Object.assign(userInfo, value);
  }
  Cookies.set(UserKey, userInfo);
}

// 移除用户信息
export function removeUserInfo() {
  Cookies.remove(UserKey);
}

// 清空整个用户登陆信息
export function removeUser() {
  removeSystemId();
  removeToken();
  removeUserInfo();
}
