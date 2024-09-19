var nome = prompt("Qual é o seu nome?");
var nota1 = prompt("Qual foi a sua primeira nota?");
var nota2 = prompt("Qual foi a sua segunda nota?");
var nota3 = prompt("Qual foi a sua terceira nota?");
var nota4 = prompt("Qual foi a sua quarta nota?");
var media = (parseFloat(nota1) + parseFloat(nota2) + parseFloat(nota3) + parseFloat(nota4)) / 4;
alert("Ola " + nome + " sua media foi: " + media);
