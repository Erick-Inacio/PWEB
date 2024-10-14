function iniciarPesquisa() {
    let generos = [];
    let idades = [];
    let avaliacoes = [];
    let totalPessimo = 0;
    let totalOtimoBom = 0;
    let totalMasc = 0;
    let totalFem = 0;
    let somaNotas = 0;
    let somaIdades = 0;

    while (true) {
        let genero = prompt("Informe o gênero (M ou F, ou deixe em branco para sair): ").toUpperCase();
        if (genero === "") break;

        let idade = parseInt(prompt("Informe a idade: "));
        let avaliacao = prompt("Informe a avaliação (Ótimo, Bom, Regular ou Péssimo): ").toUpperCase();

        if (isNaN(idade) || !["ÓTIMO", "OTIMO", "BOM", "REGULAR", "PÉSSIMO", "PESSIMO"].includes(avaliacao)) {
            alert("Dados inválidos, por favor, tente novamente.");
            continue;
        }

        idades.push(idade);

        let nota = avaliacao === "ÓTIMO" || avaliacao === "OTIMO" ? 5 :
                   avaliacao === "BOM" ? 4 :
                   avaliacao === "REGULAR" ? 3 : 1;

        if (nota === 1) totalPessimo++;
        if (nota >= 4) totalOtimoBom++;

        somaNotas += nota;
        somaIdades += idade;
        generos.push(genero);
        avaliacoes.push(nota);

        if (genero === "M") totalMasc++;
        if (genero === "F") totalFem++;
    }

    const percentualPessimo = ((totalPessimo / avaliacoes.length) * 100).toFixed(2);
    const percentualOtimoBom = ((totalOtimoBom / avaliacoes.length) * 100).toFixed(2);
    const maiorIdade = Math.max(...idades);
    const menorIdade = Math.min(...idades);
    const mediaNotas = (somaNotas / avaliacoes.length).toFixed(2);
    const mediaIdades = (somaIdades / idades.length).toFixed(2);

    document.getElementById('mensagem').textContent = `Média da avaliação: ${mediaNotas} \nMédia de idades: ${mediaIdades}`;
    document.getElementById('qtdPessimo').textContent = `Total de avaliações Péssimas: ${totalPessimo}`;
    document.getElementById('prcntPessimo').textContent = `Porcentagem de Péssimos: ${percentualPessimo}%`;
    document.getElementById('qtdOtimoBom').textContent = `Total de avaliações Ótimas e Boas: ${totalOtimoBom}`;
    document.getElementById('prcntOtimoBom').textContent = `Porcentagem de Ótimos e Bons: ${percentualOtimoBom}%`;
    document.getElementById('maisVelho').textContent = `Pessoa mais velha: ${maiorIdade} anos`;
    document.getElementById('maisNovo').textContent = `Pessoa mais jovem: ${menorIdade} anos`;
    document.getElementById('qtdMasc').textContent = `Total de homens: ${totalMasc}`;
    document.getElementById('qtdFem').textContent = `Total de mulheres: ${totalFem}`;
}