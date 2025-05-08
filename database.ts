import * as SQLite from 'expo-sqlite';
import { Lancamento, Conta } from './types';

const db = SQLite.openDatabaseSync('controle_financeiro.db');

export const initDatabase = () => {
  try {
    console.log('Inicializando o banco de dados...');
    db.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa'))
      );
      CREATE TABLE IF NOT EXISTS contas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS lancamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
        categoria_id INTEGER NOT NULL,
        conta_id INTEGER NOT NULL,
        valor REAL NOT NULL,
        data TEXT NOT NULL,
        descricao TEXT,
        status TEXT NOT NULL CHECK(status IN ('pago', 'nao_pago')),
        FOREIGN KEY (categoria_id) REFERENCES categorias(id),
        FOREIGN KEY (conta_id) REFERENCES contas(id)
      );
    `);

    // Inserir dados iniciais (exemplo)
    db.runSync(
      `INSERT OR IGNORE INTO categorias (id, nome, tipo) VALUES (?, ?, ?);`,
      [1, 'Salário', 'receita']
    );
    db.runSync(
      `INSERT OR IGNORE INTO categorias (id, nome, tipo) VALUES (?, ?, ?);`,
      [2, 'Alimentação', 'despesa']
    );
    db.runSync(
      `INSERT OR IGNORE INTO contas (id, nome) VALUES (?, ?);`,
      [1, 'Carteira']
    );

    // Inserir alguns lançamentos iniciais para teste
    db.runSync(
      `INSERT OR IGNORE INTO lancamentos (id, tipo, categoria_id, conta_id, valor, data, descricao, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [1, 'receita', 1, 1, 5000, '26-04-2025', 'Salário de abril', 'pago']
    );
    db.runSync(
      `INSERT OR IGNORE INTO lancamentos (id, tipo, categoria_id, conta_id, valor, data, descricao, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [2, 'despesa', 2, 1, 200, '26-04-2025', 'Compra no mercado', 'pago']
    );

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
};

export const addCategoria = (
  nome: string,
  tipo: 'receita' | 'despesa',
  callback: (success: boolean) => void
) => {
  try {
    db.runSync(
      `INSERT INTO categorias (nome, tipo) VALUES (?, ?);`,
      [nome, tipo]
    );
    callback(true);
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    callback(false);
  }
};

export const getCategorias = (callback: (categorias: any[]) => void) => {
  try {
    const categorias = db.getAllSync(
      `SELECT * FROM categorias;`
    );
    callback(categorias);
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    callback([]);
  }
};

export const updateCategoria = (
  id: number,
  nome: string,
  tipo: 'receita' | 'despesa',
  callback: (success: boolean) => void
) => {
  try {
    db.runSync(
      `UPDATE categorias SET nome = ?, tipo = ? WHERE id = ?;`,
      [nome, tipo, id]
    );
    callback(true);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    callback(false);
  }
};

export const deleteCategoria = (
  id: number,
  callback: (success: boolean) => void
) => {
  try {
    db.runSync(
      `DELETE FROM categorias WHERE id = ?;`,
      [id]
    );
    callback(true);
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    callback(false);
  }
};

export const addConta = (
  nome: string,
  callback: (success: boolean) => void
) => {
  try {
    db.runSync(
      `INSERT INTO contas (nome) VALUES (?);`,
      [nome]
    );
    callback(true);
  } catch (error) {
    console.error('Erro ao adicionar conta:', error);
    callback(false);
  }
};

export const getContas = (callback: (contas: Conta[]) => void) => {
  try {
    const contas: Conta[] = db.getAllSync(`SELECT * FROM contas;`);
    // Para cada conta, buscar os lançamentos associados
    const contasComLancamentos = contas.map((conta: Conta) => {
      const lancamentos: Lancamento[] = db.getAllSync(
        `SELECT l.*, c.nome as categoria, co.nome as conta
         FROM lancamentos l
         JOIN categorias c ON l.categoria_id = c.id
         JOIN contas co ON l.conta_id = co.id
         WHERE l.conta_id = ?;`,
        [conta.id]
      );
      return { ...conta, lancamentos };
    });
    callback(contasComLancamentos);
  } catch (error) {
    console.error('Erro ao obter contas:', error);
    callback([]);
  }
};

export const updateConta = (
  id: number,
  nome: string,
  callback: (success: boolean) => void
) => {
  try {
    db.runSync(
      `UPDATE contas SET nome = ? WHERE id = ?;`,
      [nome, id]
    );
    callback(true);
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    callback(false);
  }
};

export const deleteConta = (
  id: number,
  callback: (success: boolean) => void
) => {
  try {
    db.runSync(
      `DELETE FROM contas WHERE id = ?;`,
      [id]
    );
    callback(true);
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    callback(false);
  }
};

export const addLancamento = (
  tipo: 'receita' | 'despesa',
  categoria_id: number,
  conta_id: number,
  valor: number,
  data: string,
  descricao: string | null,
  status: 'pago' | 'nao_pago',
  callback: (success: boolean) => void
) => {
  try {
    db.runSync(
      `INSERT INTO lancamentos (tipo, categoria_id, conta_id, valor, data, descricao, status)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [tipo, categoria_id, conta_id, valor, data, descricao, status]
    );
    callback(true);
  } catch (error) {
    console.error('Erro ao adicionar lançamento:', error);
    callback(false);
  }
};

export const updateLancamento = (
  id: number,
  tipo: 'receita' | 'despesa',
  categoria_id: number,
  conta_id: number,
  valor: number,
  data: string,
  descricao: string | null,
  status: 'pago' | 'nao_pago',
  callback: (success: boolean) => void
) => {
  try {
    db.runSync(
      `UPDATE lancamentos
       SET tipo = ?, categoria_id = ?, conta_id = ?, valor = ?, data = ?, descricao = ?, status = ?
       WHERE id = ?;`,
      [tipo, categoria_id, conta_id, valor, data, descricao, status, id]
    );
    callback(true);
  } catch (error) {
    console.error('Erro ao atualizar lançamento:', error);
    callback(false);
  }
};

export const getLancamentos = (callback: (lancamentos: Lancamento[]) => void) => {
  try {
    const lancamentos: Lancamento[] = db.getAllSync(`
      SELECT l.*, c.nome as categoria, co.nome as conta
      FROM lancamentos l
      JOIN categorias c ON l.categoria_id = c.id
      JOIN contas co ON l.conta_id = co.id;
    `);
    callback(lancamentos);
  } catch (error) {
    console.error('Erro ao obter lançamentos:', error);
    callback([]);
  }
};