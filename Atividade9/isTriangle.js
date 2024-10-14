function verificarTriangulo() {
    var lado1 = parseFloat(prompt("Insira o primeiro lado"));
    var lado2 = parseFloat(prompt("Insira o segundo lado"));
    var lado3 = parseFloat(prompt("Insira o terceiro lado"));

    if (lado1 + lado2 > lado3 && lado1 + lado3 > lado2 && lado2 + lado3 > lado1) {
        if (lado1 === lado2 && lado2 === lado3) {
            return "Triângulo Equilátero";
        } else if (lado1 === lado2 || lado1 === lado3 || lado2 === lado3) {
            return "Triângulo Isósceles";
        } else {
            return "Triângulo Escaleno";
        }
    } else {
        return "Os valores não formam um triângulo.";
    }
}
