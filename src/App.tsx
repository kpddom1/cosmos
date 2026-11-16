import { useState, useCallback, useEffect } from "react";
import { OBJECTS, SHORT_ADDR, CLUSTER_COLORS, DATE } from "./data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── Slide definitions ───
const SLIDES = [
  "title", "conclusions", "methodology", "geography",
  ...OBJECTS.map((_, i) => `object-${i}`),
  "summary", "chart", "drivers", "budget", "risks", "recommendations", "sources"
];

function App() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  const goNext = useCallback(() => setCurrent(c => Math.min(c + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const slideId = SLIDES[current];

  return (
    <div className="min-h-screen bg-[#0a1628] text-white flex flex-col">
      {/* Top bar */}
      <header className="bg-[#10243E] border-b border-[#E0B341]/20 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-1 bg-[#E0B341] rounded" />
          <span className="text-xs font-semibold text-[#E0B341] tracking-wider uppercase">
            Cosmos Hotel Group · Инвестиционный анализ
          </span>
        </div>
        <span className="text-xs text-gray-400">
          Слайд {current + 1} / {total}
        </span>
      </header>

      {/* Slide content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 min-h-[calc(100vh-120px)]">
          {slideId === "title" && <TitleSlide />}
          {slideId === "conclusions" && <ConclusionsSlide />}
          {slideId === "methodology" && <MethodologySlide />}
          {slideId === "geography" && <GeographySlide />}
          {slideId.startsWith("object-") && <ObjectSlide index={parseInt(slideId.split("-")[1])} />}
          {slideId === "summary" && <SummarySlide />}
          {slideId === "chart" && <ChartSlide />}
          {slideId === "drivers" && <DriversSlide />}
          {slideId === "budget" && <BudgetSlide />}
          {slideId === "risks" && <RisksSlide />}
          {slideId === "recommendations" && <RecommendationsSlide />}
          {slideId === "sources" && <SourcesSlide />}
        </div>
      </main>

      {/* Navigation */}
      <footer className="bg-[#10243E] border-t border-white/10 px-4 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
        >
          ← Назад
        </button>

        {/* Dot navigation */}
        <div className="flex gap-1 flex-wrap justify-center max-w-[60%]">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-[#E0B341] scale-125" : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={current === total - 1}
          className="px-4 py-2 bg-[#E0B341]/10 hover:bg-[#E0B341]/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-[#E0B341] transition-colors"
        >
          Далее →
        </button>
      </footer>
    </div>
  );
}

// ─── Slide Components ───

function TitleSlide() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] text-center">
      <div className="w-16 h-1 bg-[#E0B341] mb-6" />
      <p className="text-sm font-semibold text-[#E0B341] tracking-widest uppercase mb-4">
        Инвестиционный анализ · Курортная недвижимость
      </p>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Апартаменты под управлением <span className="text-[#E0B341]">Cosmos</span>
        <br />на юге России: сколько стоит 1 м²
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl mb-10">
        Сочи · Адлер · Хостинский р-н (Кудепста, Мацеста) · Дагомыс · Новомихайловский / Ольгинка ·
        Крым: Ялта, Евпатория, Севастополь
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
        {[
          { big: "14", small: "объектов в выборке" },
          { big: "300–715", small: "тыс ₽ за 1 м²" },
          { big: "485", small: "медиана, тыс ₽/м²" },
          { big: "2,4×", small: "разброс цены метра" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1B3655] rounded-xl p-5 text-center">
            <div className="text-3xl font-bold text-[#E0B341]">{stat.big}</div>
            <div className="text-sm text-gray-300 mt-1">{stat.small}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-8">
        Срез данных: {DATE} · цены — публичные предложения, не оферта
      </p>
    </div>
  );
}

function ConclusionsSlide() {
  const points = [
    "Разброс цены метра — 2,4×: от ~300 тыс ₽/м² (Евпатория, «Аурея») до ~715 тыс ₽/м² (Адлер, первая линия).",
    "Средний ориентир по кластерам: Большой Сочи ≈ 552 тыс ₽/м², Туапсинский округ ≈ 485 тыс, Крым ≈ 423 тыс.",
    "Премия Сочи к Крыму — около +30%; медиана по 14 объектам — 485 тыс ₽/м².",
    "Условные 30 м² стоят от 9,0 млн ₽ (Аурея) до 21,4 млн ₽ (Cosmos Adler Hotel).",
    "Готовый работающий отель дешевле новостройки: вторичка Le Rond Sochi — 290–432 тыс ₽/м² против 530–715 тыс в строящихся проектах Сочи.",
    "Минимальный чек входа — Крым: студия 20,7 м² за 6,75 млн ₽ («Аурея», срок 2028).",
  ];
  return (
    <SlideWrapper kicker="Executive Summary" title="Главные выводы">
      <ul className="space-y-4 mb-8">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-[#E0B341] mt-1 shrink-0">●</span>
            <span className="text-gray-200 text-base leading-relaxed">{p}</span>
          </li>
        ))}
      </ul>
      <div className="bg-[#F2F5F8] rounded-lg p-5 border-l-4 border-[#E0B341]">
        <p className="text-[#10243E] font-semibold">
          Ключевая мысль: бренд Cosmos — надбавка к цене, но стоимость и риски определяют локация, стадия готовности и застройщик.
        </p>
      </div>
    </SlideWrapper>
  );
}

function MethodologySlide() {
  const points = [
    "Источники: реестр наш.дом.рф (средняя цена м² по проекту), карточки ЖК ЦИАН / Авито / Яндекс.Недвижимость, сайты застройщиков и отделов продаж.",
    "«Ориентир ₽/м²» — середина между средней ценой по проекту и текущими объявлениями; «от» — минимальный лот.",
    "Средняя по ДДУ и цена в объявлении расходятся на 20–45%: Мацеста — 420 тыс (наш.дом.рф) против 540–610 тыс в лотах.",
    "Почти все лоты — нежилые апартаменты; отделка «под ключ» с мебелью, кроме «Ауреи» (черновая по карточке ЖК).",
    "Заявленная доходность 15–40% годовых — прогноз продавца, а не обязательство оператора.",
    "В самой Хосте объектов Cosmos с продажей апартаментов не найдено: ближайшие — Кудепста (Iskra) и Мацеста.",
  ];
  return (
    <SlideWrapper kicker="Источники и допущения" title="Методология: как читать цифры">
      <ul className="space-y-4 mb-8">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-[#2E8B9A] mt-1 shrink-0">●</span>
            <span className="text-gray-200 text-base leading-relaxed">{p}</span>
          </li>
        ))}
      </ul>
      <div className="bg-[#F2F5F8] rounded-lg p-5 border-l-4 border-[#2E8B9A]">
        <p className="text-[#10243E] font-semibold text-sm">
          Перед сделкой сверять актуальную проектную декларацию и прайс застройщика: брокерские лендинги содержат устаревшие цены.
        </p>
      </div>
    </SlideWrapper>
  );
}

function GeographySlide() {
  const clusters = [
    { name: "Большой Сочи", count: 6, orient: 552, range: "340–715", color: "#10243E" },
    { name: "Туапсинский округ", count: 2, orient: 485, range: "450–520", color: "#2E8B9A" },
    { name: "Крым и Севастополь", count: 6, orient: 423, range: "300–615", color: "#E0B341" },
  ];
  return (
    <SlideWrapper kicker="Структура выборки" title="География: 3 кластера, 14 объектов">
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#10243E]">
              <th className="px-4 py-3 text-sm font-semibold text-white">Кластер</th>
              <th className="px-4 py-3 text-sm font-semibold text-white text-right">Объектов</th>
              <th className="px-4 py-3 text-sm font-semibold text-white text-right">Ориентир, тыс ₽/м²</th>
              <th className="px-4 py-3 text-sm font-semibold text-white text-right">Диапазон, тыс ₽/м²</th>
            </tr>
          </thead>
          <tbody>
            {clusters.map((c, i) => (
              <tr key={i} className={i % 2 ? "bg-[#F2F5F8]/5" : "bg-transparent"}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-gray-200">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-gray-200 font-semibold">{c.count}</td>
                <td className="px-4 py-3 text-right text-[#E0B341] font-bold">{c.orient}</td>
                <td className="px-4 py-3 text-right text-gray-300">{c.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 mb-6">
        <p className="text-gray-300 flex items-start gap-2">
          <span className="text-[#E0B341]">●</span>
          Cosmos Hotel Group — 2-я гостиничная сеть России (Forbes 2024), 40+ отелей и 10 000+ номеров, входит в АФК «Система».
        </p>
        <p className="text-gray-300 flex items-start gap-2">
          <span className="text-[#E0B341]">●</span>
          В Крыму сеть заявляет 14 отелей и 17,4 тыс. номеров/апартаментов до 2030 года: 4 в прямом управлении, 10 по франшизе.
        </p>
      </div>
      <div className="bg-[#F2F5F8] rounded-lg p-4 border-l-4 border-[#10243E]">
        <p className="text-[#10243E] font-semibold text-sm">
          Новомихайловский = проект Riverta в с. Пляхо (мкр. Широкая Щель) рядом с ВДЦ «Орлёнок».
        </p>
      </div>
    </SlideWrapper>
  );
}

function ObjectSlide({ index }: { index: number }) {
  const o = OBJECTS[index];
  const clusterColor = CLUSTER_COLORS[o.cluster];
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: clusterColor }} />
        <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: clusterColor }}>
          {o.cluster}
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{o.name}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price card */}
        <div className="bg-[#10243E] rounded-xl p-6 border border-[#E0B341]/20">
          <p className="text-xs font-semibold text-[#E0B341] tracking-wider mb-2">ЦЕНА ЗА 1 М²</p>
          <p className="text-5xl font-bold text-white">≈ {o.orient}</p>
          <p className="text-lg text-gray-300 mt-1">тыс ₽ / м²</p>
          <p className="text-sm text-gray-400 mt-3">диапазон {o.low}–{o.high} тыс</p>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 tracking-wider mb-1">АДРЕС</p>
            <p className="text-lg font-semibold text-white">{o.address}</p>
          </div>
          <div className="space-y-2">
            <DetailRow icon="💰" text={o.entry} />
            <DetailRow icon="🏗" text={o.stage} />
            <DetailRow icon="🏊" text={o.infra} />
            <DetailRow icon="📊" text={`Как считали: ${o.note}`} />
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 bg-[#F2F5F8] rounded-lg p-5 border-l-4" style={{ borderColor: clusterColor }}>
        <p className="text-[#10243E] font-semibold">
          <span className="text-gray-500 font-normal">Вывод: </span>{o.insight}
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-4">Источники: {o.src}</p>
    </div>
  );
}

function DetailRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2 text-gray-200">
      <span className="shrink-0">{icon}</span>
      <span className="text-sm leading-relaxed">{text}</span>
    </div>
  );
}

function SummarySlide() {
  const sorted = [...OBJECTS].sort((a, b) => a.orient - b.orient);
  return (
    <SlideWrapper kicker="Все 14 объектов, по возрастанию цены" title="Сводно: название — адрес — цена за 1 м²">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#10243E]">
              <th className="px-3 py-2.5 font-semibold text-white">Отель</th>
              <th className="px-3 py-2.5 font-semibold text-white">Адрес</th>
              <th className="px-3 py-2.5 font-semibold text-white text-right">₽ за 1 м²</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((o, i) => (
              <tr key={i} className={i % 2 ? "bg-white/5" : ""}>
                <td className="px-3 py-2 text-gray-200 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CLUSTER_COLORS[o.cluster] }} />
                    <span>{o.name.replace("Cosmos ", "")}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-gray-400">{SHORT_ADDR[o.short] || o.address}</td>
                <td className="px-3 py-2 text-right font-semibold text-[#E0B341]">
                  ≈ {o.orient} тыс <span className="text-gray-500 font-normal">({o.low}–{o.high})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Ориентир — середина между средней ценой проекта (наш.дом.рф / агрегаторы) и текущими объявлениями.
      </p>
    </SlideWrapper>
  );
}

function ChartSlide() {
  const sorted = [...OBJECTS].sort((a, b) => a.orient - b.orient);
  const data = sorted.map(o => ({ name: o.short, value: o.orient, cluster: o.cluster }));

  return (
    <SlideWrapper kicker="тыс ₽ за 1 м², ориентир" title="Рейтинг цены метра">
      <div className="h-[420px] w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 40, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis type="number" domain={[0, 800]} tick={{ fill: "#9CA3AF", fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fill: "#D1D5DB", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#10243E", border: "1px solid #E0B341", borderRadius: 8 }}
              labelStyle={{ color: "#E0B341" }}
              itemStyle={{ color: "#fff" }}
              formatter={(value: number) => [`${value} тыс ₽/м²`, "Цена"]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={CLUSTER_COLORS[entry.cluster]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend + info */}
      <div className="flex flex-wrap gap-6">
        <div className="flex gap-4">
          {Object.entries(CLUSTER_COLORS).map(([name, color]) => (
            <div key={name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-300">{name}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#F2F5F8] rounded-lg p-4 ml-auto max-w-xs">
          <p className="text-[#10243E] text-sm font-semibold mb-2">Условные 30 м²:</p>
          <div className="text-[#10243E] text-xs space-y-1">
            <p>Аурея — 9,0 млн ₽</p>
            <p>Atlant — 13,5 млн ₽</p>
            <p>Riverta — 15,6 млн ₽</p>
            <p>Kurortny — 18,0 млн ₽</p>
            <p>Adler Hotel — 21,4 млн ₽</p>
            <p className="font-bold mt-2">Разница 2,38×</p>
          </div>
        </div>
      </div>
    </SlideWrapper>
  );
}

function DriversSlide() {
  const drivers = [
    { head: "1. Курорт", body: "Сочи/Адлер держат премию ~30% к Крыму; Ялта внутри Крыма — +45% к Евпатории." },
    { head: "2. Линия до моря", body: "Первая линия (Adler Hotel 715, Atlant 450) против 800–900 м (Kurortny 600, Мацеста 540). Hidden Yalta 615 — исключение: работают бренд и виды." },
    { head: "3. Стадия и тип сделки", body: "Готовая вторичка (Le Rond 340) дешевле котлована под брендом (Stay Adler 585)." },
    { head: "4. Площадь лота", body: "Мелкие студии дороже за метр: Kurortny 20 м² — 528 тыс, 22 м² — 675 тыс ₽/м²." },
    { head: "5. Отделка и комплектация", body: "«Под ключ с мебелью» (Мацеста, Riverta, Hidden) против черновой («Аурея») — до 100–150 тыс ₽/м² на доведение." },
  ];
  return (
    <SlideWrapper kicker="Факторы" title="Почему разброс 2,4×: 5 драйверов цены">
      <div className="space-y-3">
        {drivers.map((d, i) => (
          <div key={i} className="bg-[#F2F5F8] rounded-lg p-4 border-l-4 border-[#E0B341] flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
            <span className="text-[#10243E] font-bold text-sm md:w-48 shrink-0">{d.head}</span>
            <span className="text-[#10243E] text-sm leading-relaxed">{d.body}</span>
          </div>
        ))}
      </div>
    </SlideWrapper>
  );
}

function BudgetSlide() {
  const rows = [
    { budget: "до 10 млн ₽", options: "Аурея — студия 20,7 м² / 6,75 млн; Le Rond — студия 26,3 м² / 8,99 млн (вторичка); Iskra — от 9,9 млн / 18,5 м²" },
    { budget: "10–15 млн ₽", options: "Kurortny 20 м² / 10,56 млн; Odyssey 34,8 м² / 10,78 млн; Дарсан от 11,2 млн; Adler Hotel от 11,9 млн; Stay Adler 22,1 м² / 13,4 млн; Moreol' 27 м² / 13,65 млн; Smart 32,9 м² / 14,23 млн; Riverta от 14 млн; Hidden Yalta 26,6 м² / 14,8 млн" },
    { budget: "15–20 млн ₽", options: "Atlant 30,5 м² / 15,07 млн; Мацеста 29 м² / 16,9 млн; Kurortny 34–35,7 м² / 17,0–19,8 млн" },
    { budget: "20 млн ₽ +", options: "Видовые и семейные лоты: Stay Adler до 29,3 млн; Мацеста до 46,1 млн; Hidden Yalta до 49,9 млн; Odyssey пентхаусы от 51,7 млн" },
  ];
  return (
    <SlideWrapper kicker="Минимальные лоты, ноябрь 2026" title="Что купить под бюджет">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#10243E]">
              <th className="px-4 py-3 font-semibold text-white w-32">Бюджет</th>
              <th className="px-4 py-3 font-semibold text-white">Реальные варианты (лот · площадь · цена)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i % 2 ? "bg-white/5" : ""}>
                <td className="px-4 py-4 text-[#E0B341] font-bold align-top">{r.budget}</td>
                <td className="px-4 py-4 text-gray-200 leading-relaxed">{r.options}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Цены — минимальные предложения по объектам на дату среза; наличие лотов меняется, прайс уточняется у застройщика.
      </p>
    </SlideWrapper>
  );
}

function RisksSlide() {
  const left = [
    "Апартаменты = нежилое: нет постоянной регистрации, выше коммунальные платежи и налоги.",
    "Бренд ≠ договор: требуйте подтверждение договора управления Cosmos — срок, полномочия, порядок замены оператора.",
    "Доходность считать «на руки»: минус комиссия оператора, OPEX, уборка, ремонт, коммуналка, налоги.",
  ];
  const right = [
    "Сверять прайс, а не лендинг: расхождение наш.дом.рф ↔ объявления до 30–45% (Мацеста, Аурея).",
    "Сроки: проверять актуальную проектную декларацию (Мацеста — IV кв. 2026 при 97%; Аурея — II кв. 2028).",
    "Ликвидность выхода: Le Rond показывает, что готовый номер может продаваться дешевле «бумажного» аналога.",
    "Личное проживание: число дней, закрытые даты высокого сезона, тариф доп. ночей — фиксировать в договоре.",
  ];
  return (
    <SlideWrapper kicker="Due Diligence" title="Риски и чек-лист перед сделкой">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          {left.map((p, i) => (
            <div key={i} className="flex items-start gap-2 text-gray-200 text-sm leading-relaxed">
              <span className="text-red-400 mt-0.5">⚠</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {right.map((p, i) => (
            <div key={i} className="flex items-start gap-2 text-gray-200 text-sm leading-relaxed">
              <span className="text-[#2E8B9A] mt-0.5">✓</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#10243E] rounded-lg p-5 border border-[#E0B341]/30">
        <p className="text-white font-semibold text-sm">
          Правило: сравнивать чистый доход после всех удержаний, а не рекламную ставку доходности.
        </p>
      </div>
    </SlideWrapper>
  );
}

function RecommendationsSlide() {
  const points = [
    "Минимальный чек + рост капитала: Евпатория — «Аурея» (~300 тыс ₽/м²) и Cosmos Smart (~450 тыс); горизонт 2028.",
    "Денежный поток сразу: Odyssey Residence (сдан, ~315 тыс) и Le Rond Sochi (работает, вторичка ~340 тыс).",
    "Баланс цены и локации в Сочи: Iskra / Кудепста (535 тыс) и Мацеста (540 тыс) вместо 585–715 тыс в Адлере.",
    "Семейный сегмент Краснодарского края: Riverta / Пляхо (~520 тыс) и Moreol' / Ольгинка (~450 тыс).",
    "Крым «город + море»: Atlant Севастополь (~450 тыс, первая линия) рациональнее Hidden Yalta (~615 тыс, трансфер до пляжа).",
    "Премиум и всесезонность: Cosmos Adler Hotel (~715 тыс) — первая линия, аэропорт и Красная Поляна в одном плече.",
  ];
  return (
    <SlideWrapper kicker="Что выбирать" title="Выводы и рекомендации по сценариям">
      <ul className="space-y-4 mb-8">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="bg-[#E0B341] text-[#10243E] font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-gray-200 text-base leading-relaxed">{p}</span>
          </li>
        ))}
      </ul>
      <div className="bg-[#F2F5F8] rounded-lg p-5 border-l-4 border-[#E0B341]">
        <p className="text-[#10243E] font-semibold text-sm">
          Что дальше: до 2030 г. Cosmos заявляет 14 отелей и 17,4 тыс. номеров в Крыму (4 своих + 10 франшиз) —
          конкуренция за гостя вырастет, выигрывать будет локация, а не вывеска.
        </p>
      </div>
    </SlideWrapper>
  );
}

function SourcesSlide() {
  const srcLeft = [
    "наш.дом.рф — проектные декларации и средняя цена м²: объекты 43380 (Мацеста), 67547 (Riverta), 61747 (Moreol'), 61309 (Hidden Yalta), 61188 (Дарсан), 65836 (Аурея), 66939 (Smart Евпатория), 58637 (Odyssey), 51516 (Atlant).",
    "ЦИАН: карточки ЖК Cosmos Stay Adler, Cosmos Hotel Kurortny, Hidden Yalta, Резиденция Дарсан, Мореоль, Atlant.",
    "Авито: объявления и карточки ЖК (Le Rond, Мацеста, Stay Adler, Аурея, Odyssey, Atlant, Moreol').",
    "Яндекс.Недвижимость: карточки 3856090 (Stay Adler), 4130544 (Аурея), moreol-4042834 (Moreol').",
  ];
  const srcRight = [
    "Сайты отелей и операторов: cosmosgroup.ru, lerond.cosmosgroup.ru, adler.cosmosgroup.ru, atlantapart.ru, hidden-yalta.ru, darsanyalta.ru, odissej-residence.ru.",
    "Отделы продаж / брокеры: sochipolis.ru, novostroykasochi.ru, kvartira-na-more.ru, integrity-sochi.ru, aska-realty.ru, vincent-realty.ru, krasdom.ru.",
    "«Ъ»: kommersant.ru/doc/8624457 (планы CHG в Крыму, 28.04.2026); kommersant.ru/doc/8292730 (Odyssey, 22.12.2025).",
    "Профиль оператора: morein.pro/hotel-operator/cosmos (бренды, портфель, FAQ по договорам управления).",
  ];
  return (
    <SlideWrapper kicker="Проверяемость" title="Источники и дата среза">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          {srcLeft.map((p, i) => (
            <p key={i} className="text-gray-300 text-xs leading-relaxed flex items-start gap-2">
              <span className="text-[#E0B341] shrink-0">●</span>
              <span>{p}</span>
            </p>
          ))}
        </div>
        <div className="space-y-3">
          {srcRight.map((p, i) => (
            <p key={i} className="text-gray-300 text-xs leading-relaxed flex items-start gap-2">
              <span className="text-[#2E8B9A] shrink-0">●</span>
              <span>{p}</span>
            </p>
          ))}
        </div>
      </div>
      <div className="bg-[#10243E] rounded-lg p-5 border border-[#E0B341]/30">
        <p className="text-white font-semibold text-sm">
          Срез: {DATE}. Часть прайсов — брокерские предложения. Материалы не являются публичной офертой и инвестиционной рекомендацией.
        </p>
      </div>
    </SlideWrapper>
  );
}

// ─── Wrapper ───
function SlideWrapper({ kicker, title, children }: { kicker?: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      {kicker && (
        <p className="text-xs font-semibold text-[#E0B341] tracking-widest uppercase mb-1">{kicker}</p>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h2>
      {children}
    </div>
  );
}

export default App;
