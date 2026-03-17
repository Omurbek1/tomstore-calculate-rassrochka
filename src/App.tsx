import { useState } from "react";
import "./App.css";

// --- НАСТРОЙКИ МАГАЗИНА ---
const STORE_ADDRESS = "г. Бишкек, ул. Калык Акиев 66, ТЦ «Весна», 3 этаж, С 47";
const STORE_PHONE = "0508 724 365";
const WHATSAPP_PHONE = "996508724365";

// --- КОНФИГУРАЦИЯ ПРОЦЕНТОВ ---
const RATES = {
  bank: {
    title: "🏦 Банковская рассрочка",
    type: "bank",
    rates: [
      { months: 3, rate: 0.06, label: "Стандарт", showRate: "6%" },
      {
        months: 6,
        rate: 0.09,
        label: "M-Plus",
        showRate: "9%",
        color: "#10b981",
      },
      {
        months: 6,
        rate: 0.11,
        label: "Zero",
        showRate: "11%",
        color: "#ef4444",
      },
      { months: 8, rate: 0.12, label: "Стандарт", showRate: "12%" },
      { months: 12, rate: 0.19, label: "Стандарт", showRate: "19%" },
    ],
  },
  cash2u: {
    title: "💜 Cash2U (Быстро)",
    type: "fast",
    rates: [
      {
        months: 3,
        rate: 0.1,
        label: "Cash2U",
        showRate: "10%",
        color: "#a855f7",
      },
      {
        months: 6,
        rate: 0.1,
        label: "Cash2U",
        showRate: "10%",
        color: "#a855f7",
      },
    ],
  },
  mislamic: {
    title: "☪️ M-Islamic",
    type: "islamic",
    rates: [{ months: 4, rate: 0.06, label: "Стандарт", showRate: "6%" }],
  },
  mkk: {
    title: "💰 Без банка (МКК)",
    type: "fast",
    fee: 1000, // ФИКСИРОВАННАЯ КОМИССИЯ 1000 СОМ
    rates: [
      { months: 3, rate: 0.15, label: "МКК", showRate: "15% + 1000с" },
      { months: 6, rate: 0.25, label: "МКК", showRate: "25% + 1000с" },
      { months: 9, rate: 0.35, label: "МКК", showRate: "35% + 1000с" },
    ],
  },
};

const HOT_OFFERS = [
  { id: 1, title: "Ноутбуки", price: "от 25 000 с", icon: "💻" },
  { id: 2, title: "Принтеры", price: "от 4 500 с", icon: "🖨️" },
  { id: 3, title: "Сборка ПК", price: "Game / Office", icon: "🖥️" },
  { id: 4, title: "Запчасти", price: "от 1 500 с", icon: "💾" },
];

const formatCurrency = (val: number) =>
  Math.round(val)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const formatInputNumber = (val: string) =>
  val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const parseNumber = (val: string) =>
  parseFloat(val.replace(/[^0-9]/g, "")) || 0;

function App() {
  const [productPrice, setProductPrice] = useState("");
  const [initialPayment, setInitialPayment] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [loanAmount, setLoanAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [copySuccess, setCopySuccess] = useState("");

  const calculate = () => {
    const price = parseNumber(productPrice);
    const initial = parseNumber(initialPayment);
    if (price <= 0) return;
    const loan = price - initial;
    setLoanAmount(loan);

    const calculatedData = Object.entries(RATES).map(([key, config]) => {
      const fee = (config as any).fee || 0;
      const rows = config.rates.map((r: any) => {
        // РАСЧЕТ: (Сумма рассрочки + Процент) + 1000 сом комиссии
        const total = loan + loan * r.rate + fee;
        return { ...r, monthly: total / r.months, overpayment: total - loan };
      });
      return { key, title: config.title, type: config.type, rows };
    });
    setResults(calculatedData);
  };

  const handleShare = async () => {
    if (!results) return;
    let text = `📱 *TomStore.kg: Расчет рассрочки*\n💰 Цена: ${productPrice} с\n💵 Взнос: ${initialPayment} с\n📉 *К выплате: ${formatCurrency(loanAmount)} с*\n`;

    results
      .filter((i) => activeTab === "all" || i.type === activeTab)
      .forEach((p) => {
        text += `\n*${p.title}*:`;
        p.rows.forEach((r: any) => {
          const typeLabel =
            r.months === 6 ||
            r.label === "Cash2U" ||
            r.label === "M-Plus" ||
            r.label === "Zero" ||
            r.label === "МКК"
              ? `(${r.label})`
              : "";
          text += `\n ${r.months} мес ${typeLabel}: ${formatCurrency(r.monthly)} /мес`;
        });
      });

    text += `\n\n📝 *Условия:*\n• Паспорт (ID-карта)\n• Без банка (на месте)\n• От 18 лет\n\n📍 ${STORE_ADDRESS}\n📞 ${STORE_PHONE}`;

    if (
      navigator.share &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share({ title: "TomStore", text });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess("✅ Расчет скопирован!");
        setTimeout(() => setCopySuccess(""), 3000);
      });
    }
  };

  return (
    <div className="main-wrapper">
      <div className="background-layer"></div>
      <div className="background-overlay"></div>

      <div
        className="container"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        <header className="header">
          <h1 className="logo">TomStore.kg</h1>
          <div className="status-badge">Менеджер: Рассрочка</div>
        </header>

        <div className="offers-scroll">
          {HOT_OFFERS.map((item) => (
            <div key={item.id} className="offer-card-mini">
              <span className="offer-icon">{item.icon}</span>
              <div className="offer-info">
                <span className="offer-name">{item.title}</span>
                <span className="offer-price-tag">{item.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card calculator-card">
          <div className="input-row">
            <div className="input-group">
              <label>Цена товара</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={productPrice}
                onChange={(e) => {
                  setProductPrice(formatInputNumber(e.target.value));
                  setResults(null);
                }}
              />
            </div>
            <div className="input-group">
              <label>Взнос</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={initialPayment}
                onChange={(e) => {
                  setInitialPayment(formatInputNumber(e.target.value));
                  setResults(null);
                }}
              />
            </div>
          </div>
          <button
            className="btn-main"
            onClick={calculate}
            style={{ background: "#2563eb" }}
          >
            Рассчитать (Enter)
          </button>
        </div>

        {results && (
          <div className="results-wrapper">
            <div className="summary-bar glass-card">
              <div className="loan-info">
                <span className="label">Сумма рассрочки</span>
                <span className="value">{formatCurrency(loanAmount)} KG</span>
              </div>
              <button className="btn-icon-text" onClick={handleShare}>
                📲 Отправить
              </button>
            </div>

            {copySuccess && <div className="toast-success">{copySuccess}</div>}

            <div className="tabs">
              {[
                { id: "all", label: "Все" },
                { id: "bank", label: "🏦 Банк" },
                { id: "islamic", label: "☪️ Ислам" },
                { id: "fast", label: "⚡ Без банка" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {results
              .filter((i) => activeTab === "all" || i.type === activeTab)
              .map((product) => (
                <div key={product.key} className="glass-card product-results">
                  <div className="product-title-bar">
                    <h3 style={{ color: "#60a5fa", margin: "0 0 10px 0" }}>
                      {product.title}
                    </h3>
                  </div>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Срок</th>
                        <th>В месяц</th>
                        <th>Переплата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.rows.map((row: any, idx: number) => (
                        <tr
                          key={idx}
                          style={
                            row.color ? { background: `${row.color}15` } : {}
                          }
                        >
                          <td
                            style={{ textAlign: "left", paddingLeft: "10px" }}
                          >
                            <span
                              className="month-val"
                              style={{ color: "#fff", fontWeight: "800" }}
                            >
                              {row.months} мес
                            </span>
                            <span
                              className="rate-badge"
                              style={{
                                color: row.color || "#3b82f6",
                                fontWeight: "bold",
                                fontSize: "0.7em",
                              }}
                            >
                              {row.label} ({row.showRate})
                            </span>
                          </td>
                          <td
                            className="monthly-val"
                            style={{ color: "#fff", fontWeight: "800" }}
                          >
                            {formatCurrency(row.monthly)}
                          </td>
                          <td
                            className="overpayment-val"
                            style={{ color: "#ef4444", fontWeight: "600" }}
                          >
                            +{formatCurrency(row.overpayment)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>
        )}

        <footer className="footer glass-card">
          <p
            style={{ fontSize: "0.8em", color: "#94a3b8", textAlign: "center" }}
          >
            📍 {STORE_ADDRESS}
          </p>
          <div
            className="footer-actions"
            style={{ display: "flex", gap: "10px", marginTop: "10px" }}
          >
            <a
              href={`tel:${WHATSAPP_PHONE}`}
              className="btn-footer"
              style={{
                flex: 1,
                textAlign: "center",
                background: "#334155",
                padding: "10px",
                borderRadius: "10px",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              📞 Позвонить
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              className="btn-footer"
              style={{
                flex: 1,
                textAlign: "center",
                background: "#22c55e",
                padding: "10px",
                borderRadius: "10px",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              💬 WhatsApp
            </a>
          </div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        .main-wrapper { min-height: 100vh; position: relative; padding: 20px 10px; background: #0f172a; overflow-x: hidden; }
        .background-layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: url('./assets/image.png'); background-size: cover; background-position: center; z-index: -2; }
        .background-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.98) 100%); backdrop-filter: blur(15px); z-index: -1; }
        .container { max-width: 500px; margin: 0 auto; color: #f8fafc; }
        .logo { font-size: 2.2em; font-weight: 800; color: #3b82f6; margin-bottom: 5px; }
        .status-badge { font-size: 0.7em; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }
        .offers-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin: 20px 0; scrollbar-width: none; }
        .offer-card-mini { background: rgba(255, 255, 255, 0.05); padding: 10px 15px; border-radius: 14px; min-width: 130px; border: 1px solid rgba(255, 255, 255, 0.1); }
        .glass-card { background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border-radius: 20px; padding: 20px; margin-bottom: 20px; }
        .input-row { display: flex; gap: 10px; margin-bottom: 15px; }
        .input-group label { display: block; font-size: 0.7em; color: #94a3b8; margin-bottom: 5px; text-transform: uppercase; font-weight: 700; }
        .input-group input { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid #334155; padding: 12px; border-radius: 12px; color: #fff; font-size: 1.2em; font-weight: 700; box-sizing: border-box; outline: none; }
        .btn-main { border: none; cursor: pointer; transition: 0.2s; }
        .btn-main:active { transform: scale(0.98); }
        .tabs { display: flex; gap: 5px; overflow-x: auto; margin-bottom: 15px; scrollbar-width: none; }
        .tab-item { padding: 10px 18px; border-radius: 12px; background: #1e293b; border: none; color: #94a3b8; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .tab-item.active { background: #3b82f6; color: #fff; }
        .results-table { width: 100%; border-collapse: collapse; }
        .results-table th { font-size: 0.6em; color: #64748b; text-transform: uppercase; padding-bottom: 10px; }
        .results-table td { padding: 12px 5px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; }
        .toast-success { text-align: center; color: #10b981; font-weight: 700; margin-bottom: 10px; font-size: 0.9em; }
      `}</style>
    </div>
  );
}

export default App;
