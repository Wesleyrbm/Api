<template>
  <div class="container">
    <h1>Conversor de Moedas</h1>
    <p>Status: <strong>{{ status }}</strong></p>

    <!-- Campo para inserir valor -->
    <label>Valor:</label>
    <input type="number" v-model.number="amount" @input="convertCurrency" placeholder="Digite o valor" />

    <!-- Selecione a moeda de origem -->
    <label>Moeda de Origem:</label>
    <select v-model="baseCurrency" @change="fetchExchangeRate">
      <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
    </select>

    <!-- Selecione a moeda de destino -->
    <label>Moeda de Destino:</label>
    <select v-model="targetCurrency" @change="fetchExchangeRate">
      <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
    </select>

    <!-- Exibindo a conversão -->
    <p v-if="convertedAmount">
      {{ amount }} {{ baseCurrency }} = <strong>{{ convertedAmount }}</strong> {{ targetCurrency }}
    </p>

    <!-- Gráfico de barras -->
    <h3>Gráfico Financeiro</h3>
    <canvas id="graficoMoedas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watchEffect } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  setup() {
    const amount = ref(1);
    const baseCurrency = ref("USD");
    const targetCurrency = ref("EUR");
    const convertedAmount = ref(null);
    const exchangeRate = ref(null);
    const status = ref("Inativo");
    let chart = null;

    const currencies = ["USD", "EUR", "GBP", "BRL", "CAD", "AUD", "CHF"];

    // Buscar taxa de câmbio
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency.value}`);
        exchangeRate.value = response.data.rates[targetCurrency.value];
        convertCurrency();
        updateChart(response.data.rates);
        status.value = "Ativo";
      } catch (error) {
        console.error("Erro ao obter dados da API", error);
        status.value = "Erro na API";
      }
    };

    // Converter moeda
    const convertCurrency = () => {
      if (exchangeRate.value && amount.value > 0) {
        convertedAmount.value = (amount.value * exchangeRate.value).toFixed(2);
      }
    };

    // Inicializar gráfico
    const initChart = () => {
      const ctx = document.getElementById("graficoMoedas").getContext("2d");
      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: currencies,
          datasets: [
            {
              label: "Valor da Moeda em relação ao USD",
              data: [],
              backgroundColor: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"]
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    };

    // Atualizar gráfico
    const updateChart = (rates) => {
      if (chart) {
        chart.data.datasets[0].data = currencies.map(currency => rates[currency] || 0);
        chart.update();
      }
    };

    onMounted(() => {
      fetchExchangeRate();
      initChart();
    });

    watchEffect(() => {
      fetchExchangeRate();
    });

    return {
      amount,
      baseCurrency,
      targetCurrency,
      convertedAmount,
      currencies,
      status,
      fetchExchangeRate,
      convertCurrency
    };
  }
};
</script>
