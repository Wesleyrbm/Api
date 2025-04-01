const pool = require('./db');

async function testarConexao() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conexão bem-sucedida! Hora atual do servidor:', res.rows[0].now);
  } catch (error) {
    console.error('Erro ao conectar no banco de dados:', error);
  } finally {
    pool.end();
  }
}

testarConexao();
