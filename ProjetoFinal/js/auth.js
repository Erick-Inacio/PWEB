const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");

// Função de login
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                // Redireciona para o app após login bem-sucedido
                window.location.href = "index.html";
            })
            .catch((error) => {
                loginStatus.textContent = `Erro: ${error.message}`;
            });
    });
}

// Verificação de autenticação em index.html
if (window.location.pathname.endsWith("index.html")) {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            // Redireciona para login se o usuário não estiver autenticado
            window.location.href = "login.html";
        }
    });
}
