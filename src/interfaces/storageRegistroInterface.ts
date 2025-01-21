// Mudando para exportações nomeadas

export interface RegistroUserOne {
    nome_completo: string;
    email: string;
    data_nascimento: string;
}

export interface RegistroUserTwo {
    cep: string;
    logradouro: string;
    bairro: string;
    complemento?: string;
    estado: string;
    uf: string;
}

export interface RegistroUserThree {
    password: string;
    passwordSecondary: string;
}
