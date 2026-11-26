import { useEffect, useState } from "react";
import { INSTAGRAM_DM_URL } from "./links.js";

/* Набор и бесплатный урок. Все даты меняются только здесь. */
// Telegram-канал, где проходит бесплатный урок
export const CHANNEL_URL = "https://t.me/serdarai";
export const LESSON_LABEL = "3 декабря";
export const ENROLL_LABEL = "6 декабря";
// Конец дня урока и последняя секунда набора (по московскому времени).
// После этих моментов надписи сами исчезают с сайта.
const LESSON_END = new Date("2026-12-03T23:59:59+03:00").getTime();
const ENROLL_END = new Date("2026-12-06T23:59:59+03:00").getTime();

// Старая скидка 10% до 25 ноября: уже закончилась, цены со скидкой не показываются.
const SALE_END = new Date("2026-11-25T23:59:59+03:00").getTime();
export const isPromoActive = () => Date.now() < SALE_END;

const isLessonAhead = () => Date.now() < LESSON_END;
const isEnrollOpen = () => Date.now() < ENROLL_END;

const pad = (n) => String(n).padStart(2, "0");

export function Countdown({ to = ENROLL_END, label = `До закрытия набора, ${ENROLL_LABEL}` }) {
  const [left, setLeft] = useState(() => to - Date.now());

  useEffect(() => {
    const id = setInterval(() => setLeft(to - Date.now()), 1000);
    return () => clearInterval(id);
  }, [to]);

  if (left <= 0) return null;
  const s = Math.floor(left / 1000);
  const parts = [
    [Math.floor(s / 86400), "дн"],
    [Math.floor((s % 86400) / 3600), "ч"],
    [Math.floor((s % 3600) / 60), "мин"],
    [s % 60, "сек"],
  ];

  return (
    <div className="countdown" role="timer" aria-label={label}>
      {parts.map(([n, unit]) => (
        <span key={unit}>
          <b>{pad(n)}</b>
          <small>{unit}</small>
        </span>
      ))}
    </div>
  );
}

/* Тонкая полоса над шапкой */
export function PromoBar() {
  if (!isEnrollOpen()) return null;
  if (isLessonAhead()) {
    return (
      <a className="promo-bar" href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">
        <b>Бесплатный урок {LESSON_LABEL}</b>
        <span>Набор до {ENROLL_LABEL}</span>
      </a>
    );
  }
  return (
    <a className="promo-bar" href="#plans">
      <b>Набор закрывается {ENROLL_LABEL}</b>
    </a>
  );
}

/* Баннер над тарифами */
export function PlansPromo() {
  if (!isEnrollOpen()) return null;
  return (
    <div className="plans-promo">
      <div>
        <h3>Набор закрывается {ENROLL_LABEL}</h3>
        <p>После этого записаться на этот поток будет нельзя.</p>
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
  const lesson = isLessonAhead();

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
          {lesson ? `${LESSON_LABEL} · Бесплатно` : "Бесплатно · 0 $"}
        </span>
        <h3 id="popup-title">
          {lesson ? (
            <>
              Бесплатный <span>живой урок</span>
            </>
          ) : (
            <>
              Начни <span>с бесплатной консультации</span>
            </>
          )}
        </h3>
        <p>
          {lesson
            ? "Покажу, как я делаю свои реалистичные ролики, которые набирают больше миллиона просмотров."
            : "Узнаем твою цель и честно скажем, подходит ли курс."}
        </p>
        <a
          className="btn btn-solid"
          href={lesson ? CHANNEL_URL : INSTAGRAM_DM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          {lesson ? "Прийти на урок" : "Записаться на консультацию"}
        </a>
        <small>
          {lesson ? "Урок проходит в моём Telegram-канале." : "Консультация бесплатная. Денег за неё не берём."}
        </small>
      </div>
    </div>
  );
}

/* Карточка бесплатного урока под первым экраном. Исчезает после дня урока. */
export function LessonCard() {
  if (!isLessonAhead()) return null;
  return (
    <section className="lesson">
      <div>
        <span className="free-badge">{LESSON_LABEL} · Бесплатно</span>
        <h2>
          Бесплатный <span>живой урок</span>
        </h2>
        <p>Покажу, как я делаю реалистичные ролики, которые набирают больше миллиона просмотров. Приходи, даже если ты с полного нуля.</p>
      </div>
      <a className="btn btn-solid" href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">
        <span>Прийти на урок</span>
      </a>
    </section>
  );
}
