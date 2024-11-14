// tasks.js

// Configurar o Firestore
const db = firebase.firestore();
let tasks = [];

// Variáveis para paginação (opcional)
// let lastVisible = null;
// const taskLimit = 10; // Número de tarefas por página

/**
 * Busca tarefas do Firestore e atualiza a interface.
 */
function fetchTasksFromFirestore() {
    const user = firebase.auth().currentUser;
    if (!user) {
        console.error("Usuário não autenticado.");
        return;
    }

    document.getElementById("loading").style.display = "block";

    let query = db.collection("tarefas")
        .where("userId", "==", user.uid)
        .orderBy("createdAt");
    // .limit(taskLimit); // Descomente se implementar paginação

    // if (lastVisible) {
    //     query = query.startAfter(lastVisible);
    // }

    query.get()
        .then((querySnapshot) => {
            tasks = [];
            if (!querySnapshot.empty) {
                // lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]; // Para paginação
                querySnapshot.forEach((doc) => {
                    tasks.push({ id: doc.id, ...doc.data() });
                });
                renderTasks();
            } else {
                // Sem mais tarefas para carregar
                // document.getElementById("load-more").style.display = "none";
            }
            document.getElementById("loading").style.display = "none";
        })
        .catch((error) => {
            console.error("Erro ao buscar tarefas: ", error);
            document.getElementById("loading").style.display = "none";
            alert("Ocorreu um erro ao carregar as tarefas.");
        });
}

// Função para salvar ou editar tarefa no Firestore
document.getElementById("task-form").onsubmit = function (e) {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    if (!user) {
        console.error("Usuário não autenticado.");
        return;
    }

    const taskId = document.getElementById("task-id").value;
    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-desc").value.trim();
    const priority = document.getElementById("task-priority").value;
    const deadline = document.getElementById("task-deadline").value;
    const responsible = document.getElementById("task-responsible").value.trim();

    if (!title || !description || !deadline || !responsible) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    let taskData;

    if (taskId) {
        // Atualizar tarefa existente
        taskData = {
            title,
            description,
            priority,
            deadline,
            responsible
            // Não incluímos 'status' nem 'userId' ou 'createdAt' aqui
        };

        db.collection("tarefas").doc(taskId).update(taskData)
            .then(() => {
                console.log("Tarefa atualizada com sucesso!");
                closeTaskModal();
                fetchTasksFromFirestore();
            })
            .catch((error) => {
                console.error("Erro ao atualizar tarefa: ", error);
                alert("Ocorreu um erro ao atualizar a tarefa.");
            });
    } else {
        // Criar nova tarefa
        taskData = {
            title,
            description,
            priority,
            deadline,
            responsible,
            status: "backlog",
            userId: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection("tarefas").add(taskData)
            .then(() => {
                console.log("Tarefa criada com sucesso!");
                closeTaskModal();
                fetchTasksFromFirestore();
            })
            .catch((error) => {
                console.error("Erro ao adicionar tarefa: ", error);
                alert("Ocorreu um erro ao adicionar a tarefa. Tente novamente.");
            });
    }
};


// Função para excluir tarefa
let undoTask = null;

function confirmDeleteTask(taskId) {
    if (confirm("Tem certeza de que deseja excluir esta tarefa?")) {
        deleteTaskWithUndo(taskId);
    }
}

function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    db.collection("tarefas").doc(taskId).delete()
        .then(() => {
            // Armazena a tarefa excluída temporariamente
            undoTask = task;
            alert("Tarefa excluída. Você pode desfazer esta ação nos próximos 5 segundos.");
            fetchTasksFromFirestore();
            setTimeout(() => {
                undoTask = null; // Limpa a tarefa após 5 segundos
            }, 5000);
        })
        .catch((error) => console.error("Erro ao excluir tarefa: ", error));
}



// Carrega as tarefas ao iniciar a aplicação
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        fetchTasksFromFirestore();
    }
});

function deleteTaskWithUndo(taskId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        console.error("Usuário não autenticado.");
        return;
    }

    // Obter uma referência ao documento da tarefa
    const taskRef = db.collection("tarefas").doc(taskId);

    // Obter os dados da tarefa antes de excluí-la
    taskRef.get()
        .then((doc) => {
            if (doc.exists) {
                const taskData = doc.data();

                // Excluir a tarefa
                taskRef.delete()
                    .then(() => {
                        console.log("Tarefa excluída com sucesso!");

                        // Remover a tarefa da lista local
                        tasks = tasks.filter(task => task.id !== taskId);
                        renderTasks(); // Atualiza a interface

                        // Mostrar notificação com opção de desfazer
                        showUndoNotification(taskId, taskData);
                    })
                    .catch((error) => {
                        console.error("Erro ao excluir tarefa: ", error);
                        alert("Ocorreu um erro ao excluir a tarefa.");
                    });
            } else {
                console.error("A tarefa não existe.");
            }
        })
        .catch((error) => {
            console.error("Erro ao obter os dados da tarefa: ", error);
        });
}

function showUndoNotification(taskId, taskData) {
    const notification = document.createElement("div");
    notification.classList.add("undo-notification");
    notification.textContent = "Tarefa excluída.";

    const undoButton = document.createElement("button");
    undoButton.textContent = "Desfazer";
    undoButton.onclick = () => {
        // Restaurar a tarefa excluída no Firestore
        db.collection("tarefas").doc(taskId).set(taskData)
            .then(() => {
                console.log("Tarefa restaurada com sucesso!");

                // Adicionar a tarefa de volta à lista local
                const restoredTask = { id: taskId, ...taskData };
                tasks.push(restoredTask);
                renderTasks(); // Atualiza a interface

                notification.remove();
            })
            .catch((error) => {
                console.error("Erro ao restaurar a tarefa: ", error);
                alert("Ocorreu um erro ao restaurar a tarefa.");
            });
    };

    notification.appendChild(undoButton);
    document.body.appendChild(notification);

    // Remover a notificação após 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}
