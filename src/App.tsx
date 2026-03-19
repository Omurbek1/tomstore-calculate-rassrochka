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
    fee: 1000,
    rates: [
      { months: 3, rate: 0.15, label: "МКК", showRate: "15% + 1000с" },
      { months: 6, rate: 0.25, label: "МКК", showRate: "25% + 1000с" },
      { months: 9, rate: 0.35, label: "МКК", showRate: "35% + 1000с" },
    ],
  },
};

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
        const totalAmount = loan + loan * r.rate + fee;
        return {
          ...r,
          monthly: totalAmount / r.months,
          total: totalAmount,
          overpayment: totalAmount - loan,
        };
      });
      return { key, title: config.title, type: config.type, rows };
    });
    setResults(calculatedData);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") calculate();
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
            r.months === 6 || r.label !== "Стандарт" ? `(${r.label})` : "";
          text += `\n ${r.months} мес ${typeLabel}: ${formatCurrency(r.monthly)} /мес (Всего: ${formatCurrency(r.total)})`;
        });
      });

    text += `\n\n📝 *Условия:*\n• Паспорт (ID-карта)\n• Без банка (на месте)\n• 18+ лет\n\n📍 ${STORE_ADDRESS}\n📞 ${STORE_PHONE}`;

    if (
      navigator.share &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share({ title: "TomStore", text });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess("✅ Данные скопированы!");
        setTimeout(() => setCopySuccess(""), 3000);
      });
    }
  };

  return (
    <div className="main-wrapper">
      <div className="background-layer"></div>
      <div className="background-overlay"></div>

      <div className="container">
        <header className="header">
          <h1 className="logo">TomStore.kg</h1>
          <div className="status-badge">Менеджер: Рассрочка</div>
        </header>

        <div className="glass-card calculator-card">
          <div className="input-grid">
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
                onKeyDown={handleKeyDown}
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
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <button className="btn-main" onClick={calculate}>
            Рассчитать (Enter)
          </button>
        </div>

        {results && (
          <div className="results-wrapper">
            <div className="summary-bar glass-card">
              <div className="loan-info">
                <span className="label">Сумма рассрочки<br/></span>
                <span className="value">{formatCurrency(loanAmount)} KG</span>
              </div>
              <button className="btn-icon-text" onClick={handleShare}>
                📲 Отправить
              </button>
            </div>

            {copySuccess && <div className="toast-success">{copySuccess}</div>}

            <div className="tabs-container">
              <div className="tabs-scroll">
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
            </div>

            {results
              .filter((i) => activeTab === "all" || i.type === activeTab)
              .map((product) => (
                <div key={product.key} className="glass-card product-results">
                  <h3 className="product-title">{product.title}</h3>
                  <div className="table-responsive">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Срок</th>
                          <th>Платеж</th>
                          <th>Итого</th>
                          <th>Перепл.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.rows.map(
                          (
                            row: {
                              months: number;
                              monthly: number;
                              total: number;
                              interest: number;
                              color?: string;
                              label: string;
                            },
                            idx: number,
                          ) => (
                            <tr
                              key={idx}
                              style={
                                row.color
                                  ? { background: `${row.color}10` }
                                  : {}
                              }
                            >
                              <td className="cell-term">
                                <span className="m-val">{row.months}м</span>
                                <span
                                  className="l-val"
                                  style={{ color: row.color || "#3b82f6" }}
                                >
                                  {row.label}
                                </span>
                              </td>
                              <td className="cell-monthly">
                                {formatCurrency(row.monthly)}
                              </td>
                              <td className="cell-total">
                                {formatCurrency(row.total)}
                              </td>
                              <td className="cell-over">
                                {formatCurrency(row.overpayment)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        )}

        <footer className="footer-info">
          {" "}
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
        
        .main-wrapper { min-height: 100vh; position: relative; padding: 15px 10px; background: #000; font-family: 'Manrope', sans-serif; overflow-x: hidden; }
        .background-layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: url('./assets/image.png'); background-size: cover; background-position: center; z-index: -2; }
        .background-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 100%); backdrop-filter: blur(10px); z-index: -1; }
        
        .container { max-width: 500px; margin: 0 auto; color: #fff; }
        .header { text-align: center; margin-bottom: 15px; }
        .logo { font-size: 2em; font-weight: 800; color: #3b82f6; margin: 0; }
        .status-badge { font-size: 0.65em; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }

        .glass-card { background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 15px; margin-bottom: 15px; }
        
        .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
        @media (max-width: 400px) { .input-grid { grid-template-columns: 1fr; } }
        
        .input-group label { display: block; font-size: 0.65em; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
        .input-group input { width: 100%; background: #000; border: 1px solid #334155; padding: 10px; border-radius: 10px; color: #fff; font-size: 1.1em; font-weight: 700; box-sizing: border-box; outline: none; }
        .btn-main { width: 100%; padding: 14px; background: #2563eb; border: none; border-radius: 12px; color: #fff; font-weight: 800; font-size: 0.9em; cursor: pointer; }

        .summary-bar { display: flex; justify-content: space-between; align-items: center; }
        .loan-info .value { font-size: 1.3em; font-weight: 800; color: #3b82f6; }
        .btn-icon-text { background: #fff; color: #000; border: none; padding: 8px 12px; border-radius: 10px; font-weight: 700; font-size: 0.8em; }

        .tabs-container { margin-bottom: 15px; }
        .tabs-scroll { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .tabs-scroll::-webkit-scrollbar { display: none; }
        .tab-item { padding: 8px 15px; border-radius: 10px; background: #1e293b; border: none; color: #94a3b8; font-weight: 700; font-size: 0.75em; white-space: nowrap; }
        .tab-item.active { background: #3b82f6; color: #fff; }

        .product-title { font-size: 0.9em; color: #60a5fa; margin: 0 0 12px 0; border-left: 3px solid #3b82f6; padding-left: 8px; }
        .table-responsive { width: 100%; overflow-x: auto; }
        .results-table { width: 100%; border-collapse: collapse; min-width: 320px; }
        .results-table th { font-size: 0.55em; color: #64748b; text-transform: uppercase; padding-bottom: 8px; text-align: center; }
        .results-table td { padding: 10px 4px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-size: 0.85em; }
        
        .cell-term { text-align: left !important; padding-left: 5px !important; }
        .m-val { display: block; font-weight: 800; }
        .l-val { display: block; font-size: 0.6em; font-weight: 700; }
        .cell-monthly { font-weight: 800; color: #fff; }
        .cell-total { color: #94a3b8; font-size: 0.75em; }
        .cell-over { color: #ef4444; font-weight: 600; font-size: 0.75em; }

        .footer-info { text-align: center; font-size: 0.65em; color: #475569; margin-top: 10px; padding-bottom: 20px; }
        .toast-success { text-align: center; color: #10b981; font-weight: 700; font-size: 0.8em; margin-bottom: 10px; }
      `}</style>
    </div>
  );
}

export default App;
