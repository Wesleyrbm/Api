<template>
  <div class="container">
    <h1>Conversor de Moedas</h1>
    <p>Status: <strong>{{ status }}</strong></p>

    <!-- Campo para inserir valor -->
    <label>Valor:</label>
    <input type="number" v-model.number="amount" @input="convertCurrency" placeholder="Digite o valor" />

    <!-- Selecione a moeda de origem -->
    <label>Moeda de Origem:</label>
    <select v-model="baseCurrency" @change="convertCurrency">
      <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
    </select>

    <!-- Selecione a moeda de destino -->
    <label>Moeda de Destino:</label>
    <select v-model="targetCurrency" @change="convertCurrency">
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      amount: 1,  
      exchangeRate: null,
      baseCurrency: 'USD',
      targetCurrency: 'EUR',
      convertedAmount: null,
      currencies: ['USD', 'EUR', 'GBP', 'JPY', 'BRL', 'CAD', 'AUD', 'CHF'],
      history: [],
      status: 'Inativo'
    };
  },
  mounted() {
    this.fetchExchangeRate();
  },
  methods: {
    async fetchExchangeRate() {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${this.baseCurrency}`);
        this.exchangeRate = response.data.rates[this.targetCurrency];
        this.convertCurrency();
        this.status = 'Ativo';
      } catch (error) {
        console.error('Erro ao obter dados da API', error);
        this.status = 'Erro na API';
      }
    },
    convertCurrency() {
      if (this.exchangeRate && this.amount > 0) {
        this.convertedAmount = (this.amount * this.exchangeRate).toFixed(2);

        // Adiciona ao histórico (mantendo só os últimos 5)
        this.history.unshift({
          amount: this.amount,
          base: this.baseCurrency,
          converted: this.convertedAmount,
          target: this.targetCurrency
        });
        if (this.history.length > 5) this.history.pop();
      }
    },
    clearHistory() {
      this.history = [];
    }
  },
  watch: {
    baseCurrency() {
      this.fetchExchangeRate();
    },
    targetCurrency() {
      this.fetchExchangeRate();
    }
  }
};
</script>
