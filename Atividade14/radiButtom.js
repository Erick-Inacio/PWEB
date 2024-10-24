function transformarTexto() {
    const textoInput = document.getElementById("texto");
    const maiusculas = document.getElementById("maiusculas").checked;
    const minusculas = document.getElementById("minusculas").checked;

    if (maiusculas) {
        textoInput.value = textoInput.value.toUpperCase();
    } else if (minusculas) {
        textoInput.value = textoInput.value.toLowerCase();
    }
}
