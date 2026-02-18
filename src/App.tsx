import { useState, useEffect } from "react";
import "./App.css";

// --- НАСТРОЙКИ МАГАЗИНА ---
const MKK_FEE = 1000;
const STORE_ADDRESS = "г. Бишкек, ул. Калык Акиев 66, ТЦ «Весна», 3 этаж, С 47";
const STORE_PHONE = "0508 724 365";
const STORE_2GIS = "https://go.2gis.com/LYINn";

const MOTIVATIONAL_PHRASES = [
  "Ваш успех — это наша цель!",
  "Продавайте больше, зарабатывайте легче.",
  "Каждая сделка — это победа! 🏆",
  "Действуйте сейчас, результаты придут потом.",
  "Настойчивость окупается.",
  "Сегодняшнее усилие — завтрашний результат.",
  "Клиент ждет именно вашего предложения!",
  "Превратите мечты в планы, а планы — в прибыль.",
  "Не сдавайтесь: лучшие предложения еще впереди.",
  "Будьте лучшим менеджером, которого знает TomStore.kg! 🚀",
];

interface HistoryItem {
  price: string;
  initial: string;
  loan: string;
  timestamp: string;
}

interface ResultsType {
  price: number;
  initialPayment: number;
  loanAmount: number;
  bank3MonthsCommission: number;
  bank6MonthsCommission: number;
  bank8MonthsCommission: number;
  bank12MonthsCommission: number;
  cash2uCommission: number;
  mkk3MonthsCommission: number;
  mkk6MonthsCommission: number;
  mkk9MonthsCommission: number;
  monthlyBank3Months: number;
  monthlyBank6Months: number;
  monthlyBank8Months: number;
  monthlyBank12Months: number;
  monthlyCash2u3Months: number;
  monthlyCash2u6Months: number;
  monthlyMKK3Months: number;
  monthlyMKK6Months: number;
  monthlyMKK9Months: number;
  totalBank3Months: number;
  totalBank6Months: number;
  totalBank8Months: number;
  totalBank12Months: number;
  totalCash2u: number;
  totalMKK3Months: number;
  totalMKK6Months: number;
  totalMKK9Months: number;
}

function App() {
  const [productPrice, setProductPrice] = useState("");
  const [initialPayment, setInitialPayment] = useState("");
  const [results, setResults] = useState<ResultsType | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [canShare, setCanShare] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [motivationalPhrase, setMotivationalPhrase] = useState(
    MOTIVATIONAL_PHRASES[0],
  );

  // Проверка устройства
  useEffect(() => {
    // 1. Проверяем Share API
    if (typeof navigator.share === "function") {
      setCanShare(true);
    }

    // 2. Проверяем Мобильное устройство (User Agent)
    const checkIsMobile = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent,
        )
      ) {
        return true;
      }
      if (
        navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 2 &&
        /MacIntel/.test(navigator.platform)
      ) {
        return true;
      }
      return false;
    };
    setIsMobile(checkIsMobile());
  }, []);

  const formatInputNumber = (val: string) => {
    const cleanVal = val.replace(/\D/g, "");
    return cleanVal.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const parseNumber = (val: string) => {
    return parseFloat(val.replace(/[^0-9]/g, "")) || 0;
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputNumber(event.target.value);
    setProductPrice(formatted);
    setResults(null);
    setCopySuccess("");
  };

  const handleInitialPaymentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const formatted = formatInputNumber(event.target.value);
    setInitialPayment(formatted);
    setResults(null);
    setCopySuccess("");
  };

  const handleReset = () => {
    setProductPrice("");
    setInitialPayment("");
    setResults(null);
    setErrorMessage("");
    setCopySuccess("");
  };

  const formatCurrency = (value: number) => {
    return (
      Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " с"
    );
  };

  // --- ОСНОВНОЙ РАСЧЕТ ---
  const calculateCommissions = (
    directPrice?: number,
    directInitial?: number,
  ) => {
    const price =
      directPrice !== undefined ? directPrice : parseNumber(productPrice);
    const initial =
      directInitial !== undefined ? directInitial : parseNumber(initialPayment);

    setErrorMessage("");
    setCopySuccess("");

    if (isNaN(price) || price <= 0) {
      setErrorMessage("⚠️ Введите корректную стоимость товара.");
      return;
    }

    if (initial >= price) {
      setErrorMessage(
        "⚠️ Первоначальный взнос не может быть больше цены товара.",
      );
      return;
    }

    // --- Генерация фразы внутри обработчика события (это безопасно) ---
    // Math.random вызывается только при расчете, не в рендере
    // eslint-disable-next-line react-hooks/purity
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length);
    setMotivationalPhrase(MOTIVATIONAL_PHRASES[randomIndex]);

    const loanAmount = price - initial;

    if (directPrice === undefined) {
      const newHistoryItem: HistoryItem = {
        price: formatCurrency(price),
        initial: formatCurrency(initial),
        loan: formatCurrency(loanAmount),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setHistory((prev) => {
        if (
          prev.length > 0 &&
          prev[0].price === newHistoryItem.price &&
          prev[0].initial === newHistoryItem.initial
        ) {
          return prev;
        }
        return [newHistoryItem, ...prev].slice(0, 3);
      });
    }

    // Расчеты
    const bank3MonthsCommission = loanAmount * 0.06;
    const bank6MonthsCommission = loanAmount * 0.09;
    const bank8MonthsCommission = loanAmount * 0.12;
    const bank12MonthsCommission = loanAmount * 0.16;
    const cash2uCommission = loanAmount * 0.1;
    const mkk3MonthsCommission = loanAmount * 0.15 + MKK_FEE;
    const mkk6MonthsCommission = loanAmount * 0.25 + MKK_FEE;
    const mkk9MonthsCommission = loanAmount * 0.35 + MKK_FEE;

    const totalBank3Months = loanAmount + bank3MonthsCommission;
    const totalBank6Months = loanAmount + bank6MonthsCommission;
    const totalBank8Months = loanAmount + bank8MonthsCommission;
    const totalBank12Months = loanAmount + bank12MonthsCommission;
    const totalCash2u = loanAmount + cash2uCommission;
    const totalMKK3Months = loanAmount + mkk3MonthsCommission;
    const totalMKK6Months = loanAmount + mkk6MonthsCommission;
    const totalMKK9Months = loanAmount + mkk9MonthsCommission;

    const monthlyBank3Months = totalBank3Months / 3;
    const monthlyBank6Months = totalBank6Months / 6;
    const monthlyBank8Months = totalBank8Months / 8;
    const monthlyBank12Months = totalBank12Months / 12;
    const monthlyCash2u3Months = totalCash2u / 3;
    const monthlyCash2u6Months = totalCash2u / 6;
    const monthlyMKK3Months = totalMKK3Months / 3;
    const monthlyMKK6Months = totalMKK6Months / 6;
    const monthlyMKK9Months = totalMKK9Months / 9;

    setResults({
      price,
      initialPayment: initial,
      loanAmount,
      bank3MonthsCommission,
      bank6MonthsCommission,
      bank8MonthsCommission,
      bank12MonthsCommission,
      cash2uCommission,
      mkk3MonthsCommission,
      mkk6MonthsCommission,
      mkk9MonthsCommission,
      totalBank3Months,
      totalBank6Months,
      totalBank8Months,
      totalBank12Months,
      totalCash2u,
      totalMKK3Months,
      totalMKK6Months,
      totalMKK9Months,
      monthlyBank3Months,
      monthlyBank6Months,
      monthlyBank8Months,
      monthlyBank12Months,
      monthlyCash2u3Months,
      monthlyCash2u6Months,
      monthlyMKK3Months,
      monthlyMKK6Months,
      monthlyMKK9Months,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") calculateCommissions();
    if (e.key === "Escape") handleReset();
  };

  const handleShareOrCopy = async () => {
    if (!results) return;

    const text = `
📱 *Расчет рассрочки TomStore.kg*
💰 Цена товара: ${formatCurrency(results.price)}
💵 Взнос: ${formatCurrency(results.initialPayment)}
📉 Рассрочка: ${formatCurrency(results.loanAmount)}

🏦 *Через Банк:*
🔹 3 мес: ${formatCurrency(results.monthlyBank3Months)} /мес
🔹 6 мес: ${formatCurrency(results.monthlyBank6Months)} /мес
🔹 8 мес: ${formatCurrency(results.monthlyBank8Months)} /мес
🔹 12 мес: ${formatCurrency(results.monthlyBank12Months)} /мес

💜 *Cash2U (Быстро):*
🟣 3 мес: ${formatCurrency(results.monthlyCash2u3Months)} /мес
🟣 6 мес: ${formatCurrency(results.monthlyCash2u6Months)} /мес

🚀 *Через МКК (без банка):*
🔸 3 мес: ${formatCurrency(results.monthlyMKK3Months)} /мес
🔸 6 мес: ${formatCurrency(results.monthlyMKK6Months)} /мес
🔸 9 мес: ${formatCurrency(results.monthlyMKK9Months)} /мес

📍 *Адрес:* ${STORE_ADDRESS}
📞 *Тел:* ${STORE_PHONE}
🗺 *2GIS:* ${STORE_2GIS}
    `;

    if (isMobile && canShare) {
      try {
        await navigator.share({
          title: "Расчет TomStore.kg",
          text: text.trim(),
        });
        setCopySuccess("✅ Открыто меню поделиться");
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(text.trim()).then(() => {
        setCopySuccess("✅ Текст скопирован!");
      });
    }
    setTimeout(() => setCopySuccess(""), 3000);
  };

  const restoreFromHistory = (item: HistoryItem) => {
    const cleanPrice = parseNumber(item.price);
    const cleanInitial = parseNumber(item.initial);
    setProductPrice(formatInputNumber(cleanPrice.toString()));
    setInitialPayment(formatInputNumber(cleanInitial.toString()));
    calculateCommissions(cleanPrice, cleanInitial);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="animated-bg"
      style={{
        padding: "20px",
        maxWidth: "900px",
        width: "95%",
        margin: "20px auto",
        fontFamily: "Inter, sans-serif",
        borderRadius: "15px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        border: "1px solid #d0d8e0",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>
        <h1
          style={{
            textAlign: "center",
            color: "#0056b3",
            marginBottom: "10px",
            fontSize: "2.2em",
            fontWeight: "700",
            borderBottom: "3px solid #ffc107",
            paddingBottom: "10px",
            textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
          }}
        >
          TomStore.kg
        </h1>

        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "10px",
            border: "1px solid #c9e0f6",
            backdropFilter: "blur(5px)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontSize: "1em",
              color: "#28a745",
              fontWeight: "600",
              margin: 0,
            }}
          >
            ✨ {motivationalPhrase} ✨
          </p>
        </div>

        {/* --- Поля ввода --- */}
        <div
          style={{
            marginBottom: "25px",
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
            <div style={{ flex: 1, minWidth: "250px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Цена товара (сом):
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={productPrice}
                onChange={handlePriceChange}
                onKeyDown={handleKeyDown}
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

            <div style={{ flex: 1, minWidth: "250px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Первоначальный взнос:
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={initialPayment}
                onChange={handleInitialPaymentChange}
                onKeyDown={handleKeyDown}
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
              onClick={() => calculateCommissions()}
              style={{
                flex: 2,
                padding: "14px 25px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(40,167,69,0.4)",
                transition: "0.2s",
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
                boxShadow: "0 4px 10px rgba(220, 53, 69, 0.4)",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* --- История --- */}
        {history.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                color: "#666",
                fontSize: "0.9em",
                textAlign: "center",
                marginBottom: "5px",
              }}
            >
              ⏳ История расчетов:
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => restoreFromHistory(item)}
                  style={{
                    border: "1px solid #ccc",
                    background: "rgba(255,255,255,0.8)",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "0.85em",
                    color: "#333",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  <strong>{item.price}</strong>{" "}
                  {parseInt(item.initial) > 0 ? `(-${item.initial})` : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- Результаты расчетов --- */}
        {results && (
          <div
            style={{
              animation: "fadeIn 0.5s ease",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "15px",
                borderBottom: "2px solid #ddd",
                paddingBottom: "10px",
              }}
            >
              <h3
                style={{ color: "#0056b3", margin: "5px 0", fontSize: "1.2em" }}
              >
                Итог: {formatCurrency(results.loanAmount)}
              </h3>

              <button
                onClick={handleShareOrCopy}
                style={{
                  marginTop: "5px",
                  padding: "10px 20px",
                  backgroundColor: isMobile ? "#28a745" : "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                }}
              >
                {isMobile ? "📲 Поделиться (WhatsApp)" : "📋 Скопировать текст"}
              </button>
            </div>

            {copySuccess && (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                {copySuccess}
              </div>
            )}

            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 8px",
                textAlign: "center",
                fontSize: "0.95em",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                  <th style={{ padding: "10px", borderRadius: "8px 0 0 8px" }}>
                    Срок
                  </th>
                  <th style={{ padding: "10px" }}>Переплата</th>
                  <th
                    style={{
                      padding: "10px",
                      backgroundColor: "#ffc107",
                      color: "#333",
                    }}
                  >
                    Итого
                  </th>
                  <th style={{ padding: "10px", borderRadius: "0 8px 8px 0" }}>
                    В месяц
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* --- БАНК --- */}
                <tr style={{ background: "#eee" }}>
                  <td
                    colSpan={4}
                    style={{
                      padding: "5px",
                      fontWeight: "bold",
                      color: "#555",
                    }}
                  >
                    🏦 БАНК
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#e6f7ff" }}>
                  <td>3 мес (6%)</td>
                  <td style={{ color: "#0056b3", fontWeight: "bold" }}>
                    {formatCurrency(results.bank3MonthsCommission)}
                  </td>
                  <td>{formatCurrency(results.totalBank3Months)}</td>
                  <td style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    {formatCurrency(results.monthlyBank3Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#e6f7ff" }}>
                  <td>6 мес (9%)</td>
                  <td style={{ color: "#0056b3", fontWeight: "bold" }}>
                    {formatCurrency(results.bank6MonthsCommission)}
                  </td>
                  <td>{formatCurrency(results.totalBank6Months)}</td>
                  <td style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    {formatCurrency(results.monthlyBank6Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#e6f7ff" }}>
                  <td>8 мес (12%)</td>
                  <td style={{ color: "#0056b3", fontWeight: "bold" }}>
                    {formatCurrency(results.bank8MonthsCommission)}
                  </td>
                  <td>{formatCurrency(results.totalBank8Months)}</td>
                  <td style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    {formatCurrency(results.monthlyBank8Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#e6f7ff" }}>
                  <td>12 мес (16%)</td>
                  <td style={{ color: "#0056b3", fontWeight: "bold" }}>
                    {formatCurrency(results.bank12MonthsCommission)}
                  </td>
                  <td>{formatCurrency(results.totalBank12Months)}</td>
                  <td style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    {formatCurrency(results.monthlyBank12Months)}
                  </td>
                </tr>

                {/* --- CASH2U --- */}
                <tr style={{ background: "#eee" }}>
                  <td
                    colSpan={4}
                    style={{
                      padding: "5px",
                      fontWeight: "bold",
                      color: "#4a148c",
                    }}
                  >
                    💜 CASH2U
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f3e5f5" }}>
                  <td style={{ color: "#4a148c" }}>3 мес (10%)</td>
                  <td style={{ fontWeight: "bold", color: "#6a1b9a" }}>
                    {formatCurrency(results.cash2uCommission)}
                  </td>
                  <td>{formatCurrency(results.totalCash2u)}</td>
                  <td
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1em",
                      color: "#4a148c",
                    }}
                  >
                    {formatCurrency(results.monthlyCash2u3Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#f3e5f5" }}>
                  <td style={{ color: "#4a148c" }}>6 мес (10%)</td>
                  <td style={{ fontWeight: "bold", color: "#6a1b9a" }}>
                    {formatCurrency(results.cash2uCommission)}
                  </td>
                  <td>{formatCurrency(results.totalCash2u)}</td>
                  <td
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1em",
                      color: "#4a148c",
                    }}
                  >
                    {formatCurrency(results.monthlyCash2u6Months)}
                  </td>
                </tr>

                {/* --- МКК --- */}
                <tr style={{ background: "#eee" }}>
                  <td
                    colSpan={4}
                    style={{
                      padding: "5px",
                      fontWeight: "bold",
                      color: "#d35400",
                    }}
                  >
                    💰 МКК
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#fffbe6" }}>
                  <td>3 мес (15%)</td>
                  <td style={{ fontWeight: "bold", color: "#ff8c00" }}>
                    {formatCurrency(results.mkk3MonthsCommission)}
                  </td>
                  <td>{formatCurrency(results.totalMKK3Months)}</td>
                  <td style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    {formatCurrency(results.monthlyMKK3Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#fffbe6" }}>
                  <td>6 мес (25%)</td>
                  <td style={{ fontWeight: "bold", color: "#ff8c00" }}>
                    {formatCurrency(results.mkk6MonthsCommission)}
                  </td>
                  <td>{formatCurrency(results.totalMKK6Months)}</td>
                  <td style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    {formatCurrency(results.monthlyMKK6Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#fffbe6" }}>
                  <td>9 мес (35%)</td>
                  <td style={{ fontWeight: "bold", color: "#ff8c00" }}>
                    {formatCurrency(results.mkk9MonthsCommission)}
                  </td>
                  <td>{formatCurrency(results.totalMKK9Months)}</td>
                  <td style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                    {formatCurrency(results.monthlyMKK9Months)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Footer (Подвал) --- */}
      <div
        style={{
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "1px solid #d0d8e0",
          textAlign: "center",
          color: "#555",
          fontSize: "0.9em",
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: "0 0 15px 15px",
          paddingBottom: "20px",
        }}
      >
        <p style={{ margin: "5px 0", fontWeight: "bold" }}>
          📍 {STORE_ADDRESS}
        </p>
        <p style={{ margin: "5px 0" }}>
          📞{" "}
          <a
            href={`tel:${STORE_PHONE.replace(/\s/g, "")}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {STORE_PHONE}
          </a>
        </p>
        <p style={{ margin: "10px 0 0 0" }}>
          <a
            href={STORE_2GIS}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#007bff",
              textDecoration: "none",
              borderBottom: "1px dashed #007bff",
              fontWeight: "bold",
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
