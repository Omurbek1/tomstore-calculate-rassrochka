import { useState } from "react";
import "./App.css";

// --- НАСТРОЙКИ МАГАЗИНА ---
const STORE_ADDRESS = "г. Бишкек, ул. Калык Акиев 66, ТЦ «Весна», 3 этаж, С 47";
const STORE_PHONE = "0508 724 365";
const STORE_PHONE_CLEAN = "0508724365";
const WHATSAPP_PHONE = "996508724365";
const STORE_2GIS = "https://go.2gis.com/LYINn";
const INSTAGRAM_LINK = "https://instagram.com/tomstore.kg";

// --- ПРОЦЕНТЫ ---
type RateConfig = {
  title: string;
  type: string;
  rates: { [month: number]: number };
  fee?: number;
};

const RATES: { [key: string]: RateConfig } = {
  bank: {
    title: "🏦 Банк (Стандарт)",
    type: "bank",
    rates: { 3: 0.06, 6: 0.11, 8: 0.12, 12: 0.16 },
  },
  mislamic: {
    title: "☪️ M-Islamic",
    type: "islamic",
    rates: { 4: 0.06 },
  },
  cash2u: {
    title: "💜 Cash2U (Быстро)",
    type: "fast",
    rates: { 3: 0.1, 6: 0.1 },
  },
  mkk: {
    title: "💰 МКК (Без банка)",
    type: "fast",
    rates: { 3: 0.15, 6: 0.25, 9: 0.35 },
    fee: 1000,
  },
};

const HOT_OFFERS = [
  {
    id: 1,
    title: "Ноутбуки",
    desc: "Гарантия качества",
    price: "от 25 000 с",
    icon: "💻",
    tag: "ХИТ",
  },
  {
    id: 2,
    title: "Принтеры",
    desc: "Epson, Canon, HP",
    price: "от 12 500 с",
    icon: "🖨️",
    tag: "АКЦИЯ",
  },
  {
    id: 3,
    title: "Сборка ПК",
    desc: "Любой бюджет",
    price: "Game / Office",
    icon: "🖥️",
    tag: "PRO",
  },
  {
    id: 4,
    title: "Комплектующие",
    desc: "SSD, ОЗУ, Видеокарты",
    price: "от 1 500 с",
    icon: "💾",
    tag: "UPGRADE",
  },
];

const formatCurrency = (val: number) =>
  Math.round(val)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const formatInputNumber = (val: string) =>
  val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const parseNumber = (val: string) =>
  parseFloat(val.replace(/[^0-9]/g, "")) || 0;

const openWhatsApp = (msg: string) => {
  window.open(
    `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`,
    "_blank",
  );
};

interface CalculationResult {
  month: number;
  total: number;
  monthly: number;
  overpayment: number;
  rate: number;
}
interface ProductResult {
  key: string;
  title: string;
  type: string;
  rows: CalculationResult[];
}
type TabType = "all" | "bank" | "islamic" | "fast";
function App() {
  const [productPrice, setProductPrice] = useState("");
  const [initialPayment, setInitialPayment] = useState("");
  const [results, setResults] = useState<ProductResult[] | null>(null);
  const [loanAmount, setLoanAmount] = useState(0);

  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [canShare] = useState(
    () =>
      typeof navigator !== "undefined" && typeof navigator.share === "function",
  );
  const [isMobile] = useState(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || navigator.vendor;
    return /Android|iPhone|iPad|iPod/i.test(ua);
  });

  const handleReset = () => {
    setProductPrice("");
    setInitialPayment("");
    setResults(null);
    setErrorMessage("");
    setCopySuccess("");
  };

  const calculateCommissions = () => {
    const price = parseNumber(productPrice);
    const initial = parseNumber(initialPayment);
    if (price <= 0) return setErrorMessage("⚠️ Введите стоимость товара.");
    if (initial >= price)
      return setErrorMessage("⚠️ Взнос не может быть больше цены.");

    setErrorMessage("");
    const loan = price - initial;
    setLoanAmount(loan);

    const calculatedData: ProductResult[] = [];
    Object.entries(RATES).forEach(([key, config]) => {
      const rows: CalculationResult[] = [];
      const fee = config?.fee || 0;
      Object.entries(config.rates).forEach(([monthStr, rate]) => {
        const months = parseInt(monthStr);
        const total = loan + loan * rate + fee;
        const monthly = total / months;
        const overpayment = total - loan;
        rows.push({ month: months, monthly, total, overpayment, rate: rate });
      });
      calculatedData.push({
        key,
        title: config.title,
        type: config.type,
        rows,
      });
    });
    setResults(calculatedData);
  };

  // --- ОБРАБОТЧИК КЛАВИШ ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      calculateCommissions();
    }
    if (e.key === "Escape") {
      handleReset();
    }
  };

  const handleShareOrCopy = async () => {
    if (!results) return;
    let text = `📱 *TomStore.kg: Расчет*\n💰 Цена: ${productPrice} с\n💵 Взнос: ${initialPayment} с\n📉 *Рассрочка: ${formatCurrency(loanAmount)}*\n`;
    results
      .filter((i) => activeTab === "all" || i.type === activeTab)
      .forEach((p) => {
        text += `\n*${p.title}*:`;
        p.rows.forEach((r) => {
          text += `\n ${r.month}мес (${(r.rate * 100).toFixed(0)}%): ${formatCurrency(r.monthly)}/мес`;
        });
      });
    text += `\n\n📍 ${STORE_ADDRESS}\n📞 ${STORE_PHONE}`;
    if (isMobile && canShare && navigator.share) {
      try {
        await navigator.share({ title: "TomStore", text });
      } catch (e: Error | unknown) {
        if (e instanceof Error && e.name !== "AbortError") {
          setCopySuccess("⚠️ Не удалось поделиться, скопировано в буфер.");
          navigator.clipboard.writeText(text);
          setTimeout(() => setCopySuccess(""), 3000);
        }
        return;
      } finally {
        setCopySuccess("");
      }
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess("✅ Скопировано!");
        setTimeout(() => setCopySuccess(""), 3000);
      });
    }
  };

  const ProductCard = ({ product }: { product: ProductResult }) => (
    <div
      style={{
        marginBottom: "15px",
        backgroundColor: "white",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #eef2f6",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
      }}
    >
      <div
        onClick={() =>
          openWhatsApp(
            `Здравствуйте! Хочу оформить "${product.title}" на сумму ${formatCurrency(loanAmount)}.`,
          )
        }
        style={{
          background: "linear-gradient(to right, #f8fafc, #ffffff)",
          padding: "14px 18px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <span
          style={{ fontWeight: "700", color: "#1e293b", fontSize: "1.1em" }}
        >
          {product.title}
        </span>
        <span
          style={{
            fontSize: "0.8em",
            color: "#10b981",
            background: "#ecfdf5",
            padding: "4px 10px",
            borderRadius: "20px",
            fontWeight: "600",
          }}
        >
          Заказать ➜
        </span>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.95em",
          textAlign: "center",
        }}
      >
        <thead>
          <tr
            style={{
              color: "#64748b",
              fontSize: "0.8em",
              textTransform: "uppercase",
              borderBottom: "1px solid #f8fafc",
            }}
          >
            <th style={{ padding: "12px 4px" }}>Срок</th>
            <th style={{ padding: "12px 4px", color: "#0f172a" }}>Платеж</th>
            <th style={{ padding: "12px 4px" }}>Общая</th>
            <th style={{ padding: "12px 4px", color: "#ef4444" }}>Перепл.</th>
          </tr>
        </thead>
        <tbody>
          {product.rows.map((row) => (
            <tr key={row.month} style={{ borderBottom: "1px solid #f5f5f5" }}>
              <td style={{ padding: "12px 4px" }}>
                <div style={{ fontWeight: "700" }}>{row.month} мес</div>
                <div style={{ fontSize: "0.75em", color: "#94a3b8" }}>
                  {Math.round(row.rate * 100)}%
                </div>
              </td>
              <td
                style={{
                  padding: "12px 4px",
                  fontWeight: "800",
                  color: "#2563eb",
                  fontSize: "1.1em",
                }}
              >
                {formatCurrency(row.monthly)}
              </td>
              <td style={{ padding: "12px 4px", color: "#475569" }}>
                {formatCurrency(row.total)}
              </td>
              <td
                style={{
                  padding: "12px 4px",
                  color: "#ef4444",
                  fontSize: "0.85em",
                  fontWeight: "600",
                }}
              >
                +{formatCurrency(row.overpayment)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div
      className="animated-bg"
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "10px auto",
        fontFamily: "'Manrope', sans-serif",
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        minHeight: "95vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');`}</style>

      <h1
        style={{
          textAlign: "center",
          background: "linear-gradient(135deg, #0056b3 0%, #3b82f6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2.8em",
          fontWeight: "800",
          margin: "10px 0 5px",
        }}
      >
        TomStore.kg
      </h1>
      <p
        style={{ textAlign: "center", color: "#64748b", marginBottom: "25px" }}
      >
        Компьютеры • Ноутбуки • Принтеры
      </p>

      {/* РЕКЛАМА */}
      <div
        style={{
          marginBottom: "25px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
        }}
      >
        {HOT_OFFERS.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              padding: "16px",
              borderRadius: "18px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "2.4em" }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "1.05em" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "0.8em", color: "#64748b" }}>
                  {item.desc}
                </div>
                <div
                  style={{
                    fontWeight: "800",
                    color: "#10b981",
                    fontSize: "0.9em",
                  }}
                >
                  {item.price}
                </div>
              </div>
            </div>
            <button
              onClick={() => openWhatsApp(item.title)}
              style={{
                background: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "14px",
                width: "42px",
                height: "42px",
                cursor: "pointer",
              }}
            >
              💬
            </button>
          </div>
        ))}
      </div>

      {/* ВВОД */}
      <div
        style={{
          marginBottom: "25px",
          border: "1px solid #e2e8f0",
          padding: "24px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        {errorMessage && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "10px",
              borderRadius: "12px",
              marginBottom: "15px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {errorMessage}
          </div>
        )}
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "700",
                color: "#475569",
              }}
            >
              Цена товара:
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={productPrice}
              onChange={(e) => {
                setProductPrice(formatInputNumber(e.target.value));
                setResults(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="0"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1.2em",
                borderRadius: "14px",
                border: "2px solid #f1f5f9",
                boxSizing: "border-box",
                fontWeight: "800",
                color: "#2563eb",
                outline: "none",
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "700",
                color: "#475569",
              }}
            >
              Первоначальный взнос:
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={initialPayment}
              onChange={(e) => {
                setInitialPayment(formatInputNumber(e.target.value));
                setResults(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="0"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1.2em",
                borderRadius: "14px",
                border: "2px solid #f1f5f9",
                boxSizing: "border-box",
                fontWeight: "800",
                outline: "none",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={calculateCommissions}
            style={{
              flex: 2,
              padding: "16px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              fontSize: "1.1em",
              fontWeight: "700",
            }}
          >
            Рассчитать (Enter)
          </button>
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              padding: "16px",
              backgroundColor: "#f1f5f9",
              color: "#64748b",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              fontSize: "1.1em",
            }}
          >
            Сброс
          </button>
        </div>
      </div>

      {/* РЕЗУЛЬТАТЫ */}
      {results && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              background: "white",
              padding: "18px",
              borderRadius: "18px",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.85em",
                  color: "#64748b",
                  fontWeight: "600",
                }}
              >
                Сумма рассрочки:
              </span>
              <div
                style={{
                  color: "#2563eb",
                  fontSize: "1.6em",
                  fontWeight: "800",
                }}
              >
                {formatCurrency(loanAmount)} KG
              </div>
            </div>
            <button
              onClick={handleShareOrCopy}
              style={{
                padding: "12px 20px",
                backgroundColor: "#1e293b",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              {isMobile ? "📲 Поделиться" : "📋 Копировать"}
            </button>
          </div>
          {copySuccess && (
            <div
              style={{
                textAlign: "center",
                color: "#10b981",
                marginBottom: "10px",
                fontWeight: "700",
              }}
            >
              {copySuccess}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              overflowX: "auto",
              paddingBottom: "8px",
            }}
          >
            {[
              { id: "all", label: "Все" },
              { id: "bank", label: "🏦 Банки" },
              { id: "islamic", label: "☪️ Исламские" },
              { id: "fast", label: "⚡ МКК" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "14px",
                  border: "none",
                  background: activeTab === tab.id ? "#2563eb" : "white",
                  color: activeTab === tab.id ? "white" : "#64748b",
                  fontWeight: "700",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            {results
              .filter((i) => activeTab === "all" || i.type === activeTab)
              .map((item) => (
                <ProductCard key={item.key} product={item} />
              ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{ marginTop: "auto", paddingTop: "30px", textAlign: "center" }}
      >
        <p style={{ margin: "5px 0", fontWeight: "700" }}>📍 {STORE_ADDRESS}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            alignItems: "center",
            margin: "15px 0",
          }}
        >
          <a
            href={`tel:${STORE_PHONE_CLEAN}`}
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "800",
            }}
          >
            📞 {STORE_PHONE}
          </a>

          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#22c55e", fontSize: "1.6em" }}
          >
            💬
          </a>
        </div>
        <>
          {/* instagram  link*/}
          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#e1306c",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            📸 Наш Instagram
          </a>
        </>

        <p>
          <a
            href={STORE_2GIS}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#64748b",
              textDecoration: "none",
              borderBottom: "1px dashed #cbd5e1",
              fontSize: "0.9em",
            }}
          >
            Найти нас в 2GIS
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
