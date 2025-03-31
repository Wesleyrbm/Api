require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json()); // Permite receber JSON no corpo das requisições

// Rota para salvar uma conversão no banco
app.post('/historico', async (req, res) => {
  const { moeda_origem, moeda_destino, taxa, valor_convertido } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO historico (moeda_origem, moeda_destino, taxa, valor_convertido) VALUES ($1, $2, $3, $4) RETURNING *',
      [moeda_origem, moeda_destino, taxa, valor_convertido]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar no banco' });
  }
});

// Rota para obter o histórico de conversões
app.get('/historico', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM historico ORDER BY data_consulta DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
