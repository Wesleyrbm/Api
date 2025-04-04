new Vue({
  el: "#app",
  data: {
    status: "Carregando...",
    baseCurrency: "USD",
    targetCurrency: "BRL",
    amount: 1,
    convertedAmount: null,
    exchangeRate: null,
    chart: null,
    rates: {},
    currencies: ["USD", "EUR", "GBP", "BRL", "CAD", "AUD", "CHF"]
  },
  mounted() {
    this.fetchExchangeRate();
  },
  watch: {
    baseCurrency() {
      this.fetchExchangeRate();
    },
    targetCurrency() {
      this.fetchExchangeRate();
    }
  },
  methods: {
    async fetchExchangeRate() {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${this.baseCurrency}`);
        this.rates = response.data.rates;
        this.exchangeRate = this.rates[this.targetCurrency];
        this.status = "Atualizado";
        this.updateChart();
      } catch (error) {
        console.error("Erro ao buscar taxa de câmbio", error);
        this.status = "Erro na API";
      }
    },
    initChart() {
      const ctx = document.getElementById("graficoMoedas").getContext("2d");
      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.currencies,
          datasets: [
            {
              label: `Valor em relação ao ${this.baseCurrency}`,
              data: [],
              backgroundColor: [
                "red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"
              ]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    },
    updateChart() {
      if (!this.chart) {
        this.initChart();
      }
      this.chart.data.datasets[0].label = `Valor em relação ao ${this.baseCurrency}`;
      this.chart.data.datasets[0].data = this.currencies.map(currency => this.rates[currency] || 0);
      this.chart.update();
    }
  }
});
