import { useState } from "react";

import "./App.css";

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
}
const MKK_FEE = 1000;
function App() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [results, setResults] = useState<ResultsType | null>(null);

  const handlePriceChange = (event) => {
    // Разрешаем вводить только числа
    const value = event.target.value.replace(/[^0-9]/g, "");
    setProductPrice(value);
    setResults(null);
  };

  const calculateCommissions = () => {
    const price = parseFloat(productPrice);

    if (isNaN(price) || price <= 0) {
      alert("Пожалуйста, введите корректную стоимость товара.");
      return;
    }
    if (productName.trim() === "") {
      alert("Пожалуйста, введите название товара.");
      return;
    }

    // --- 1. Расчеты Общей Комиссии (Ваши расходы) ---
    const bank3MonthsCommission = price * 0.06;
    const bank8MonthsCommission = price * 0.12;
    const mkk3MonthsCommission = price * 0.15 + MKK_FEE;
    const mkk6MonthsCommission = price * 0.25 + MKK_FEE;
    const mkk9MonthsCommission = price * 0.3 + MKK_FEE;

    // --- 2. Расчеты Ежемесячного Платежа (Расходы покупателя) ---
    // Общая сумма к выплате = Стоимость товара + Комиссия
    const totalBank3Months = price + bank3MonthsCommission;
    const totalBank8Months = price + bank8MonthsCommission;
    const totalMKK3Months = price + mkk3MonthsCommission;
    const totalMKK6Months = price + mkk6MonthsCommission;
    const totalMKK9Months = price + mkk9MonthsCommission;

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
      // Ежемесячные платежи (Расходы покупателя)
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
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>💸 Калькулятор рассрочки: Банк vs МКК</h2>

      {/* --- Поля ввода --- */}
      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #007bff",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <label
          htmlFor="name-input"
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Название товара:
        </label>
        <input
          id="name-input"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Например, Смартфон X"
          style={{
            width: "95%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            marginBottom: "15px",
          }}
        />

        <label
          htmlFor="price-input"
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Стоимость товара (в сомах):
        </label>
        <input
          id="price-input"
          type="text"
          value={productPrice}
          onChange={handlePriceChange}
          placeholder="Например, 25000"
          style={{
            width: "95%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={calculateCommissions}
          style={{
            marginTop: "15px",
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Рассчитать
        </button>
      </div>

      {/* --- Результаты расчетов --- */}
      {results && (
        <>
          <h3>
            📊 Результаты для "{results.productName}" (
            {formatCurrency(results.price)})
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    width: "25%",
                  }}
                >
                  Условия
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    width: "35%",
                  }}
                >
                  💰 Общие расходы (Ваша комиссия)
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    width: "40%",
                  }}
                >
                  💵 Ежемесячный платеж (Для покупателя)
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Банк */}
              <tr>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    backgroundColor: "#e6f7ff",
                  }}
                >
                  🏦 **Банк, 3 мес. (6%)**
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(results.bank3MonthsCommission)}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {formatCurrency(results.monthlyBank3Months)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    backgroundColor: "#e6f7ff",
                  }}
                >
                  🏦 **Банк, 8 мес. (12%)**
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(results.bank8MonthsCommission)}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {formatCurrency(results.monthlyBank8Months)}
                </td>
              </tr>
              {/* МКК */}
              <tr style={{ backgroundColor: "#fff0f0" }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  💰 **МКК, 3 мес. (15% + {MKK_FEE}с)**
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(results.mkk3MonthsCommission)}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {formatCurrency(results.monthlyMKK3Months)}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#fff0f0" }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  💰 **МКК, 6 мес. (25% + {MKK_FEE}с)**
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(results.mkk6MonthsCommission)}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {formatCurrency(results.monthlyMKK6Months)}
                </td>
              </tr>
              <tr style={{ backgroundColor: "#fff0f0" }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  💰 **МКК, 9 мес. (30% + {MKK_FEE}с)**
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(results.mkk9MonthsCommission)}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {formatCurrency(results.monthlyMKK9Months)}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
