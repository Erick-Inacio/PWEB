const db = firebase.firestore();
let tasks = [];

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

    query.get()
        .then((querySnapshot) => {
            tasks = [];
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    tasks.push({ id: doc.id, ...doc.data() });
                });
                renderTasks();
            }
            document.getElementById("loading").style.display = "none";
        })
        .catch((error) => {
            console.error("Erro ao buscar tarefas: ", error);
            document.getElementById("loading").style.display = "none";
            alert("Ocorreu um erro ao carregar as tarefas.");
        });
}

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
        taskData = {
            title,
            description,
            priority,
            deadline,
            responsible
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
            undoTask = task;
            alert("Tarefa excluída. Você pode desfazer esta ação nos próximos 5 segundos.");
            fetchTasksFromFirestore();
            setTimeout(() => {
                undoTask = null; 
            }, 5000);
        })
        .catch((error) => console.error("Erro ao excluir tarefa: ", error));
}



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

    const taskRef = db.collection("tarefas").doc(taskId);

    taskRef.get()
        .then((doc) => {
            if (doc.exists) {
                const taskData = doc.data();

                taskRef.delete()
                    .then(() => {
                        console.log("Tarefa excluída com sucesso!");

                        tasks = tasks.filter(task => task.id !== taskId);
                        renderTasks(); 

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
        db.collection("tarefas").doc(taskId).set(taskData)
            .then(() => {
                console.log("Tarefa restaurada com sucesso!");

                const restoredTask = { id: taskId, ...taskData };
                tasks.push(restoredTask);
                renderTasks();

                notification.remove();
            })
            .catch((error) => {
                console.error("Erro ao restaurar a tarefa: ", error);
                alert("Ocorreu um erro ao restaurar a tarefa.");
            });
    };

    notification.appendChild(undoButton);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}
