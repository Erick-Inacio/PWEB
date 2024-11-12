// Configurar o Firestore
const db = firebase.firestore();
let tasks = [];

// Função para abrir o modal de criação/alteração de tarefa
function openTaskModal(taskId = null) {
    const modal = document.getElementById("task-modal");
    const form = document.getElementById("task-form");
    const titleField = document.getElementById("modal-title");

    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        document.getElementById("task-id").value = task.id;
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-desc").value = task.description;
        document.getElementById("task-priority").value = task.priority;
        document.getElementById("task-deadline").value = task.deadline;
        document.getElementById("task-responsible").value = task.responsible;
        titleField.innerText = "Editar Tarefa";
    } else {
        form.reset();
        document.getElementById("task-id").value = "";
        titleField.innerText = "Adicionar Tarefa";
    }
    modal.style.display = "block";
}

// Função para fechar o modal
function closeTaskModal() {
    document.getElementById("task-modal").style.display = "none";
}

// Função para salvar tarefa no Firestore
// Função para salvar ou editar tarefa no Firestore
document.getElementById("task-form").onsubmit = function (e) {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    if (!user) {
        console.error("Usuário não autenticado.");
        return;
    }

    const taskId = document.getElementById("task-id").value; // Captura o ID da tarefa (se estiver presente)
    const taskData = {
        title: document.getElementById("task-title").value,
        description: document.getElementById("task-desc").value,
        priority: document.getElementById("task-priority").value,
        deadline: document.getElementById("task-deadline").value,
        responsible: document.getElementById("task-responsible").value,
        status: "backlog", // Define o status inicial como backlog, caso seja uma nova tarefa
        userId: user.uid,  // Adiciona o ID do usuário logado
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (taskId) {
        // Atualizar tarefa existente
        db.collection("tarefas").doc(taskId).update(taskData)
            .then(() => {
                console.log("Tarefa atualizada com sucesso!");
                closeTaskModal();
                fetchTasksFromFirestore(); // Atualiza a lista de tarefas
            })
            .catch((error) => {
                console.error("Erro ao atualizar tarefa: ", error);
            });
    } else {
        // Criar nova tarefa
        db.collection("tarefas").add(taskData)
            .then(() => {
                console.log("Tarefa criada com sucesso!");
                closeTaskModal();
                fetchTasksFromFirestore(); // Atualiza a lista de tarefas
            })
            .catch((error) => {
                console.error("Erro ao adicionar tarefa: ", error);
            });
    }
};


// Função para buscar e renderizar tarefas do Firestore
function fetchTasksFromFirestore() {
    const user = firebase.auth().currentUser;
    if (!user) {
        console.error("Usuário não autenticado.");
        return;
    }

    db.collection("tarefas").where("userId", "==", user.uid)
        .orderBy("createdAt")
        .get()
        .then((querySnapshot) => {
            tasks = []; // Limpa as tarefas atuais
            querySnapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });
            renderTasks();
        })
        .catch((error) => {
            console.error("Erro ao buscar tarefas: ", error);
        });
}

// Renderizar tarefas nas colunas com a cor correta e configurar arrastar e soltar
function renderTasks() {
    const columns = ["backlog", "desenvolvimento", "concluido"];
    columns.forEach(column => {
        const columnList = document.getElementById(`${column}-list`);
        columnList.innerHTML = "";
        tasks.filter(task => task.status === column).forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task");

            // Adiciona a classe de prioridade para a cor da tarefa
            if (task.priority === "Alta") {
                taskElement.classList.add("high-priority");
            } else if (task.priority === "Média") {
                taskElement.classList.add("medium-priority");
            } else if (task.priority === "Baixa") {
                taskElement.classList.add("low-priority");
            }

            const taskContentContainer = document.createElement("div");
            taskContentContainer.classList.add("task-content-container");

            const taskContent = document.createElement("span");
            taskContent.textContent = task.title;  // Exibe o título da tarefa
            taskContentContainer.appendChild(taskContent);

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");

            const editButton = document.createElement("button");
            editButton.innerHTML = "✏️";
            editButton.classList.add("edit-btn");
            editButton.onclick = () => openTaskModal(task.id);
            buttonContainer.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "🗑️";
            deleteButton.classList.add("delete-btn");
            deleteButton.onclick = () => confirmDeleteTask(task.id);
            buttonContainer.appendChild(deleteButton);

            taskContentContainer.appendChild(buttonContainer);
            taskElement.appendChild(taskContentContainer);

            // Configura eventos de arrastar e soltar para a tarefa
            taskElement.draggable = true;
            taskElement.ondragstart = (e) => {
                e.dataTransfer.setData("text/plain", task.id);
            };

            columnList.appendChild(taskElement);
        });
    });

    // Configura eventos de arrastar e soltar para cada coluna
    columns.forEach(column => {
        const columnList = document.getElementById(`${column}-list`);
        columnList.ondragover = (e) => e.preventDefault();
        columnList.ondrop = (e) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData("text/plain");
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.status = column; // Atualiza o status da tarefa
                db.collection("tarefas").doc(taskId).update({ status: column })
                    .then(() => fetchTasksFromFirestore())
                    .catch((error) => console.error("Erro ao mover tarefa: ", error));
            }
        };
    });
}

// Função para confirmar a exclusão de uma tarefa
function confirmDeleteTask(taskId) {
    if (confirm("Tem certeza de que deseja excluir esta tarefa?")) {
        db.collection("tarefas").doc(taskId).delete()
            .then(() => fetchTasksFromFirestore())
            .catch((error) => console.error("Erro ao excluir tarefa: ", error));
    }
}

// Carrega as tarefas ao iniciar a aplicação
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        fetchTasksFromFirestore();
    }
});
