new Vue({
    el: '#app',
    data() {
      return {
        message: 'Olá, Vue.js está funcionando!',
        exchangeRate: null,
        baseCurrency: 'USD',  // Moeda de origem padrão
        targetCurrency: 'EUR', // Moeda de destino padrão
        currencies: ['USD', 'EUR', 'GBP', 'JPY', 'BRL', 'CAD', 'AUD', 'CHF'], // Lista de moedas
        status: 'Inativo'
      };
    },
    mounted() {
      this.fetchExchangeRate();  // Chama a API ao carregar a página
    },
    methods: {
      async fetchExchangeRate() {
        try {
          const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${this.baseCurrency}`);
          this.exchangeRate = response.data.rates[this.targetCurrency];  
          this.status = 'Ativo';  
        } catch (error) {
          console.error('Erro ao obter dados da API', error);
          this.status = 'Inativo';  
        }
      }
    },
    watch: {
      baseCurrency() {
        this.fetchExchangeRate();  // Atualiza a taxa sempre que a moeda de origem mudar
      },
      targetCurrency() {
        this.fetchExchangeRate();  // Atualiza a taxa sempre que a moeda de destino mudar
      }
    },
    template: `
      <div class="container">
        <h1>{{ message }}</h1>
        <h2>Conversor de Moedas</h2>
        <p>Status: <strong>{{ status }}</strong></p>
        
        <!-- Selecione a moeda de origem -->
        <label>Moeda de Origem:</label>
        <select v-model="baseCurrency">
          <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
        </select>
        
        <!-- Selecione a moeda de destino -->
        <label>Moeda de Destino:</label>
        <select v-model="targetCurrency">
          <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
        </select>
        
        <!-- Exibindo a taxa de câmbio -->
        <p class="exchange-rate" v-if="exchangeRate">
          1 {{ baseCurrency }} = {{ exchangeRate }} {{ targetCurrency }}
        </p>
        <p v-if="!exchangeRate">Carregando...</p>
      </div>
    `
  });
  