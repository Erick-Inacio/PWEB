let num1 = parseInt(prompt("digite o primeiro numero"));
let num2 = parseInt(prompt("digite o segundo numero"));

function soma() {
    return num1 + num2;
}
function subtracao() {
    return num1 - num2;
}
function multiplicacao() {
    return num1 * num2;
}

function divisao() {
    return num1 / num2;
}

function restoDiv(){
    return num1 % num2;
}

alert(`soma: ` + soma());
alert(`subtracao: ` + subtracao());
alert(`multiplicacao: ` + multiplicacao());
alert(`divisao: ` + divisao());
alert(`restoDiv: ` + restoDiv());