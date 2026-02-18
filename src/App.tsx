import { useState, useEffect } from "react";
import "./App.css";

// --- НАСТРОЙКИ МАГАЗИНА ---
const STORE_ADDRESS = "г. Бишкек, ул. Калык Акиев 66, ТЦ «Весна», 3 этаж, С 47";
const STORE_PHONE = "0508 724 365";
const STORE_PHONE_CLEAN = "0508724365";
const WHATSAPP_PHONE = "996508724365";
const STORE_2GIS = "https://go.2gis.com/LYINn";
const INSTAGRAM_LINK = "https://instagram.com/tomstore.kg";

// --- ПРОЦЕНТЫ (ОБНОВЛЕНО) ---
const RATES = {
  // 1. БАНК (Стандарт) - Новые условия
  bank: {
    title: "🏦 Банк (Стандарт)",
    type: "bank",
    rates: { 3: 0.06, 6: 0.11, 8: 0.12, 12: 0.16 }, // 6%, 11%, 12%, 16%
  },

  // 2. ИСЛАМСКИЙ
  mislamic: {
    title: "☪️ M-Islamic",
    type: "islamic",
    rates: { 4: 0.06 }, // 6%
  },

  // 3. МФО (Быстрые)
  cash2u: {
    title: "💜 Cash2U (Быстро)",
    type: "fast",
    rates: { 3: 0.1, 6: 0.1 }, // 10%
  },
  mkk: {
    title: "💰 МКК (Без банка)",
    type: "fast",
    rates: { 3: 0.15, 6: 0.25, 9: 0.35 },
    fee: 1000, // +1000 сом
  },
};

const MOTIVATIONAL_PHRASES = [
  "Ваш успех — это наша цель!",
  "Каждая сделка — это победа! 🏆",
  "Клиент ждет именно вашего предложения!",
  "Будьте лучшим менеджером TomStore.kg! 🚀",
];

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

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
const getRandomPhrase = () =>
  MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
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

// --- ТИПЫ ---
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

function App() {
  const [productPrice, setProductPrice] = useState("");
  const [initialPayment, setInitialPayment] = useState("");
  const [results, setResults] = useState<ProductResult[] | null>(null);
  const [loanAmount, setLoanAmount] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "all" | "bank" | "islamic" | "fast"
  >("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [motivationalPhrase, setMotivationalPhrase] = useState(
    MOTIVATIONAL_PHRASES[0],
  );

  useEffect(() => {
    if (typeof navigator.share === "function") setCanShare(true);
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/Android|iPhone|iPad|iPod/i.test(ua)) setIsMobile(true);
  }, []);

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
    setErrorMessage("");
    setCopySuccess("");

    if (price <= 0) return setErrorMessage("⚠️ Введите стоимость товара.");
    if (initial >= price)
      return setErrorMessage("⚠️ Взнос не может быть больше цены.");

    setMotivationalPhrase(getRandomPhrase());
    const loan = price - initial;
    setLoanAmount(loan);

    const calculatedData: ProductResult[] = [];

    Object.entries(RATES).forEach(([key, config]) => {
      const rows: CalculationResult[] = [];
      const fee = (config as any).fee || 0;

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

  const handleShareOrCopy = async () => {
    if (!results) return;

    let text = `📱 *TomStore.kg: Расчет*\n💰 Цена: ${productPrice} с\n💵 Взнос: ${initialPayment} с\n📉 *Рассрочка: ${formatCurrency(loanAmount)}*\n`;

    const filteredResults = results.filter(
      (item) => activeTab === "all" || item.type === activeTab,
    );

    filteredResults.forEach((prod) => {
      text += `\n*${prod.title}*:`;
      prod.rows.forEach((r) => {
        text += `\n ${r.month}мес (${(r.rate * 100).toFixed(0)}%): ${formatCurrency(r.monthly)}/мес`;
      });
      text += `\n`;
    });

    text += `\n📍 ${STORE_ADDRESS}\n📞 ${STORE_PHONE}`;

    if (isMobile && canShare && navigator.share) {
      try {
        await navigator.share({ title: "TomStore", text });
        setCopySuccess("✅ Меню открыто");
      } catch (e) {}
    } else {
      navigator.clipboard
        .writeText(text)
        .then(() => setCopySuccess("✅ Скопировано!"));
    }
    setTimeout(() => setCopySuccess(""), 3000);
  };

  // Компонент карточки продукта
  const ProductCard = ({ product }: { product: ProductResult }) => {
    const order = () => {
      const msg = `Здравствуйте! Хочу оформить "${product.title}" на сумму ${formatCurrency(loanAmount)}.`;
      openWhatsApp(msg);
    };

    return (
      <div
        style={{
          marginBottom: "15px",
          backgroundColor: "white",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
        }}
      >
        <div
          onClick={order}
          style={{
            background: "#f8f9fa",
            padding: "10px 15px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <span
            style={{ fontWeight: "bold", color: "#0056b3", fontSize: "1.05em" }}
          >
            {product.title}
          </span>
          <span
            style={{
              fontSize: "0.8em",
              color: "#28a745",
              background: "#e8f5e9",
              padding: "2px 8px",
              borderRadius: "10px",
            }}
          >
            Заказать ➜
          </span>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9em",
            textAlign: "center",
          }}
        >
          <thead>
            <tr
              style={{
                color: "#666",
                fontSize: "0.85em",
                borderBottom: "1px solid #eee",
              }}
            >
              <th style={{ padding: "8px 4px", fontWeight: "normal" }}>Срок</th>
              <th
                style={{
                  padding: "8px 4px",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Платеж
              </th>
              <th style={{ padding: "8px 4px", fontWeight: "normal" }}>
                Общая
              </th>
              <th
                style={{
                  padding: "8px 4px",
                  fontWeight: "normal",
                  color: "#dc3545",
                }}
              >
                Перепл.
              </th>
            </tr>
          </thead>
          <tbody>
            {product.rows.map((row) => (
              <tr key={row.month} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "8px 4px" }}>
                  <div style={{ fontWeight: "bold" }}>{row.month} мес</div>
                  <div
                    style={{
                      fontSize: "0.85em",
                      color: "#888",
                      marginTop: "2px",
                    }}
                  >
                    {Math.round(row.rate * 100)}%
                  </div>
                </td>
                <td
                  style={{
                    padding: "8px 4px",
                    fontWeight: "bold",
                    color: "#0056b3",
                    fontSize: "1.05em",
                  }}
                >
                  {formatCurrency(row.monthly)}
                </td>
                <td style={{ padding: "8px 4px", color: "#555" }}>
                  {formatCurrency(row.total)}
                </td>
                <td
                  style={{
                    padding: "8px 4px",
                    color: "#dc3545",
                    fontSize: "0.9em",
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
  };

  return (
    <div
      className="animated-bg"
      style={{
        padding: "15px",
        maxWidth: "900px",
        margin: "10px auto",
        fontFamily: "Inter, sans-serif",
        borderRadius: "15px",
        border: "1px solid #d0d8e0",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#0056b3",
          margin: "5px 0",
          fontSize: "2em",
          fontWeight: "800",
        }}
      >
        TomStore.kg
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "#555",
          margin: "0 0 15px 0",
          fontSize: "0.9em",
        }}
      >
        Компьютеры • Ноутбуки • Принтеры
      </p>

      {/* РЕКЛАМА */}
      <div
        style={{
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "10px",
        }}
      >
        {HOT_OFFERS.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                background: "#ffc107",
                color: "#333",
                fontSize: "0.65em",
                fontWeight: "bold",
                padding: "3px 8px",
                borderRadius: "0 0 8px 0",
              }}
            >
              {item.tag}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "2.2em" }}>{item.icon}</div>
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#0056b3",
                    fontSize: "1.05em",
                  }}
                >
                  {item.title}
                </div>
                <div style={{ fontSize: "0.8em", color: "#666" }}>
                  {item.desc}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#28a745",
                    fontSize: "0.9em",
                    marginTop: "2px",
                  }}
                >
                  {item.price}
                </div>
              </div>
            </div>
            <button
              onClick={() => openWhatsApp(item.title)}
              style={{
                background: "#25D366",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "1.2em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 3px 6px rgba(37, 211, 102, 0.4)",
              }}
            >
              💬
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "15px", textAlign: "center" }}>
        <a
          href={INSTAGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            display: "inline-block",
            padding: "8px 20px",
            borderRadius: "20px",
            fontSize: "0.9em",
            background:
              "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            boxShadow: "0 4px 10px rgba(220, 39, 67, 0.3)",
          }}
        >
          📸 Instagram
        </a>
      </div>

      {/* ВВОД */}
      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #007bff",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        {errorMessage && (
          <div
            style={{
              backgroundColor: "#ffdddd",
              color: "#cc0000",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {errorMessage}
          </div>
        )}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Цена (сом):
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={productPrice}
              onChange={(e) => {
                setProductPrice(formatInputNumber(e.target.value));
                setResults(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && calculateCommissions()}
              placeholder="0"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "20px",
                borderRadius: "8px",
                border: "1px solid #a0d9ef",
                marginBottom: "20px",
                boxSizing: "border-box",
                fontWeight: "bold",
                color: "#0056b3",
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Первоначальный взнос (сом):
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={initialPayment}
              onChange={(e) => {
                setInitialPayment(formatInputNumber(e.target.value));
                setResults(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && calculateCommissions()}
              placeholder="0"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "20px",
                borderRadius: "8px",
                border: "1px solid #a0d9ef",
                marginBottom: "20px",
                boxSizing: "border-box",
                fontWeight: "bold",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={calculateCommissions}
            style={{
              flex: 2,
              padding: "14px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(40,167,69,0.4)",
            }}
          >
            Рассчитать
          </button>
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* РЕЗУЛЬТАТЫ */}
      {results && (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <span style={{ fontSize: "0.8em", color: "#666" }}>
                Сумма рассрочки:
              </span>
              <div
                style={{
                  color: "#0056b3",
                  fontSize: "1.3em",
                  fontWeight: "bold",
                }}
              >
                {formatCurrency(loanAmount)} KG
              </div>
            </div>
            <button
              onClick={handleShareOrCopy}
              style={{
                padding: "8px 15px",
                backgroundColor: isMobile ? "#28a745" : "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.9em",
              }}
            >
              {isMobile ? "📲 Поделиться" : "📋 Копировать"}
            </button>
          </div>
          {copySuccess && (
            <div
              style={{
                padding: "8px",
                backgroundColor: "#d4edda",
                color: "#155724",
                borderRadius: "5px",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {copySuccess}
            </div>
          )}

          {/* ТАБЫ (ФИЛЬТРЫ) */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "15px",
              overflowX: "auto",
              paddingBottom: "5px",
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
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "none",
                  background: activeTab === tab.id ? "#0056b3" : "white",
                  color: activeTab === tab.id ? "white" : "#555",
                  fontWeight: "bold",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* СПИСОК КАРТОЧЕК */}
          <div>
            {results
              .filter((item) => activeTab === "all" || item.type === activeTab)
              .map((item) => (
                <ProductCard key={item.key} product={item} />
              ))}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "auto",
          paddingTop: "20px",
          textAlign: "center",
          color: "#555",
          fontSize: "0.9em",
        }}
      >
        <p style={{ margin: "5px 0", fontWeight: "bold" }}>
          📍 {STORE_ADDRESS}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            alignItems: "center",
            margin: "10px 0",
          }}
        >
          <a
            href={`tel:${STORE_PHONE_CLEAN}`}
            style={{
              color: "#333",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            📞 {STORE_PHONE}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#25D366",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.5em",
            }}
          >
            💬
          </a>
        </div>
        <p>
          <a
            href={STORE_2GIS}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#007bff",
              textDecoration: "none",
              borderBottom: "1px dashed #007bff",
            }}
          >
            🗺 Открыть на карте (2GIS)
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
