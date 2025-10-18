export enum DocumentStatus {
  Pendente = 'Pendente',
  Enviado = 'Enviado (PAP)',
  EmRevisao = 'Em Revisão (PR)',
  EmVerificacao = 'Em Verificação',
}

export interface DocumentData {
  name: string;
  status: DocumentStatus;
  plannedDate?: Date;
  emissionDate?: Date;
  isBlocked?: boolean;
}

export interface Project {
  id: string;
  name:string;
  documents: DocumentData[];
}
