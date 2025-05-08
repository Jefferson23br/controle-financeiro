export type Conta = {
  id: number;
  nome: string;
  lancamentos: Lancamento[];
};

export type Lancamento = {
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

export type RootStackParamList = {
  Home: undefined;
  DetalhesContas: undefined;
  GerenciarCategorias: undefined;
  ContasAPagar: undefined;
  EditarConta: { contaId?: number };
  EditarCategoria: { categoriaId?: number };
  EditarLancamento: { lancamento: Lancamento };
  LancamentoReceita: undefined;
  LancamentoDespesa: undefined;
  DetalhesGraficos: { tipo: 'receita' | 'despesa' };
  Configuracoes: undefined;
  MainTabs: undefined;
};