import { useEffect, useRef, useState } from "react";
import {
  facts,
  skills,
  myVideos,
  studentCase,
  lessonThreeVideos,
  versus,
  how,
  weekMap,
  modules,
  plans,
  compare,
} from "./data.js";
import { TELEGRAM_URL, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "./links.js";
import { PromoBar, PlansPromo, Popup, isPromoActive } from "./Promo.jsx";

/* ---------- Иконки ---------- */

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.94 4.6 18.9 19.2c-.23 1.02-.83 1.27-1.68.79l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.93.46l.33-4.72 8.6-7.77c.37-.33-.08-.52-.58-.19L7.13 13.2l-4.58-1.43c-1-.31-1.02-1 .2-1.47l17.9-6.9c.83-.31 1.56.19 1.29 1.2z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.3" cy="6.7" r="1.25" fill="currentColor" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- Кнопки соцсетей ---------- */

function SocialButton({ kind, variant = "solid", children, className = "" }) {
  const isTg = kind === "telegram";
  return (
    <a
      className={`btn btn-${variant} ${className}`}
      href={isTg ? TELEGRAM_URL : INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {isTg ? <TelegramIcon /> : <InstagramIcon />}
      <span>{children ?? (isTg ? "Telegram" : "Instagram")}</span>
      {variant !== "icon" && <Arrow />}
    </a>
  );
}

/* ---------- Появление при скролле ---------- */

function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px 20% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function SectionHead({ children }) {
  return (
    <Reveal className="sec-head">
      <h2>{children}</h2>
    </Reveal>
  );
}

/* ---------- Шапка ---------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-inner">
        <a className="brand" href="#top">
          <span className="brand-dot" />
          serdar_agam
        </a>
        <div className="nav-links">
          <a href="#program">Программа</a>
          <a href="#plans">Тарифы</a>
        </div>
        <div className="nav-social">
          <a
            className="icon-btn"
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <TelegramIcon />
          </a>
          <a
            className="icon-btn"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ---------- Первый экран ---------- */

function Hero() {
  return (
    <header className="hero" id="top">
      <div className="viewfinder" aria-hidden="true">
        <i className="c tl" />
        <i className="c tr" />
        <i className="c bl" />
        <i className="c br" />
      </div>
      <div className="hero-top">
        <span className="rec">
          <i />
          REC
        </span>
        <span className="pill">Курс AI-видео</span>
      </div>
      <h1>
        От нуля <span>до реалистичного кино-ролика</span>
      </h1>
      <p className="lead">
        Без камеры, актёров и съёмок. Только нейросети и правильный процесс.
      </p>
      <div className="hero-cta">
        <SocialButton kind="telegram" variant="solid">
          Бесплатный разбор
        </SocialButton>
        <SocialButton kind="instagram" variant="ghost">
          Мои результаты
        </SocialButton>
      </div>
      <p className="hero-note">
        <b>Разбор бесплатный.</b> Денег за него не берём.
      </p>
      <div className="facts">
        {facts.map((f) => (
          <div className="fact" key={f.label}>
            <b>{f.n}</b>
            <small>{f.label}</small>
          </div>
        ))}
      </div>
    </header>
  );
}

/* ---------- Бесплатный разбор ---------- */

const freeSteps = [
  {
    title: "Разберём твой Instagram",
    text: "Что уже работает, а что мешает расти.",
  },
  {
    title: "Узнаем твой формат",
    text: "Что ты хочешь снимать и для чего.",
  },
  {
    title: "Честно скажем, подходит ли курс",
    text: "Если не подходит, скажем прямо.",
  },
];

function FreeReview() {
  return (
    <section id="free">
      <Reveal className="free">
        <span className="free-badge">Бесплатно · 0 $</span>
        <h2>
          Сначала разбор. <span>Платить не нужно</span>
        </h2>
        <ol className="free-steps">
          {freeSteps.map((s, i) => (
            <li key={s.title}>
              <b>0{i + 1}</b>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="free-quote">
          Я сам долго боялся и начал очень поздно. Поэтому первый шаг для тебя{" "}
          <b>бесплатный</b>: не бойся, денег за разбор мы не берём.
        </p>
        <div className="free-cta">
          <SocialButton kind="telegram" variant="solid">
            Записаться на разбор
          </SocialButton>
          <SocialButton kind="instagram" variant="ghost">
            Смотри мои результаты
          </SocialButton>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Результат ---------- */

function Result() {
  return (
    <section>
      <SectionHead>
        Что у тебя будет <span>через 8 недель</span>
      </SectionHead>
      <div className="result">
        <Reveal className="film">
          <svg className="film-play" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="32" fill="currentColor" />
            <path d="M26 20.5v23a1.5 1.5 0 0 0 2.3 1.3l18-11.5a1.5 1.5 0 0 0 0-2.6l-18-11.5a1.5 1.5 0 0 0-2.3 1.3z" fill="#d1fe17" />
          </svg>
          <div>
            <h3>Киношные ролики</h3>
            <p>Ты делаешь их уже в процессе обучения. Это практикум, а не теория.</p>
          </div>
        </Reveal>
        <ul className="skills">
          {skills.map((s, i) => (
            <Reveal as="li" key={s}>
              <span className="check">✓</span>
              {s}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Ролики ---------- */

// Следит, виден ли блок на экране: вне экрана видео не играет
function useInView(threshold = 0.4) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* Ряд роликов: все играют одновременно, пока ряд на экране */
function ClipRow({ videos, tag }) {
  const [wrap, inView] = useInView(0.25);
  const els = useRef([]);

  useEffect(() => {
    els.current.forEach((v) => {
      if (!v) return;
      if (inView) v.play().catch(() => {});
      else v.pause();
    });
  }, [inView]);

  return (
    <div className="clips" ref={wrap}>
      {videos.map((v, i) => (
        <div className="clip" key={v.src}>
          <video
            ref={(el) => (els.current[i] = el)}
            src={v.src}
            poster={v.poster}
            muted
            loop
            playsInline
            preload="none"
          />
          <span className="clip-tag">{tag}</span>
        </div>
      ))}
    </div>
  );
}

function MyWorks() {
  if (myVideos.length === 0) return null;
  return (
    <section id="works">
      <SectionHead>
        Больше миллиона просмотров. <span>Ты будешь уметь так же</span>
      </SectionHead>
      <Reveal>
        <ClipRow videos={myVideos} tag="AI" />
      </Reveal>
      <Reveal as="p" className="clips-note">
        Это мои ролики. Ни камеры, ни актёров: только нейросети.
      </Reveal>
    </section>
  );
}

/* Работы учеников: кейс и ролики после третьего урока */
function StudentWorks() {
  const [wrap, inView] = useInView();
  const video = useRef(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  return (
    <section id="students">
      <SectionHead>
        Так снимают <span>мои ученики</span>
      </SectionHead>

      <Reveal className="case">
        <div className="clip case-clip" ref={wrap}>
          <video
            ref={video}
            src={studentCase.src}
            poster={studentCase.poster}
            muted
            loop
            playsInline
            preload="none"
          />
          <span className="clip-tag">Кейс ученика</span>
        </div>
        <div className="case-side">
          <a
            className="case-profile"
            href={studentCase.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={studentCase.profileShot}
              alt={`Профиль ${studentCase.handle} в Instagram`}
              width="670"
              height="370"
              loading="lazy"
            />
          </a>
          <p>
            Обогнал меня по подписчикам и просмотрам. Сейчас работает с известными
            брендами.
          </p>
        </div>
      </Reveal>

      <Reveal as="h3" className="sub-head">
        А так снимают уже <span>после третьего урока</span>
      </Reveal>
      <Reveal>
        <ClipRow videos={lessonThreeVideos} tag="Урок 3" />
      </Reveal>
      <Reveal as="p" className="clips-note">
        Сделано во время обучения.
      </Reveal>

      <Reveal className="students-cta">
        <SocialButton kind="telegram" variant="solid">
          Хочу так же
        </SocialButton>
      </Reveal>
    </section>
  );
}

/* ---------- Отличие ---------- */

function Versus() {
  return (
    <section>
      <SectionHead>
        Чем этот курс <span>отличается</span>
      </SectionHead>
      <Reveal className="vs">
        <div className="vs-row head">
          <div>Как часто учат</div>
          <div>Как учу я</div>
        </div>
        {versus.map(([bad, good]) => (
          <div className="vs-row" key={bad}>
            <div>{bad}</div>
            <div>{good}</div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* ---------- Как проходит ---------- */

function How() {
  return (
    <section>
      <SectionHead>
        Как проходит <span>обучение</span>
      </SectionHead>
      <div className="how">
        {how.map((h, i) => (
          <Reveal className="card" key={h.title}>
            <b>{h.big}</b>
            <h3>{h.title}</h3>
            <p>{h.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Мини-группа ---------- */

// Сколько человек в одной мини-группе внутри потока. Меняется только здесь.
const GROUP_SIZE = 10;

const groupPerks = [
  {
    big: "Свой чат",
    title: `На ${GROUP_SIZE} человек`,
    text: "Закрытый чат твоей мини-группы в Telegram. Здесь не стыдно задать любой вопрос.",
  },
  {
    big: "Тебя видно",
    title: "В своей мини-группе",
    text: "В маленькой группе видно каждого участника и каждый ролик. Твой вопрос не утонет в ленте.",
  },
  {
    big: "Ты не один",
    title: "Рядом такие же новички",
    text: "Идеи, работы и поддержка от группы. Вместе проще дойти до финала.",
  },
];

function Group() {
  return (
    <section id="group">
      <SectionHead>
        Своя мини-группа <span>и закрытый чат</span>
      </SectionHead>
      <div className="group">
        <Reveal className="film group-main">
          <b>{GROUP_SIZE}</b>
          <div>
            <h3>Человек в твоей мини-группе</h3>
          </div>
        </Reveal>
        <div className="group-perks">
          {groupPerks.map((g, i) => (
            <Reveal className="card" key={g.big}>
              <b>{g.big}</b>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Программа ---------- */

function Module({ m, open, onToggle }) {
  return (
    <div className={`module ${m.final ? "final" : ""} ${open ? "is-open" : ""}`} id={m.id}>
      <button
        type="button"
        className="module-head"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${m.id}-body`}
      >
        <span className="num">{m.num}</span>
        <h3>{m.title}</h3>
        <span className="when">{m.when}</span>
        <span className="plus" aria-hidden="true" />
      </button>
      <div className="module-body" id={`${m.id}-body`}>
        <div className="module-inner">
          {m.weeks.map((w, wi) => (
            <div className="week" key={wi}>
              {w.label && <div className="week-label">{w.label}</div>}
              {w.lessons.map((l) => (
                <div className="lesson" key={l.n}>
                  <div className="n">
                    Урок<b>{l.n}</b>
                  </div>
                  <div>
                    <h4>{l.title}</h4>
                    <ul>
                      {l.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="task">
                <strong>{w.taskLabel ?? "Задание"}</strong>
                {w.task}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Program() {
  const [open, setOpen] = useState(() => new Set(["m1"]));

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const jump = (e, id) => {
    e.preventDefault();
    setOpen((prev) => new Set(prev).add(id));
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const allOpen = open.size === modules.length;

  return (
    <section id="program">
      <SectionHead>
        Программа <span>по неделям</span>
      </SectionHead>
      <Reveal>
        <div className="map" aria-label="Недели курса">
          {weekMap.map((w) => (
            <a href={`#${w.to}`} key={w.w} onClick={(e) => jump(e, w.to)}>
              <div className={`bar ${w.fin ? "fin" : ""} ${open.has(w.to) ? "on" : ""}`} />
              <span>{w.w}</span>
            </a>
          ))}
        </div>
      </Reveal>
      <div className="modules">
        {modules.map((m, i) => (
          <Reveal key={m.id}>
            <Module m={m} open={open.has(m.id)} onToggle={() => toggle(m.id)} />
          </Reveal>
        ))}
      </div>
      <button
        type="button"
        className="expand-all"
        onClick={() => setOpen(allOpen ? new Set() : new Set(modules.map((m) => m.id)))}
      >
        {allOpen ? "Свернуть все уроки" : "Показать все 16 уроков"}
      </button>
    </section>
  );
}

/* ---------- Тарифы ---------- */

function Plans() {
  const promo = isPromoActive();
  return (
    <section id="plans">
      <SectionHead>Тарифы</SectionHead>
      <Reveal>
        <PlansPromo />
      </Reveal>
      <div className="plans">
        {plans.map((p, i) => (
          <Reveal className={`plan ${p.best ? "best" : ""}`} key={p.name}>
            {p.best && <span className="badge">Рекомендую</span>}
            <h3>{p.name}</h3>
            {promo && <div className="price-old">{p.price}</div>}
            <div className="price">{promo ? p.sale : p.price}</div>
            <div className="price-rub">{promo ? p.saleRub : p.rub}</div>
            <p>{p.text}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="cmp-wrap">
        <table className="cmp">
          <thead>
            <tr>
              <th>Что входит</th>
              <th>Старт</th>
              <th className="hl">Практик</th>
              <th>Наставник</th>
            </tr>
          </thead>
          <tbody>
            {compare.map(([label, a, b, c]) => (
              <tr key={label}>
                <td>{label}</td>
                {[a, b, c].map((v, i) => (
                  <td key={i} className={i === 1 ? "hl" : ""}>
                    {v ? <span className="y">✓</span> : <span className="no">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      <Reveal className="need">
        <b>Понадобится:</b> компьютер или телефон.
      </Reveal>
    </section>
  );
}

/* ---------- Призыв ---------- */

function Cta() {
  return (
    <Reveal className="cta">
      <div>
        <h2>Сделай свой первый кино-ролик</h2>
        <p>Начни с бесплатного разбора. Денег за него не берём.</p>
      </div>
      <div className="cta-btns">
        <SocialButton kind="telegram" variant="dark">
          Бесплатный разбор
        </SocialButton>
        <SocialButton kind="instagram" variant="dark">
          {INSTAGRAM_HANDLE}
        </SocialButton>
      </div>
    </Reveal>
  );
}

/* ---------- Нижняя панель на телефоне ---------- */

function Dock() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const nearBottom =
        window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 420;
      setVisible(window.scrollY > 560 && !nearBottom);
    };
    // не чаще одного замера на кадр, чтобы прокрутка оставалась плавной
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`dock ${visible ? "is-visible" : ""}`}>
      <SocialButton kind="telegram" variant="solid">
        Бесплатный разбор
      </SocialButton>
      <SocialButton kind="instagram" variant="ghost" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="bg" aria-hidden="true">
        <div className="grid" />
      </div>
      <PromoBar />
      <Nav />
      <main className="wrap">
        <Hero />
        <FreeReview />
        <Result />
        <MyWorks />
        <StudentWorks />
        <Versus />
        <How />
        <Group />
        <Program />
        <Plans />
        <Cta />
        <footer>
          <span>serdar_agam · курс по AI-видео</span>
          <span className="footer-social">
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </span>
        </footer>
      </main>
      <Dock />
      <Popup />
    </>
  );
}
