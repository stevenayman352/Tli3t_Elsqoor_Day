import { SESSION_KEY } from './constants';

export const genId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
};

export const saveSession = (data) =>
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));

export const clearSession = () =>
  localStorage.removeItem(SESSION_KEY);

export const fmtTime = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('ar-EG', {
    hour: '2-digit', minute: '2-digit',
  });
};
