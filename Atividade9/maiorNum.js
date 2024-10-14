function maiorNumero() {
    var n1 = Number(prompt("Digite o primeiro número"));
    var n2 = Number(prompt("Digite o segundo número"));
    var n3 = Number(prompt("Digite o terceiro número"));
    
    if (n1 >= n2 && n1 >= n3) {
        return "O maior número é: " + n1;
    } else if (n2 >= n1 && n2 >= n3) {
        return "O maior número é: " + n2;
    } else {
        return "O maior número é: " + n3;
    }
}