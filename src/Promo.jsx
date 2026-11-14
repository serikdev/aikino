import { useEffect, useState } from "react";
import { TELEGRAM_URL } from "./links.js";

/* Акция. Все даты и размер скидки меняются только здесь. */
export const COURSE_START = "15 декабря";
export const DEADLINE_LABEL = "25 ноября";
export const DISCOUNT = 10;
// Последняя секунда акции (по московскому времени). После неё скидка сама исчезнет с сайта.
const DEADLINE = new Date("2026-11-25T23:59:59+03:00").getTime();

export const isPromoActive = () => Date.now() < DEADLINE;

const pad = (n) => String(n).padStart(2, "0");

export function Countdown() {
  const [left, setLeft] = useState(() => DEADLINE - Date.now());

  useEffect(() => {
    const id = setInterval(() => setLeft(DEADLINE - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (left <= 0) return null;
  const s = Math.floor(left / 1000);
  const parts = [
    [Math.floor(s / 86400), "дн"],
    [Math.floor((s % 86400) / 3600), "ч"],
    [Math.floor((s % 3600) / 60), "мин"],
    [s % 60, "сек"],
  ];

  return (
    <div className="countdown" role="timer" aria-label={`До конца скидки, ${DEADLINE_LABEL}`}>
      {parts.map(([n, label]) => (
        <span key={label}>
          <b>{pad(n)}</b>
          <small>{label}</small>
        </span>
      ))}
    </div>
  );
}

/* Тонкая полоса над шапкой */
export function PromoBar() {
  return (
    <a className="promo-bar" href="#plans">
      <span>Старт {COURSE_START}</span>
      {isPromoActive() && (
        <b>
          −{DISCOUNT}% на любой тариф до {DEADLINE_LABEL}
        </b>
      )}
    </a>
  );
}

/* Баннер над тарифами */
export function PlansPromo() {
  if (!isPromoActive()) {
    return (
      <div className="plans-promo">
        <div>
          <h3>Старт {COURSE_START}</h3>
        </div>
      </div>
    );
  }
  return (
    <div className="plans-promo">
      <div>
        <h3>
          −{DISCOUNT}% на любой тариф
        </h3>
        <p>
          При оплате до {DEADLINE_LABEL}. Курс стартует {COURSE_START}.
        </p>
      </div>
      <Countdown />
    </div>
  );
}

/* Всплывающее окно: один раз за визит, после 25 секунд или половины страницы */
const SEEN_KEY = "promo-popup-seen";

function wasSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* хранилище недоступно, просто не запоминаем */
  }
}

export function Popup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (wasSeen()) return;

    const show = () => {
      setOpen(true);
      markSeen();
      cleanup();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.45) show();
    };
    const timer = setTimeout(show, 25000);
    window.addEventListener("scroll", onScroll, { passive: true });

    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  const promo = isPromoActive();

  return (
    <div className="popup-backdrop" onClick={() => setOpen(false)}>
      <div
        className="popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="popup-close"
          aria-label="Закрыть"
          onClick={() => setOpen(false)}
        />
        <span className="free-badge">
          {promo ? `До ${DEADLINE_LABEL}` : "Бесплатно · 0 $"}
        </span>
        <h3 id="popup-title">
          {promo ? (
            <>
              −{DISCOUNT}% <span>на любой тариф</span>
            </>
          ) : (
            <>
              Начни <span>с бесплатного разбора</span>
            </>
          )}
        </h3>
        <p>
          {promo
            ? `Курс стартует ${COURSE_START}. Сначала бесплатный разбор, потом решаешь.`
            : `Курс стартует ${COURSE_START}. Разберём твой Instagram и скажем, подходит ли курс.`}
        </p>
        {promo && <Countdown />}
        <a
          className="btn btn-solid"
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          {promo ? "Забрать скидку в Telegram" : "Записаться на разбор"}
        </a>
        <small>Сообщение уже написано. Просто нажми «Отправить».</small>
      </div>
    </div>
  );
}
