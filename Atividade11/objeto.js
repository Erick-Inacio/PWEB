const func1 = {
    matricula: 12345,
    nome: "João Silva",
    funcao: "Desenvolvedor"
};

console.log(func1);

function Func2(matricula, nome, funcao) {
    this.matricula = matricula;
    this.nome = nome;
    this.funcao = funcao;
}

const funcionario2 = new Func2(67890, "Maria Souza", "Analista");
console.log(funcionario2);

class Func3 {
    constructor(matricula, nome, funcao) {
        this.matricula = matricula;
        this.nome = nome;
        this.funcao = funcao;
    }
}

const funcionario3 = new Func3(54321, "Carlos Lima", "Gerente");
console.log(funcionario3);
