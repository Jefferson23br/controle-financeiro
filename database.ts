import * as SQLite from 'expo-sqlite';

// Tipos para as entidades do banco de dados
type Conta = {
  id: number;
  nome: string;
  lancamentos: Lancamento[];
};

type Categoria = {
  id: number;
  nome: string;
  tipo: 'receita' | 'despesa';
};

type Lancamento = {
  id: number;
  tipo: 'receita' | 'despesa';
  categoria_id: number;
  categoria: string;
  conta_id: number;
  conta: string;
  valor: number;
  data: string;
  descricao?: string;
  status: 'pago' | 'nao_pago';
};

// Abrir o banco de dados
const db = SQLite.openDatabaseSync('financeiro.db');

// Função para inicializar o banco de dados
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS contas (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        nome TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        nome TEXT NOT NULL, 
        tipo TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS lancamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        tipo TEXT NOT NULL, 
        categoria_id INTEGER, 
        conta_id INTEGER, 
        valor REAL NOT NULL, 
        data TEXT NOT NULL, 
        descricao TEXT, 
        status TEXT NOT NULL, 
        FOREIGN KEY (categoria_id) REFERENCES categorias(id), 
        FOREIGN KEY (conta_id) REFERENCES contas(id)
      );
    `);
  } catch (error) {
    console.log('Erro ao inicializar o banco de dados:', error);
  }
};

// Função para obter todas as contas
export const getContas = async (callback: (contas: Conta[]) => void) => {
  try {
    const contas: Conta[] = await db.getAllAsync('SELECT * FROM contas');
    
    for (const conta of contas) {
      const lancamentos: Lancamento[] = await db.getAllAsync(
        'SELECT l.*, c.nome as categoria, ct.nome as conta FROM lancamentos l LEFT JOIN categorias c ON l.categoria_id = c.id LEFT JOIN contas ct ON l.conta_id = ct.id WHERE l.conta_id = ?',
        [conta.id]
      );
      conta.lancamentos = lancamentos;
    }

    callback(contas);
  } catch (error) {
    console.log('Erro ao obter contas:', error);
    callback([]);
  }
};

// Função para adicionar uma conta
export const addConta = async (nome: string, callback: (success: boolean) => void) => {
  try {
    await db.runAsync('INSERT INTO contas (nome) VALUES (?);', [nome]);
    callback(true);
  } catch (error) {
    console.log('Erro ao adicionar conta:', error);
    callback(false);
  }
};

// Função para atualizar uma conta
export const updateConta = async (id: number, nome: string, callback: (success: boolean) => void) => {
  try {
    await db.runAsync('UPDATE contas SET nome = ? WHERE id = ?;', [nome, id]);
    callback(true);
  } catch (error) {
    console.log('Erro ao atualizar conta:', error);
    callback(false);
  }
};

// Função para obter todas as categorias
export const getCategorias = async (callback: (categorias: Categoria[]) => void) => {
  try {
    const categorias: Categoria[] = await db.getAllAsync('SELECT * FROM categorias');
    callback(categorias);
  } catch (error) {
    console.log('Erro ao obter categorias:', error);
    callback([]);
  }
};

// Função para obter uma categoria por ID
export const getCategoriaById = async (id: number, callback: (categoria: Categoria | null) => void) => {
  try {
    const categoria: Categoria | null = await db.getFirstAsync(
      'SELECT * FROM categorias WHERE id = ?',
      [id]
    );
    callback(categoria);
  } catch (error) {
    console.log('Erro ao obter categoria por ID:', error);
    callback(null);
  }
};

// Função para adicionar uma categoria
export const addCategoria = async (nome: string, tipo: string, callback: (success: boolean) => void) => {
  try {
    await db.runAsync('INSERT INTO categorias (nome, tipo) VALUES (?, ?);', [nome, tipo]);
    callback(true);
  } catch (error) {
    console.log('Erro ao adicionar categoria:', error);
    callback(false);
  }
};

// Função para atualizar uma categoria
export const updateCategoria = async (id: number, nome: string, tipo: string, callback: (success: boolean) => void) => {
  try {
    await db.runAsync('UPDATE categorias SET nome = ?, tipo = ? WHERE id = ?;', [nome, tipo, id]);
    callback(true);
  } catch (error) {
    console.log('Erro ao atualizar categoria:', error);
    callback(false);
  }
};

// Função para obter todos os lançamentos
export const getLancamentos = async (callback: (lancamentos: Lancamento[]) => void) => {
  try {
    const lancamentos: Lancamento[] = await db.getAllAsync(
      'SELECT l.*, c.nome as categoria, ct.nome as conta FROM lancamentos l LEFT JOIN categorias c ON l.categoria_id = c.id LEFT JOIN contas ct ON l.conta_id = ct.id'
    );
    callback(lancamentos);
  } catch (error) {
    console.log('Erro ao obter lançamentos:', error);
    callback([]);
  }
};

// Função para adicionar um lançamento
export const addLancamento = async (
  tipo: string,
  categoria_id: number,
  conta_id: number,
  valor: number,
  data: string,
  descricao: string,
  status: string,
  callback: (success: boolean) => void
) => {
  try {
    await db.runAsync(
      'INSERT INTO lancamentos (tipo, categoria_id, conta_id, valor, data, descricao, status) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [tipo, categoria_id, conta_id, valor, data, descricao || null, status]
    );
    callback(true);
  } catch (error) {
    console.log('Erro ao adicionar lançamento:', error);
    callback(false);
  }
};

// Função para atualizar um lançamento
export const updateLancamento = async (
  id: number,
  tipo: string,
  categoria_id: number,
  conta_id: number,
  valor: number,
  data: string,
  descricao: string,
  status: string,
  callback: (success: boolean) => void
) => {
  try {
    await db.runAsync(
      'UPDATE lancamentos SET tipo = ?, categoria_id = ?, conta_id = ?, valor = ?, data = ?, descricao = ?, status = ? WHERE id = ?;',
      [tipo, categoria_id, conta_id, valor, data, descricao || null, status, id]
    );
    callback(true);
  } catch (error) {
    console.log('Erro ao atualizar lançamento:', error);
    callback(false);
  }
};