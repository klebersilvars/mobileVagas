// Mudando para exportações nomeadas

export interface RegistroUserOne {
    nome_completo?: string;
    email?: string;
    data_nascimento: string;
    type_conta: string;
    orientacao_sexual?: string;
}

export interface RegistroUserTwo {
    cep: string;
    logradouro?: string;
    bairro?: string;
    complemento?: string;
    estado?: string;
    uf?: string;
}

export interface RegistroEmpresaFirebase {
    nome_empresa: string,
    email_empresa: string,
    cnpj_empresa: string,
    password_empresa: string,
    type_conta: string,
    cep: string,
    cidade: string,
    data_pagamento_premium: string,
    data_assinatura: any,
    data_renovacao: any,
    descricao: string,
    dias_restantes_premium: number,
    endereco: string,
    estado: string,
    limite_publicacao_mensal: number,
    linkedin: string,
    premium: boolean,
    profileImage: string,
    publicacao_restante: number,
    ramo_atividade: string,
    site: string,
    telefone_empresa: string
}

export interface RegistroUserGeral extends RegistroUserOne, RegistroUserTwo {}
