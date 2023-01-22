const http = require('http');
const mongoose = require('mongoose');
const express = require('express');

const config = require('./config/config');

//configurações iniciais
const app = express();
app.use(express.json());
//configurando porta
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//criando servidor http
const server = http.createServer(app);

//configurando banco de dados
mongoose.set('strictQuery', false);
mongoose.connect(config.connectionString);

//definindo a porta e mostrando console.log
server.listen(port);
console.log('API rodando na porta ' + port);

const User = require('./models/User');

const userRoute= require('./routes/userRoute');

app.use('/auth', userRoute);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}