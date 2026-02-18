import { useState } from "react";
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

interface ResultsType {
  price: number;
  initialPayment: number;
  loanAmount: number;
  // Банк
  bank3MonthsCommission: number;
  bank6MonthsCommission: number;
  bank8MonthsCommission: number;
  bank12MonthsCommission: number;
  // Cash2U
  cash2uCommission: number;
  // МКК
  mkk3MonthsCommission: number;
  mkk6MonthsCommission: number;
  mkk9MonthsCommission: number;

  // Ежемесячные платежи Банк
  monthlyBank3Months: number;
  monthlyBank6Months: number;
  monthlyBank8Months: number;
  monthlyBank12Months: number;
  // Ежемесячные платежи Cash2U
  monthlyCash2u3Months: number;
  monthlyCash2u6Months: number;
  // Ежемесячные платежи МКК
  monthlyMKK3Months: number;
  monthlyMKK6Months: number;
  monthlyMKK9Months: number;

  // Итого Банк
  totalBank3Months: number;
  totalBank6Months: number;
  totalBank8Months: number;
  totalBank12Months: number;
  // Итого Cash2U
  totalCash2u: number;
  // Итого МКК
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

  const [motivationalPhrase, setMotivationalPhrase] = useState(
    MOTIVATIONAL_PHRASES[0],
  );

  const setRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length);
    setMotivationalPhrase(MOTIVATIONAL_PHRASES[randomIndex]);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    setProductPrice(value);
    setResults(null);
    setCopySuccess("");
  };

  const handleInitialPaymentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.replace(/[^0-9]/g, "");
    setInitialPayment(value);
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

  const calculateCommissions = () => {
    const price = parseFloat(productPrice);
    const initial = parseFloat(initialPayment) || 0;
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

    setRandomPhrase();

    const loanAmount = price - initial;

    // --- 1. Расчеты КОМИССИЙ ---
    // Банк
    const bank3MonthsCommission = loanAmount * 0.06;
    const bank6MonthsCommission = loanAmount * 0.09;
    const bank8MonthsCommission = loanAmount * 0.12;
    const bank12MonthsCommission = loanAmount * 0.16;

    // Cash2U (10% фикс)
    const cash2uCommission = loanAmount * 0.1;

    // МКК
    const mkk3MonthsCommission = loanAmount * 0.15 + MKK_FEE;
    const mkk6MonthsCommission = loanAmount * 0.25 + MKK_FEE;
    const mkk9MonthsCommission = loanAmount * 0.35 + MKK_FEE;

    // --- 2. Итоговые суммы ---
    // Банк
    const totalBank3Months = loanAmount + bank3MonthsCommission;
    const totalBank6Months = loanAmount + bank6MonthsCommission;
    const totalBank8Months = loanAmount + bank8MonthsCommission;
    const totalBank12Months = loanAmount + bank12MonthsCommission;

    // Cash2U
    const totalCash2u = loanAmount + cash2uCommission;

    // МКК
    const totalMKK3Months = loanAmount + mkk3MonthsCommission;
    const totalMKK6Months = loanAmount + mkk6MonthsCommission;
    const totalMKK9Months = loanAmount + mkk9MonthsCommission;

    // --- 3. Ежемесячные платежи ---
    // Банк
    const monthlyBank3Months = totalBank3Months / 3;
    const monthlyBank6Months = totalBank6Months / 6;
    const monthlyBank8Months = totalBank8Months / 8;
    const monthlyBank12Months = totalBank12Months / 12;

    // Cash2U
    const monthlyCash2u3Months = totalCash2u / 3;
    const monthlyCash2u6Months = totalCash2u / 6;

    // МКК
    const monthlyMKK3Months = totalMKK3Months / 3;
    const monthlyMKK6Months = totalMKK6Months / 6;
    const monthlyMKK9Months = totalMKK9Months / 9;

    setResults({
      price,
      initialPayment: initial,
      loanAmount,
      // Банк
      bank3MonthsCommission,
      bank6MonthsCommission,
      bank8MonthsCommission,
      bank12MonthsCommission,

      // Cash2U
      cash2uCommission,
      // МКК
      mkk3MonthsCommission,
      mkk6MonthsCommission,
      mkk9MonthsCommission,

      // Итого
      totalBank3Months,
      totalBank6Months,
      totalBank8Months,
      totalBank12Months,
      totalCash2u,
      totalMKK3Months,
      totalMKK6Months,
      totalMKK9Months,

      // В месяц
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

  // --- ОБРАБОТЧИК КЛАВИШ ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      calculateCommissions();
    }
    // Используем Escape для сброса, чтобы Delete работал для редактирования текста
    if (e.key === "Escape") {
      handleReset();
    }
  };

  const formatCurrency = (value: number) => {
    return (
      Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " с"
    );
  };

  const copyToClipboard = () => {
    if (!results) return;

    const text = `
📱 *Расчет рассрочки TomStore.kg*
💰 Цена товара: ${formatCurrency(results.price)}
💵 Первоначальный взнос: ${formatCurrency(results.initialPayment)}
📉 Сумма рассрочки: ${formatCurrency(results.loanAmount)}

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

    navigator.clipboard.writeText(text.trim()).then(() => {
      setCopySuccess("✅ Текст скопирован!");
      setTimeout(() => setCopySuccess(""), 3000);
    });
  };

  return (
    <div
      className="animated-bg"
      style={{
        padding: "30px",
        maxWidth: "900px",
        width: "95%",
        margin: "20px auto",
        fontFamily: "Inter, sans-serif",
        borderRadius: "15px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        border: "1px solid #d0d8e0",
        minHeight: "80vh",
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
            fontSize: "2.5em",
            fontWeight: "700",
            borderBottom: "3px solid #ffc107",
            paddingBottom: "10px",
            textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
          }}
        >
          TomStore.kg: Калькулятор
        </h1>

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
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
              fontSize: "1.1em",
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
            padding: "25px",
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
                Стоимость товара (сом):
              </label>
              <input
                type="text"
                value={productPrice}
                onChange={handlePriceChange}
                onKeyDown={handleKeyDown} // ДОБАВЛЕНО
                placeholder="Например, 65000"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "18px",
                  borderRadius: "8px",
                  border: "1px solid #a0d9ef",
                  marginBottom: "20px",
                  boxSizing: "border-box",
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
                Первоначальный взнос (сом):
              </label>
              <input
                type="text"
                value={initialPayment}
                onChange={handleInitialPaymentChange}
                onKeyDown={handleKeyDown} // ДОБАВЛЕНО
                placeholder="0"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "18px",
                  borderRadius: "8px",
                  border: "1px solid #a0d9ef",
                  marginBottom: "20px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={calculateCommissions}
              style={{
                flex: 2,
                padding: "12px 25px",
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
              Рассчитать 🚀 (Enter)
            </button>

            <button
              onClick={handleReset}
              style={{
                flex: 1,
                padding: "12px",
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
              🔄 Сброс (Esc)
            </button>
          </div>
        </div>

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
              <h3 style={{ color: "#0056b3", margin: 0 }}>
                📊 Итоги (Кредит: {formatCurrency(results.loanAmount)})
              </h3>
              <button
                onClick={copyToClipboard}
                style={{
                  marginTop: "10px",
                  padding: "8px 15px",
                  backgroundColor: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                📋 Скопировать ответ
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
                borderSpacing: "0 10px",
                textAlign: "center",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                  <th style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>
                    Условия
                  </th>
                  <th style={{ padding: "12px" }}>Комиссия</th>
                  <th
                    style={{
                      padding: "12px",
                      backgroundColor: "#ffc107",
                      color: "#333",
                    }}
                  >
                    Всего к выплате
                  </th>
                  <th style={{ padding: "12px", borderRadius: "0 8px 8px 0" }}>
                    В месяц
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* --- БАНК --- */}
                <tr style={{ backgroundColor: "#e6f7ff" }}>
                  <td style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>
                    🏦 Банк 3 мес (6%)
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#0056b3",
                    }}
                  >
                    {formatCurrency(results.bank3MonthsCommission)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(results.totalBank3Months)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "0 8px 8px 0",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                    }}
                  >
                    {formatCurrency(results.monthlyBank3Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#e6f7ff" }}>
                  <td style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>
                    🏦 Банк 6 мес (9%)
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#0056b3",
                    }}
                  >
                    {formatCurrency(results.bank6MonthsCommission)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(results.totalBank6Months)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "0 8px 8px 0",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                    }}
                  >
                    {formatCurrency(results.monthlyBank6Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#e6f7ff" }}>
                  <td style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>
                    🏦 Банк 8 мес (12%)
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#0056b3",
                    }}
                  >
                    {formatCurrency(results.bank8MonthsCommission)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(results.totalBank8Months)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "0 8px 8px 0",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                    }}
                  >
                    {formatCurrency(results.monthlyBank8Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#e6f7ff" }}>
                  <td style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>
                    🏦 Банк 12 мес (16%)
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#0056b3",
                    }}
                  >
                    {formatCurrency(results.bank12MonthsCommission)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(results.totalBank12Months)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "0 8px 8px 0",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                    }}
                  >
                    {formatCurrency(results.monthlyBank12Months)}
                  </td>
                </tr>

                {/* --- CASH2U --- */}
                <tr
                  style={{
                    backgroundColor: "#f3e5f5",
                    boxShadow: "0 2px 5px rgba(111, 66, 193, 0.1)",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "8px 0 0 8px",
                      color: "#4a148c",
                      fontWeight: "bold",
                    }}
                  >
                    💜 Cash2U 3 мес (10%)
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#6a1b9a",
                    }}
                  >
                    {formatCurrency(results.cash2uCommission)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(results.totalCash2u)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "0 8px 8px 0",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                      color: "#4a148c",
                    }}
                  >
                    {formatCurrency(results.monthlyCash2u3Months)}
                  </td>
                </tr>
                <tr
                  style={{
                    backgroundColor: "#f3e5f5",
                    boxShadow: "0 2px 5px rgba(111, 66, 193, 0.1)",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "8px 0 0 8px",
                      color: "#4a148c",
                      fontWeight: "bold",
                    }}
                  >
                    💜 Cash2U 6 мес (10%)
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#6a1b9a",
                    }}
                  >
                    {formatCurrency(results.cash2uCommission)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(results.totalCash2u)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "0 8px 8px 0",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                      color: "#4a148c",
                    }}
                  >
                    {formatCurrency(results.monthlyCash2u6Months)}
                  </td>
                </tr>

                {/* --- МКК --- */}
                <tr style={{ backgroundColor: "#fffbe6" }}>
                  <td style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>
                    💰 МКК 3 мес (15%)
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#ff8c00",
                    }}
                  >
                    {formatCurrency(results.mkk3MonthsCommission)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(results.totalMKK3Months)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "0 8px 8px 0",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                    }}
                  >
                    {formatCurrency(results.monthlyMKK3Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#fffbe6" }}>
                  <td style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>
                    💰 МКК 6 мес (25%)
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#ff8c00",
                    }}
                  >
                    {formatCurrency(results.mkk6MonthsCommission)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(results.totalMKK6Months)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "0 8px 8px 0",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                    }}
                  >
                    {formatCurrency(results.monthlyMKK6Months)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: "#fffbe6" }}>
                  <td style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>
                    💰 МКК 9 мес (35%)
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#ff8c00",
                    }}
                  >
                    {formatCurrency(results.mkk9MonthsCommission)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff3cd",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(results.totalMKK9Months)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      borderRadius: "0 8px 8px 0",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                    }}
                  >
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
        <p style={{ margin: "5px 0" }}>📞 {STORE_PHONE}</p>
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
