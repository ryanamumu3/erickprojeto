const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const sequelize = require('./database');
const Task = require('./models/task');
const Category = require('./models/category');

const app = express();
const PORT = 3000;

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Configurar Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Sincronizar com o banco de dados
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced!');
});

// ---------------- Rotas de Tarefas ---------------- //

// Listar todas as tarefas
app.get('/', async (req, res) => {
  let tasks = await Task.findAll();
  tasks = tasks.map((task) => task.dataValues);

  res.render('index', { tasks });
});

// Exibir formulário de criação de tarefas
app.get('/create', (req, res) => {
  res.render('create');
});

// Criar uma nova tarefa
app.post('/create', async (req, res) => {
  const { nome, descricao } = req.body;
  await Task.create({ nome, descricao });
  res.redirect('/');
});

// Exibir formulário de edição de tarefas
app.get('/edit/:id', async (req, res) => {
  let task = await Task.findByPk(req.params.id);
  task = task.dataValues;

  res.render('edit', { task });
});

// Atualizar uma tarefa
app.post('/edit/:id', async (req, res) => {
  const { nome, descricao, status } = req.body;
  await Task.update(
    { nome, descricao, status: status === 'on' },
    { where: { id: req.params.id } }
  );
  res.redirect('/');
});

// Deletar uma tarefa
app.get('/delete/:id', async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.redirect('/');
});

// ---------------- Rotas de Categorias ---------------- //

// Listar todas as categorias
app.get('/categories', async (req, res) => {
  let categories = await Category.findAll();
  categories = categories.map((category) => category.dataValues);

  res.render('category/index', { categories });
});

// Exibir formulário de criação de categorias
app.get('/categories/create', (req, res) => {
  res.render('category/create');
});

// Criar uma nova categoria
app.post('/categories/create', async (req, res) => {
  const { nome, descricao } = req.body;
  await Category.create({ nome, descricao });
  res.redirect('/categories');
});

// Exibir formulário de edição de categorias
app.get('/categories/edit/:id', async (req, res) => {
  let category = await Category.findByPk(req.params.id);
  category = category.dataValues;

  res.render('category/edit', { category });
});

// Atualizar uma categoria
app.post('/categories/edit/:id', async (req, res) => {
  const { nome, descricao } = req.body;
  await Category.update(
    { nome, descricao },
    { where: { id: req.params.id } }
  );
  res.redirect('/categories');
});

// Deletar uma categoria
app.get('/categories/delete/:id', async (req, res) => {
  await Category.destroy({ where: { id: req.params.id } });
  res.redirect('/categories');
});

// ---------------- Iniciar o Servidor ---------------- //
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
