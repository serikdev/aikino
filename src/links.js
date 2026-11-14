// Ссылки на соцсети. Меняются только здесь — кнопки по всему сайту подхватят.
const TELEGRAM_USER = "manager_aikino";

// Текст, который уже будет написан в Telegram, когда человек нажмёт кнопку.
// Ему останется только нажать «Отправить».
const MESSAGE = "Привет, хочу разбор";

const telegramLink = (text) =>
  `https://t.me/${TELEGRAM_USER}?text=${encodeURIComponent(text)}`;

export const TELEGRAM_URL = telegramLink(MESSAGE);
export const INSTAGRAM_URL = "https://www.instagram.com/serdar_agam/";
export const INSTAGRAM_HANDLE = "@serdar_agam";
