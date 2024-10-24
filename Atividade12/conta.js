class Conta {
    constructor(nomeCorrentista, banco, numeroConta, saldo) {
        this.nomeCorrentista = nomeCorrentista;
        this.banco = banco;
        this.numeroConta = numeroConta;
        this.saldo = saldo;
    }

    getNomeCorrentista() {
        return this.nomeCorrentista;
    }

    getBanco() {
        return this.banco;
    }

    getNumeroConta() {
        return this.numeroConta;
    }

    getSaldo() {
        return this.saldo;
    }

    setNomeCorrentista(nome) {
        this.nomeCorrentista = nome;
    }

    setBanco(banco) {
        this.banco = banco;
    }

    setNumeroConta(numero) {
        this.numeroConta = numero;
    }

    setSaldo(saldo) {
        this.saldo = saldo;
    }
}

class Corrente extends Conta {
    constructor(nomeCorrentista, banco, numeroConta, saldo, saldoEspecial) {
        super(nomeCorrentista, banco, numeroConta, saldo);
        this.saldoEspecial = saldoEspecial;
    }

    getSaldoEspecial() {
        return this.saldoEspecial;
    }
}

class Poupanca extends Conta {
    constructor(nomeCorrentista, banco, numeroConta, saldo, juros, dataVencimento) {
        super(nomeCorrentista, banco, numeroConta, saldo);
        this.juros = juros;
        this.dataVencimento = dataVencimento;
    }

    getJuros() {
        return this.juros;
    }

    getDataVencimento() {
        return this.dataVencimento;
    }
}

function mostrarDados() {
    // Dados da Conta Corrente
    const nomeCorrente = document.getElementById('nomeCorrente').value;
    const bancoCorrente = document.getElementById('bancoCorrente').value;
    const numeroCorrente = document.getElementById('numeroCorrente').value;
    const saldoCorrente = document.getElementById('saldoCorrente').value;
    const contaCorrente = new Corrente(nomeCorrente, bancoCorrente, numeroCorrente, saldoCorrente, 500);

    document.getElementById('resultadoCorrente').innerText = `Conta Corrente:
        Nome: ${contaCorrente.getNomeCorrentista()}
        Banco: ${contaCorrente.getBanco()}
        Número: ${contaCorrente.getNumeroConta()}
        Saldo: ${contaCorrente.getSaldo()}
        Saldo Especial: ${contaCorrente.getSaldoEspecial()}`;

    // Dados da Conta Poupança
    const nomePoupanca = document.getElementById('nomePoupanca').value;
    const bancoPoupanca = document.getElementById('bancoPoupanca').value;
    const numeroPoupanca = document.getElementById('numeroPoupanca').value;
    const saldoPoupanca = document.getElementById('saldoPoupanca').value;
    const contaPoupanca = new Poupanca(nomePoupanca, bancoPoupanca, numeroPoupanca, saldoPoupanca, 2.5, '30/12/2024');

    document.getElementById('resultadoPoupanca').innerText = `Conta Poupança:
        Nome: ${contaPoupanca.getNomeCorrentista()}
        Banco: ${contaPoupanca.getBanco()}
        Número: ${contaPoupanca.getNumeroConta()}
        Saldo: ${contaPoupanca.getSaldo()}
        Juros: ${contaPoupanca.getJuros()}%
        Data de Vencimento: ${contaPoupanca.getDataVencimento()}`;
}
