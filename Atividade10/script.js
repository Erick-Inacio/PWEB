function calcularIMC() {
    let altura = parseFloat(document.getElementById("altura").value);
    let peso = parseFloat(document.getElementById("peso").value);

    if (isNaN(altura) || isNaN(peso) || altura <= 0 || peso <= 0) {
        document.getElementById("resultado").innerHTML = "Por favor, insira valores válidos.";
        return;
    }

    let imc = peso / (altura * altura);
    imc = imc.toFixed(2); 

    let classificacao = "";
    if (imc < 18.5) {
        classificacao = "Magreza (Grau 0)";
    } else if (imc >= 18.5 && imc <= 24.9) {
        classificacao = "Normal (Grau 0)";
    } else if (imc >= 25 && imc <= 29.9) {
        classificacao = "Sobrepeso (Grau I)";
    } else if (imc >= 30 && imc <= 39.9) {
        classificacao = "Obesidade (Grau II)";
    } else {
        classificacao = "Obesidade Grave (Grau III)";
    }

    document.getElementById("resultado").innerHTML = `Seu IMC é ${imc} (${classificacao})`;
}
