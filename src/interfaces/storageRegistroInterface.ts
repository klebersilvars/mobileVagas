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

export interface RegistroUserGeral extends RegistroUserOne, RegistroUserTwo {}
