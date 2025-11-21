import { useState } from "react";
import "./App.css";
// Фиксированная комиссия МКК (сом)
const MKK_FEE = 1000;
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
  productName: string;
  price: number;
  bank3MonthsCommission: number;
  bank8MonthsCommission: number;
  mkk3MonthsCommission: number;
  mkk6MonthsCommission: number;
  mkk9MonthsCommission: number;
  monthlyBank3Months: number;
  monthlyBank8Months: number;
  monthlyMKK3Months: number;
  monthlyMKK6Months: number;
  monthlyMKK9Months: number;
  totalBank3Months: number;
  totalBank8Months: number;
  totalMKK3Months: number;
  totalMKK6Months: number;
  totalMKK9Months: number;
}

function App() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [results, setResults] = useState<ResultsType | null>(null);
  const [errorMessage, setErrorMessage] = useState(""); // Для замены alert()

  // Состояние для хранения текущей мотивирующей фразы
  const [motivationalPhrase, setMotivationalPhrase] = useState(
    MOTIVATIONAL_PHRASES[0]
  );

  // Функция для выбора и установки случайной фразы
  const setRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length);
    setMotivationalPhrase(MOTIVATIONAL_PHRASES[randomIndex]);
  };

  const handlePriceChange = (event) => {
    // Разрешаем вводить только числа
    const value = event.target.value.replace(/[^0-9]/g, "");
    setProductPrice(value);
    setResults(null);
    setErrorMessage("");
  };

  const calculateCommissions = () => {
    const price = parseFloat(productPrice);
    setErrorMessage(""); // Сброс ошибки

    if (isNaN(price) || price <= 0) {
      setErrorMessage(
        "⚠️ Пожалуйста, введите корректную стоимость товара (больше нуля)."
      );
      return;
    }
    if (productName.trim() === "") {
      setErrorMessage("⚠️ Пожалуйста, введите название товара.");
      return;
    }

    // Обновляем мотивирующую фразу при каждом успешном расчете
    setRandomPhrase();

    // --- 1. Расчеты Общей Комиссии (Ваши расходы, TomStore.kg) ---
    const bank3MonthsCommission = price * 0.06;
    const bank8MonthsCommission = price * 0.12;
    const mkk3MonthsCommission = price * 0.15 + MKK_FEE;
    const mkk6MonthsCommission = price * 0.25 + MKK_FEE;
    const mkk9MonthsCommission = price * 0.3 + MKK_FEE;

    // --- 2. Расчеты Общей Суммы к Выплате (Товар + Комиссия) ---
    const totalBank3Months = price + bank3MonthsCommission;
    const totalBank8Months = price + bank8MonthsCommission;
    const totalMKK3Months = price + mkk3MonthsCommission;
    const totalMKK6Months = price + mkk6MonthsCommission;
    const totalMKK9Months = price + mkk9MonthsCommission;

    // --- 3. Расчеты Ежемесячного Платежа (Расходы покупателя) ---
    const monthlyBank3Months = totalBank3Months / 3;
    const monthlyBank8Months = totalBank8Months / 8;
    const monthlyMKK3Months = totalMKK3Months / 3;
    const monthlyMKK6Months = totalMKK6Months / 6;
    const monthlyMKK9Months = totalMKK9Months / 9;

    setResults({
      productName,
      price,
      // Комиссии (Ваши расходы)
      bank3MonthsCommission,
      bank8MonthsCommission,
      mkk3MonthsCommission,
      mkk6MonthsCommission,
      mkk9MonthsCommission,
      // Общая сумма к выплате (НОВОЕ)
      totalBank3Months,
      totalBank8Months,
      totalMKK3Months,
      totalMKK6Months,
      totalMKK9Months,
      // Ежемесячные платежи
      monthlyBank3Months,
      monthlyBank8Months,
      monthlyMKK3Months,
      monthlyMKK6Months,
      monthlyMKK9Months,
    });
  };

  // Функция для форматирования чисел
  const formatCurrency = (value) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " сом";
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px", // Максимальная ширина для десктопа
        width: "95%", // Использует 95% ширины экрана, адаптивно для мобильных
        margin: "20px auto", // Центрирование
        fontFamily: "Inter, sans-serif",
        borderRadius: "15px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        background: "linear-gradient(145deg, #f0f8ff 0%, #e8f0ff 100%)", // Нежный, профессиональный градиент
        border: "1px solid #d0d8e0",
      }}
    >
      {/* --- Заголовок и Мотивация --- */}
      <h1
        style={{
          textAlign: "center",
          color: "#0056b3",
          marginBottom: "10px",
          fontSize: "2.5em",
          fontWeight: "700",
          borderBottom: "3px solid #ffc107",
          paddingBottom: "10px",
          textShadow: "1px 1px 1px rgba(0,0,0,0.05)",
        }}
      >
        TomStore.kg: Сравнение Рассрочки
      </h1>

      {/* Мотивация (динамическая) */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          border: "1px solid #c9e0f6",
        }}
      >
        <p
          style={{
            fontSize: "1.2em",
            color: "#28a745",
            fontWeight: "600",
            animation: "scaleIn 0.8s ease-out",
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
          backgroundColor: "#ffffff",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Сообщение об ошибке */}
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

        <label
          htmlFor="name-input"
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Название товара:
        </label>
        <input
          id="name-input"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Например, Ноутбук HP Spectre"
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #a0d9ef",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <label
          htmlFor="price-input"
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Стоимость товара (в сомах):
        </label>
        <input
          id="price-input"
          type="text"
          value={productPrice}
          onChange={handlePriceChange}
          placeholder="Например, 65000"
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #a0d9ef",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={calculateCommissions}
          style={{
            display: "block",
            width: "100%",
            padding: "12px 25px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(40,167,69,0.4)",
            transition: "background-color 0.3s ease, transform 0.1s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#218838")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#28a745")
          }
        >
          Рассчитать все варианты 🚀
        </button>
      </div>

      {/* --- Результаты расчетов --- */}
      {results && (
        <div>
          <h3
            style={{
              color: "#0056b3",
              borderBottom: "2px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            📊 Результаты для "{results.productName}" (
            {formatCurrency(results.price)})
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 10px", // Отступы между строками
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                <th
                  style={{
                    padding: "15px",
                    borderRadius: "8px 0 0 8px",
                    width: "25%",
                  }}
                >
                  Условия
                </th>
                <th style={{ padding: "15px", width: "25%" }}>
                  💰 Ваши Расходы (Комиссия)
                </th>
                <th
                  style={{
                    padding: "15px",
                    backgroundColor: "#ffc107",
                    color: "#333",
                    fontWeight: "bold",
                    width: "25%",
                  }}
                >
                  Общая сумма к выплате
                </th>
                <th
                  style={{
                    padding: "15px",
                    borderRadius: "0 8px 8px 0",
                    width: "25%",
                  }}
                >
                  💵 Платеж в мес. (Для клиента)
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Банк 3 мес. */}
              <tr
                style={{
                  backgroundColor: "#e6f7ff",
                  boxShadow: "0 2px 5px rgba(0, 123, 255, 0.1)",
                }}
              >
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #c9e0f6",
                    borderRight: "none",
                    borderRadius: "8px 0 0 8px",
                  }}
                >
                  🏦 **Банк, 3 мес. (6%)**
                </td>
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #c9e0f6",
                    borderLeft: "none",
                    borderRight: "none",
                    fontWeight: "bold",
                    color: "#0056b3",
                  }}
                >
                  {formatCurrency(results.bank3MonthsCommission)}
                </td>
                <td
                  style={{
                    padding: "15px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #c9e0f6",
                    borderLeft: "1px solid #ffc107",
                    borderRight: "1px solid #ffc107",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {/* Общая сумма к выплате */}
                  {formatCurrency(results.totalBank3Months)}
                </td>
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #c9e0f6",
                    borderLeft: "none",
                    borderRadius: "0 8px 8px 0",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(results.monthlyBank3Months)}
                </td>
              </tr>

              {/* Банк 8 мес. */}
              <tr
                style={{
                  backgroundColor: "#e6f7ff",
                  boxShadow: "0 2px 5px rgba(0, 123, 255, 0.1)",
                }}
              >
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #c9e0f6",
                    borderRight: "none",
                    borderRadius: "8px 0 0 8px",
                  }}
                >
                  🏦 **Банк, 8 мес. (12%)**
                </td>
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #c9e0f6",
                    borderLeft: "none",
                    borderRight: "none",
                    fontWeight: "bold",
                    color: "#0056b3",
                  }}
                >
                  {formatCurrency(results.bank8MonthsCommission)}
                </td>
                <td
                  style={{
                    padding: "15px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #c9e0f6",
                    borderLeft: "1px solid #ffc107",
                    borderRight: "1px solid #ffc107",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {/* Общая сумма к выплате */}
                  {formatCurrency(results.totalBank8Months)}
                </td>
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #c9e0f6",
                    borderLeft: "none",
                    borderRadius: "0 8px 8px 0",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(results.monthlyBank8Months)}
                </td>
              </tr>

              {/* МКК 3 мес. */}
              <tr
                style={{
                  backgroundColor: "#fffbe6",
                  boxShadow: "0 2px 5px rgba(255, 193, 7, 0.1)",
                }}
              >
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #ffe0a3",
                    borderRight: "none",
                    borderRadius: "8px 0 0 8px",
                  }}
                >
                  💰 **МКК, 3 мес. (15% + {MKK_FEE}с)**
                </td>
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #ffe0a3",
                    borderLeft: "none",
                    borderRight: "none",
                    fontWeight: "bold",
                    color: "#ff8c00",
                  }}
                >
                  {formatCurrency(results.mkk3MonthsCommission)}
                </td>
                <td
                  style={{
                    padding: "15px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffe0a3",
                    borderLeft: "1px solid #ffc107",
                    borderRight: "1px solid #ffc107",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {/* Общая сумма к выплате */}
                  {formatCurrency(results.totalMKK3Months)}
                </td>
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #ffe0a3",
                    borderLeft: "none",
                    borderRadius: "0 8px 8px 0",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(results.monthlyMKK3Months)}
                </td>
              </tr>

              {/* МКК 6 мес. */}
              <tr
                style={{
                  backgroundColor: "#fffbe6",
                  boxShadow: "0 2px 5px rgba(255, 193, 7, 0.1)",
                }}
              >
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #ffe0a3",
                    borderRight: "none",
                    borderRadius: "8px 0 0 8px",
                  }}
                >
                  💰 **МКК, 6 мес. (25% + {MKK_FEE}с)**
                </td>
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #ffe0a3",
                    borderLeft: "none",
                    borderRight: "none",
                    fontWeight: "bold",
                    color: "#ff8c00",
                  }}
                >
                  {formatCurrency(results.mkk6MonthsCommission)}
                </td>
                <td
                  style={{
                    padding: "15px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffe0a3",
                    borderLeft: "1px solid #ffc107",
                    borderRight: "1px solid #ffc107",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {/* Общая сумма к выплате */}
                  {formatCurrency(results.totalMKK6Months)}
                </td>
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #ffe0a3",
                    borderLeft: "none",
                    borderRadius: "0 8px 8px 0",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(results.monthlyMKK6Months)}
                </td>
              </tr>

              {/* МКК 9 мес. */}
              <tr
                style={{
                  backgroundColor: "#fffbe6",
                  boxShadow: "0 2px 5px rgba(255, 193, 7, 0.1)",
                }}
              >
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #ffe0a3",
                    borderRight: "none",
                    borderRadius: "8px 0 0 8px",
                  }}
                >
                  💰 **МКК, 9 мес. (30% + {MKK_FEE}с)**
                </td>
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #ffe0a3",
                    borderLeft: "none",
                    borderRight: "none",
                    fontWeight: "bold",
                    color: "#ff8c00",
                  }}
                >
                  {formatCurrency(results.mkk9MonthsCommission)}
                </td>
                <td
                  style={{
                    padding: "15px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffe0a3",
                    borderLeft: "1px solid #ffc107",
                    borderRight: "1px solid #ffc107",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {/* Общая сумма к выплате */}
                  {formatCurrency(results.totalMKK9Months)}
                </td>
                <td
                  style={{
                    padding: "15px",
                    border: "1px solid #ffe0a3",
                    borderLeft: "none",
                    borderRadius: "0 8px 8px 0",
                    fontWeight: "bold",
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
  );
}
export default App;
