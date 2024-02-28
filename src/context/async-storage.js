import AsyncStorage from '@react-native-community/async-storage';
import SyncStorage from 'sync-storage';

export async function getItem() {
  const value = await AsyncStorage.getItem('token');
  return value ? value : null;
}
export async function setItem(value) {
  return AsyncStorage.setItem('token', value);
}
export async function removeItem() {
  removeUser();
  return AsyncStorage.removeItem('token');
}
export function setToken(value) {
  SyncStorage.set('token', value);
}
export function getToken() {
  return SyncStorage.get('token');
}
export function removeToken() {
  SyncStorage.remove('token');
}
export function setUser(value) {
  SyncStorage.set('userInfo', value);
}

export function getUser() {
  return SyncStorage.get('userInfo');
}
export function removeUser() {
  SyncStorage.remove('userInfo');
}
export function setLoginTime(value) {
  SyncStorage.set('loginTime', value);
}
export function getLoginTime() {
  return SyncStorage.get('loginTime');
}
export function removeLoginTime() {
  SyncStorage.remove('loginTime');
}
