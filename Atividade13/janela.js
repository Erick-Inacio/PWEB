// Seleciona os elementos HTML
const imgJanela = document.getElementById("janela");
const titulo = document.getElementById("titulo");

// Função para alterar o texto do título
function alterarTitulo(texto) {
    titulo.innerText = texto;
}

// Define o comportamento quando o mouse está sobre a imagem
imgJanela.addEventListener("mouseover", () => {
    imgJanela.src = "janela-aberta.png"; // Muda para imagem da janela aberta
    alterarTitulo("Janela Aberta");
});

// Define o comportamento quando o mouse sai da imagem
imgJanela.addEventListener("mouseout", () => {
    imgJanela.src = "janela-fechada.png"; // Muda de volta para imagem da janela fechada
    alterarTitulo("Janela Fechada");
});

// Define o comportamento quando a imagem é clicada
imgJanela.addEventListener("click", () => {
    imgJanela.src = "janela-quebrada.png"; // Muda para imagem da janela quebrada
    alterarTitulo("Janela Quebrada");
});
