import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Tab = "scanner" | "analysis" | "tips" | "saved" | "profile";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/e384235a-fd5c-4223-8544-7b4cb591e724/files/a561e39a-598b-496f-81e9-06444bec3b9b.jpg";

const SAVED_PRODUCTS = [
  { name: "Греческий йогурт", brand: "Danone", cal: 97, protein: 10, fat: 5, carbs: 4, score: 92, tag: "Белок" },
  { name: "Овсянка цельная", brand: "Nordic", cal: 344, protein: 13, fat: 7, carbs: 59, score: 88, tag: "Клетчатка" },
  { name: "Лосось атл.", brand: "Мираторг", cal: 208, protein: 20, fat: 13, carbs: 0, score: 95, tag: "Омега-3" },
  { name: "Авокадо", brand: "Свежий", cal: 160, protein: 2, fat: 15, carbs: 9, score: 90, tag: "Жиры" },
];

const TIPS = [
  {
    icon: "Droplets",
    title: "Водный баланс",
    text: "Выпивайте не менее 30 мл воды на каждый кг веса. Для 70 кг — это 2,1 литра в день.",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-500",
  },
  {
    icon: "Leaf",
    title: "Клетчатка — основа",
    text: "25–35 г клетчатки в день снижают риск сердечно-сосудистых заболеваний на 30%.",
    color: "bg-emerald-50 border-green-200",
    iconColor: "text-emerald-700",
  },
  {
    icon: "Clock",
    title: "Режим питания",
    text: "Ешьте каждые 3–4 часа. Это стабилизирует уровень сахара и предотвращает переедание.",
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    icon: "Fish",
    title: "Омега-3 жиры",
    text: "2 порции жирной рыбы в неделю обеспечат суточную норму Омега-3 для здоровья сердца.",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-500",
  },
  {
    icon: "Apple",
    title: "Радуга на тарелке",
    text: "Старайтесь есть овощи и фрукты 5 разных цветов — каждый цвет содержит уникальные антиоксиданты.",
    color: "bg-red-50 border-red-200",
    iconColor: "text-red-500",
  },
  {
    icon: "Moon",
    title: "Ужин за 3 часа",
    text: "Последний приём пищи не позднее 20:00. Это улучшает качество сна и ускоряет метаболизм.",
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-500",
  },
];

function ScoreRing({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#0A6B4A" : score >= 60 ? "#EAB308" : "#EF4444";
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#E5E7EB" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <span className="absolute text-sm font-bold font-golos" style={{ color }}>{score}</span>
    </div>
  );
}

function NutrientBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-ibm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value} г <span className="text-muted-foreground">/ {max} г</span></span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ScannerTab() {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanned(true); }, 2500);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {!scanned ? (
        <div className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-golos font-bold text-foreground">Сканер штрихкода</h2>
            <p className="text-muted-foreground text-sm mt-1 font-ibm">Наведите камеру на упаковку продукта</p>
          </div>

          <div className="relative mx-auto w-full max-w-xs aspect-square rounded-3xl overflow-hidden bg-gray-900 flex items-center justify-center">
            <img src={HERO_IMAGE} alt="scanner" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="relative w-full h-full flex items-center justify-center">
              {[
                "top-4 left-4 border-t-4 border-l-4 rounded-tl-xl",
                "top-4 right-4 border-t-4 border-r-4 rounded-tr-xl",
                "bottom-4 left-4 border-b-4 border-l-4 rounded-bl-xl",
                "bottom-4 right-4 border-b-4 border-r-4 rounded-br-xl"
              ].map((cls, i) => (
                <div key={i} className={`absolute w-8 h-8 border-[#0A6B4A] scanner-corner ${cls}`} />
              ))}
              {scanning && (
                <div className="absolute left-4 right-4 h-0.5 bg-[#0A6B4A] opacity-80 scan-line" style={{ boxShadow: "0 0 10px #0A6B4A" }} />
              )}
              <div className="text-center z-10">
                {scanning ? (
                  <div className="animate-pulse-slow">
                    <Icon name="ScanLine" size={40} className="text-[#0A6B4A] mx-auto" />
                    <p className="text-white text-xs mt-2 font-ibm">Сканирование...</p>
                  </div>
                ) : (
                  <div>
                    <Icon name="Barcode" size={40} className="text-white/60 mx-auto" />
                    <p className="text-white/60 text-xs mt-2 font-ibm">Штрихкод здесь</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleScan}
            disabled={scanning}
            className="w-full py-4 rounded-2xl font-golos font-semibold text-white text-base transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #0A6B4A, #12875E)" }}
          >
            {scanning ? "Сканирую..." : "Сканировать продукт"}
          </button>

          <div className="med-card p-4">
            <p className="text-xs text-muted-foreground font-ibm text-center">Или введите штрихкод вручную</p>
            <div className="flex gap-2 mt-3">
              <input
                className="flex-1 px-3 py-2 rounded-xl border border-border text-sm font-ibm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-[#0A6B4A]/30"
                placeholder="4607038321456"
              />
              <button className="px-4 py-2 rounded-xl bg-[#0A6B4A] text-white text-sm font-ibm font-medium">Найти</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-golos font-bold">Результат</h2>
            <button onClick={() => setScanned(false)} className="text-sm text-[#0A6B4A] font-ibm font-medium">← Назад</button>
          </div>
          <div className="med-card p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🥛</span>
              </div>
              <div className="flex-1">
                <h3 className="font-golos font-bold text-lg leading-tight">Кефир 2,5%</h3>
                <p className="text-muted-foreground text-sm font-ibm">Простоквашино</p>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-emerald-50 text-[#0A6B4A] text-xs border-0">Молочные</Badge>
                  <Badge className="bg-blue-50 text-blue-700 text-xs border-0">Пробиотики</Badge>
                </div>
              </div>
              <ScoreRing score={84} />
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs font-ibm text-muted-foreground mb-3 uppercase tracking-wide">На 100 г продукта</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Калории", value: "51", unit: "ккал", color: "text-amber-600" },
                  { label: "Белки", value: "2,8", unit: "г", color: "text-blue-600" },
                  { label: "Жиры", value: "2,5", unit: "г", color: "text-orange-500" },
                  { label: "Углев.", value: "4,0", unit: "г", color: "text-purple-500" },
                ].map((n) => (
                  <div key={n.label} className="bg-muted/40 rounded-xl p-2 text-center">
                    <p className={`text-lg font-golos font-bold ${n.color}`}>{n.value}</p>
                    <p className="text-[10px] text-muted-foreground font-ibm">{n.unit}</p>
                    <p className="text-[10px] text-muted-foreground font-ibm">{n.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="w-full py-3.5 rounded-2xl font-golos font-semibold text-white text-sm" style={{ background: "linear-gradient(135deg, #0A6B4A, #12875E)" }}>
            <Icon name="BookmarkPlus" size={16} className="inline mr-2" />
            Сохранить продукт
          </button>
        </div>
      )}
    </div>
  );
}

function AnalysisTab() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-golos font-bold">Анализ питания</h2>
        <p className="text-muted-foreground text-sm font-ibm mt-0.5">Сегодня, 18 апреля</p>
      </div>

      <div className="med-card p-5">
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg width="96" height="96" className="-rotate-90">
              <circle cx="48" cy="48" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle cx="48" cy="48" r="40" fill="none" stroke="#0A6B4A" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - 1482 / 2100)}`}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-golos font-bold text-foreground">1482</span>
              <span className="text-[9px] text-muted-foreground font-ibm">ккал</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="font-golos font-semibold text-foreground">Калории</span>
              <span className="text-sm text-muted-foreground font-ibm">из 2100</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-[#0A6B4A] rounded-full" style={{ width: "70%" }} />
            </div>
            <p className="text-xs text-[#0A6B4A] font-ibm">Осталось 618 ккал на ужин</p>
          </div>
        </div>
      </div>

      <div className="med-card p-5 space-y-4">
        <h3 className="font-golos font-semibold text-base">Макронутриенты</h3>
        <NutrientBar label="Белки" value={78} max={120} color="#3B82F6" />
        <NutrientBar label="Жиры" value={52} max={70} color="#F97316" />
        <NutrientBar label="Углеводы" value={162} max={200} color="#A855F7" />
        <NutrientBar label="Клетчатка" value={18} max={30} color="#10B981" />
      </div>

      <div className="med-card p-5 space-y-3">
        <h3 className="font-golos font-semibold text-base">Витамины и минералы</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Витамин D", pct: 45, color: "#EAB308" },
            { name: "Кальций", pct: 68, color: "#06B6D4" },
            { name: "Железо", pct: 72, color: "#EF4444" },
            { name: "Магний", pct: 55, color: "#8B5CF6" },
            { name: "Витамин C", pct: 110, color: "#0A6B4A" },
            { name: "B12", pct: 90, color: "#EC4899" },
          ].map((v) => (
            <div key={v.name} className="bg-muted/30 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-ibm text-muted-foreground">{v.name}</span>
                <span className="text-xs font-golos font-semibold" style={{ color: v.pct >= 100 ? "#0A6B4A" : v.color }}>{Math.min(v.pct, 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(v.pct, 100)}%`, backgroundColor: v.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="med-card p-5 space-y-3">
        <h3 className="font-golos font-semibold text-base">Приёмы пищи</h3>
        {[
          { time: "08:30", name: "Завтрак", items: "Овсянка, яйца, кофе", cal: 420, emoji: "🌅" },
          { time: "12:45", name: "Обед", items: "Куриный суп, хлеб, яблоко", cal: 680, emoji: "☀️" },
          { time: "16:00", name: "Перекус", items: "Йогурт греческий, орехи", cal: 210, emoji: "🍵" },
          { time: "—", name: "Ужин", items: "Не добавлен", cal: 0, emoji: "🌙" },
        ].map((meal) => (
          <div key={meal.name} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
            <span className="text-xl w-8 text-center">{meal.emoji}</span>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <span className="font-ibm font-medium text-sm">{meal.name}</span>
                <span className="text-xs text-muted-foreground font-ibm">{meal.time}</span>
              </div>
              <p className="text-xs text-muted-foreground font-ibm">{meal.items}</p>
            </div>
            <span className="text-sm font-golos font-semibold text-foreground">{meal.cal > 0 ? `${meal.cal}` : "—"}</span>
            {meal.cal > 0 && <span className="text-xs text-muted-foreground font-ibm">ккал</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TipsTab() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-golos font-bold">Рекомендации</h2>
        <p className="text-muted-foreground text-sm font-ibm mt-0.5">Персональные советы по питанию</p>
      </div>

      <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #0A6B4A, #0D9488)" }}>
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon name="Sparkles" size={24} className="text-white" />
        </div>
        <div>
          <p className="font-golos font-bold text-white">Совет дня</p>
          <p className="text-white/80 text-sm font-ibm leading-tight">Сегодня добавьте больше белка — вы на 35% ниже нормы</p>
        </div>
      </div>

      <div className="space-y-3">
        {TIPS.map((tip, i) => (
          <div key={i} className={`med-card p-4 border ${tip.color} flex gap-4 animate-fade-in`} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Icon name={tip.icon as "Droplets"} size={20} className={tip.iconColor} />
            </div>
            <div>
              <h4 className="font-golos font-semibold text-sm text-foreground">{tip.title}</h4>
              <p className="text-muted-foreground text-xs font-ibm mt-0.5 leading-relaxed">{tip.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedTab() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-golos font-bold">Сохранённые</h2>
          <p className="text-muted-foreground text-sm font-ibm mt-0.5">{SAVED_PRODUCTS.length} полезных продукта</p>
        </div>
        <button className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Icon name="SlidersHorizontal" size={18} className="text-[#0A6B4A]" />
        </button>
      </div>

      <div className="relative">
        <Icon name="Search" size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
        <input
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-white text-sm font-ibm focus:outline-none focus:ring-2 focus:ring-[#0A6B4A]/30"
          placeholder="Поиск продуктов..."
        />
      </div>

      <div className="space-y-3">
        {SAVED_PRODUCTS.map((p, i) => (
          <div key={i} className="med-card p-4 flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-2xl">
              {["🥛", "🌾", "🐟", "🥑"][i]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-golos font-semibold text-sm leading-tight">{p.name}</h4>
                  <p className="text-muted-foreground text-xs font-ibm">{p.brand}</p>
                </div>
                <ScoreRing score={p.score} />
              </div>
              <div className="flex gap-3 mt-2">
                <span className="text-xs font-ibm"><span className="font-semibold text-amber-600">{p.cal}</span> <span className="text-muted-foreground">ккал</span></span>
                <span className="text-xs font-ibm"><span className="font-semibold text-blue-600">{p.protein}г</span> <span className="text-muted-foreground">белок</span></span>
                <span className="text-xs font-ibm"><span className="font-semibold text-orange-500">{p.fat}г</span> <span className="text-muted-foreground">жир</span></span>
              </div>
              <Badge className="mt-2 bg-emerald-50 text-[#0A6B4A] text-[10px] border-0 px-2 py-0">{p.tag}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileTab() {
  const [goal, setGoal] = useState<"loss" | "maintain" | "gain">("maintain");

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="med-card p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)" }}>
            👤
          </div>
          <div>
            <h2 className="text-xl font-golos font-bold">Алексей Петров</h2>
            <p className="text-muted-foreground text-sm font-ibm">28 лет · 78 кг · 180 см</p>
            <Badge className="mt-1 bg-emerald-50 text-[#0A6B4A] border-0 text-xs">Здоровый ИМТ 24.1</Badge>
          </div>
        </div>
      </div>

      <div className="med-card p-5 space-y-3">
        <h3 className="font-golos font-semibold">Цель питания</h3>
        <div className="grid grid-cols-3 gap-2">
          {([
            { key: "loss", label: "Похудение", emoji: "📉" },
            { key: "maintain", label: "Поддержание", emoji: "⚖️" },
            { key: "gain", label: "Набор массы", emoji: "💪" },
          ] as const).map((g) => (
            <button
              key={g.key}
              onClick={() => setGoal(g.key)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${goal === g.key ? "border-[#0A6B4A] bg-emerald-50" : "border-border bg-muted/30"}`}
            >
              <div className="text-xl mb-1">{g.emoji}</div>
              <p className={`text-[11px] font-ibm font-medium leading-tight ${goal === g.key ? "text-[#0A6B4A]" : "text-muted-foreground"}`}>{g.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="med-card p-5 space-y-4">
        <h3 className="font-golos font-semibold">Прогресс за неделю</h3>
        <NutrientBar label="Выполнение нормы белка" value={78} max={100} color="#3B82F6" />
        <NutrientBar label="Выполнение нормы калорий" value={85} max={100} color="#0A6B4A" />
        <NutrientBar label="Потребление клетчатки" value={60} max={100} color="#10B981" />
        <NutrientBar label="Гидратация" value={72} max={100} color="#06B6D4" />
        <div className="bg-emerald-50 rounded-xl p-3 flex items-center gap-3">
          <Icon name="TrendingUp" size={18} className="text-[#0A6B4A] flex-shrink-0" />
          <p className="text-xs font-ibm text-[#0A6B4A]">Вы на 12% улучшили качество питания за последние 7 дней</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "Barcode", label: "Отсканировано", value: "47", unit: "продуктов" },
          { icon: "Bookmark", label: "Сохранено", value: "12", unit: "продуктов" },
          { icon: "Calendar", label: "Дней в приложении", value: "23", unit: "дня" },
          { icon: "Star", label: "Средняя оценка", value: "87", unit: "баллов" },
        ].map((s) => (
          <div key={s.label} className="med-card p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2">
              <Icon name={s.icon as "Star"} size={18} className="text-[#0A6B4A]" />
            </div>
            <p className="text-2xl font-golos font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground font-ibm">{s.unit}</p>
            <p className="text-[10px] text-muted-foreground font-ibm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="med-card p-5 space-y-3">
        <h3 className="font-golos font-semibold">Параметры тела</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Возраст", value: "28 лет" },
            { label: "Рост", value: "180 см" },
            { label: "Вес", value: "78 кг" },
          ].map((p) => (
            <div key={p.label} className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="font-golos font-bold text-foreground text-base">{p.value}</p>
              <p className="text-[11px] text-muted-foreground font-ibm mt-0.5">{p.label}</p>
            </div>
          ))}
        </div>
        <button className="w-full py-3 rounded-xl border-2 border-[#0A6B4A] text-[#0A6B4A] font-golos font-semibold text-sm hover:bg-emerald-50 transition-colors">
          Редактировать профиль
        </button>
      </div>
    </div>
  );
}

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "scanner", icon: "ScanLine", label: "Сканер" },
  { id: "analysis", icon: "BarChart2", label: "Питание" },
  { id: "tips", icon: "Lightbulb", label: "Советы" },
  { id: "saved", icon: "Bookmark", label: "Полезное" },
  { id: "profile", icon: "User", label: "Профиль" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("scanner");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0A6B4A, #12875E)" }}>
              <Icon name="Leaf" size={16} className="text-white" />
            </div>
            <span className="font-golos font-bold text-lg text-foreground">NutriScan</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-[#0A6B4A] animate-pulse" />
            <span className="text-xs font-ibm font-medium text-[#0A6B4A]">Онлайн</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-28">
        {activeTab === "scanner" && <ScannerTab />}
        {activeTab === "analysis" && <AnalysisTab />}
        {activeTab === "tips" && <TipsTab />}
        {activeTab === "saved" && <SavedTab />}
        {activeTab === "profile" && <ProfileTab />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-lg mx-auto px-2 flex">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-3 flex flex-col items-center gap-1 transition-all duration-200"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive ? "bg-[#0A6B4A]" : "bg-transparent"}`}>
                  <Icon
                    name={tab.icon as "Star"}
                    size={18}
                    className={isActive ? "text-white" : "text-muted-foreground"}
                  />
                </div>
                <span className={`text-[10px] font-ibm font-medium transition-colors ${isActive ? "text-[#0A6B4A]" : "text-muted-foreground"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
