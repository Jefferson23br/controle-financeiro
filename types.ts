export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  DetalhesContas: undefined;
  LancamentoReceita: undefined;
  LancamentoDespesa: undefined;
  DetalhesGraficos: { tipo: 'receita' | 'despesa' };
  ContasAPagar: undefined;
  GerenciarCategorias: undefined;
  Configuracoes: undefined;
  EditarConta: { contaId?: number }; // Para criar ou editar uma conta
  EditarLancamento: { lancamento: any }; // Para editar um lançamento
};

export interface Lancamento {
  id: number;
  tipo: 'receita' | 'despesa';
  categoria_id: number;
  conta_id: number;
  valor: number;
  data: string;
  descricao: string | null;
  status: 'pago' | 'nao_pago';
  categoria: string;
  conta: string;
}

export interface Conta {
  id: number;
  nome: string;
  lancamentos: Lancamento[];
}