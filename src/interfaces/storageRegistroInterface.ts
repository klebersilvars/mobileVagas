// Mudando para exportações nomeadas

export interface RegistroUserOne {
    nome_completo?: string;
    email?: string;
    data_nascimento: string;
    type_conta: string;
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
}

export interface RegistroUserGeral extends RegistroUserOne, RegistroUserTwo {}
