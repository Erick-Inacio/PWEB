function checarPalindromo() {
    var palavraOriginal = prompt("Informe uma palavra:");
    var palavraInvertida = [...palavraOriginal].reverse().join("");
    
    if (palavraOriginal === palavraInvertida) {
        return "É um palíndromo";
    } else {
        return "Não é um palíndromo";
    }
}
