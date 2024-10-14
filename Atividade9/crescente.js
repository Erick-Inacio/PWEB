function ordenarNumeros() {
    var a = parseInt(prompt("Informe o primeiro número"));
    var b = parseInt(prompt("Informe o segundo número"));
    var c = parseInt(prompt("Informe o terceiro número"));

    var listaNumeros = [a, b, c];
    
    listaNumeros.sort((x, y) => x - y);
    
    return "Números em ordem crescente: " + listaNumeros.join(", ");
}
