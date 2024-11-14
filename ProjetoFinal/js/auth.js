// auth.js

// Função de login e registro
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const confirmPasswordContainer = document.getElementById("confirm-password-container");
const toggleFormText = document.getElementById("toggle-form");

let isLogin = true; // Indica se o formulário está em modo de login ou registro

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        
        if (!email || !password) {
            loginStatus.textContent = "Por favor, preencha todos os campos.";
            return;
        }

        if (isLogin) {
            // Processo de Login
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    loginStatus.textContent = `Erro: ${error.message}`;
                });
        } else {
            // Processo de Registro
            const confirmPassword = document.getElementById("confirm-password").value;
            if (password !== confirmPassword) {
                loginStatus.textContent = "As senhas não coincidem.";
                return;
            }
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    loginStatus.textContent = `Erro: ${error.message}`;
                });
        }
    });
}

// Função para alternar entre Login e Registro
function toggleForm() {
    isLogin = !isLogin;
    if (isLogin) {
        formTitle.textContent = "Login";
        submitButton.textContent = "Entrar";
        confirmPasswordContainer.style.display = "none";
        toggleFormText.innerHTML = 'Não tem uma conta? <a href="#" onclick="toggleForm()">Crie uma</a>';
    } else {
        formTitle.textContent = "Registrar";
        submitButton.textContent = "Registrar";
        confirmPasswordContainer.style.display = "block";
        toggleFormText.innerHTML = 'Já tem uma conta? <a href="#" onclick="toggleForm()">Faça login</a>';
    }
    loginStatus.textContent = ""; // Limpa mensagens de erro
}

// Função para redefinir senha
function resetPassword() {
    const email = document.getElementById("email").value.trim();
    if (!email) {
        loginStatus.textContent = "Por favor, insira seu email para redefinir a senha.";
        return;
    }
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
        loginStatus.classList.remove("error");
        loginStatus.classList.add("success");
        loginStatus.textContent = "Email de redefinição de senha enviado.";
    })
    .catch((error) => {
        loginStatus.classList.remove("success");
        loginStatus.classList.add("error");
        loginStatus.textContent = `Erro: ${error.message}`;
    });
}

// Verificação de autenticação em index.html
if (window.location.pathname.endsWith("index.html")) {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "login.html";
        }
    });
}

// Função de logout (permanece a mesma)
function logout() {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = "login.html";
        })
        .catch((error) => {
            console.error("Erro ao fazer logout: ", error);
            alert("Erro ao fazer logout. Tente novamente.");
        });
}
