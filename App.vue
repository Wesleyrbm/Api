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

    <!-- Exibindo o histórico -->
    <h3>Histórico de Conversões</h3>
    <ul>
      <li v-for="(entry, index) in history" :key="index">
        {{ entry.amount }} {{ entry.base }} = {{ entry.converted }} {{ entry.target }}
      </li>
    </ul>

    <!-- Limpar histórico -->
    <button @click="clearHistory">Limpar Histórico</button>

    <!-- Gráfico de barras -->
    <h3>Gráficos Financeiros</h3>
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
    const history = ref([]);
    const status = ref("Inativo");
    let chart = null;

    const currencies = ["USD", "EUR", "GBP", "JPY", "BRL", "CAD", "AUD", "CHF"];

    // Função para buscar taxa de câmbio
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

    // Função para converter moeda
    const convertCurrency = () => {
      if (exchangeRate.value && amount.value > 0) {
        convertedAmount.value = (amount.value * exchangeRate.value).toFixed(2);

        // Adiciona ao histórico (mantendo só os últimos 5)
        history.value.unshift({
          amount: amount.value,
          base: baseCurrency.value,
          converted: convertedAmount.value,
          target: targetCurrency.value
        });
        if (history.value.length > 5) history.value.pop();
      }
    };

    // Função para inicializar o gráfico
    const initChart = () => {
      const ctx = document.getElementById("graficoMoedas").getContext("2d");
      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: currencies,
          datasets: [
            {
              label: "Valor da Moeda em relação ao USD",
              data: [], // Dados iniciais vazios
              backgroundColor: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"]
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    };

    // Função para atualizar o gráfico
    const updateChart = (rates) => {
      if (chart) {
        chart.data.datasets[0].data = currencies.map(currency => rates[currency] || 0);
        chart.update();
      }
    };

    // Limpar histórico
    const clearHistory = () => {
      history.value = [];
    };

    // Executar ao montar o componente
    onMounted(() => {
      fetchExchangeRate();
      initChart();
    });

    // Atualiza sempre que a moeda base ou destino mudar
    watchEffect(() => {
      fetchExchangeRate();
    });

    return {
      amount,
      baseCurrency,
      targetCurrency,
      convertedAmount,
      exchangeRate,
      currencies,
      history,
      status,
      fetchExchangeRate,
      convertCurrency,
      clearHistory
    };
  }
};
</script>