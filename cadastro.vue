<template>
    <div class="container">
      <h2>Cadastro</h2>
      <form @submit.prevent="register">
        <label for="email">E-mail:</label>
        <input type="email" v-model="email" required />
  
        <label for="password">Senha:</label>
        <input type="password" v-model="password" required />
  
        <button type="submit">Cadastrar</button>
      </form>
  
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        message: ''
      };
    },
    methods: {
      register() {
        if (this.email && this.password) {
          localStorage.setItem('userEmail', this.email);
          localStorage.setItem('userPassword', this.password);
          this.message = 'Cadastro realizado com sucesso!';
        } else {
          this.message = 'Preencha todos os campos!';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    text-align: center;
    max-width: 400px;
    margin: auto;
    font-family: Arial, sans-serif;
  }
  
  input {
    display: block;
    margin: 10px auto;
    padding: 8px;
    width: 100%;
  }
  
  button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  