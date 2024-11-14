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

function closeTaskModal() {
    document.getElementById("task-modal").style.display = "none";
}

function renderTasks() {
    const columns = ["backlog", "desenvolvimento", "concluido"];
    const today = new Date();

    columns.forEach(column => {
        const columnList = document.getElementById(`${column}-list`);
        columnList.innerHTML = "";

        tasks.filter(task => task.status === column).forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task");

            if (task.priority === "Alta") {
                taskElement.classList.add("high-priority");
            } else if (task.priority === "Média") {
                taskElement.classList.add("medium-priority");
            } else if (task.priority === "Baixa") {
                taskElement.classList.add("low-priority");
            }

            if (task.status === "concluido") {
                taskElement.classList.add("task-completed");
            } else {
                const deadlineDate = new Date(task.deadline);
                const timeDiff = deadlineDate - today;
                const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                if (daysDiff < 0) {
                    taskElement.classList.add("task-overdue");
                } else if (daysDiff <= 2) {
                    taskElement.classList.add("task-due-soon");
                }
            }

            taskElement.title = `Vence em: ${task.deadline}`;

            const taskContentContainer = document.createElement("div");
            taskContentContainer.classList.add("task-content-container");

            const taskDetails = document.createElement("div");
            taskDetails.classList.add("task-details");

            const taskTitle = document.createElement("h4");
            taskTitle.classList.add("task-title");
            taskTitle.textContent = task.title;
            taskDetails.appendChild(taskTitle);

            const taskDescription = document.createElement("p");
            taskDescription.classList.add("task-description");
            taskDescription.textContent = task.description;
            taskDetails.appendChild(taskDescription);

            const taskResponsible = document.createElement("p");
            taskResponsible.classList.add("task-responsible");
            taskResponsible.textContent = `Responsável: ${task.responsible}`;
            taskDetails.appendChild(taskResponsible);

            const taskDeadline = document.createElement("p");
            taskDeadline.classList.add("task-deadline");
            taskDeadline.textContent = `Data de Vencimento: ${task.deadline}`;
            taskDetails.appendChild(taskDeadline);

            taskContentContainer.appendChild(taskDetails);

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

            taskElement.draggable = true;
            taskElement.ondragstart = (e) => {
                e.dataTransfer.setData("text/plain", task.id);
            };

            columnList.appendChild(taskElement);
        });
    });

    columns.forEach(column => {
        const columnList = document.getElementById(`${column}-list`);
        columnList.ondragover = (e) => e.preventDefault();
        columnList.ondrop = (e) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData("text/plain");
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.status = column; 
                db.collection("tarefas").doc(taskId).update({ status: column })
                    .then(() => fetchTasksFromFirestore())
                    .catch((error) => console.error("Erro ao mover tarefa: ", error));
            }
        };
    });
}

function searchTasks() {
    const query = document.getElementById("search").value.toLowerCase();
    const filteredTasks = tasks.filter(task => {
        return (
            task.title.toLowerCase().includes(query) ||
            task.priority.toLowerCase().includes(query) ||
            task.responsible.toLowerCase().includes(query) ||
            task.deadline.toLowerCase().includes(query)
        );
    });

    renderFilteredTasks(filteredTasks);
}


function renderFilteredTasks(filteredTasks) {
    const columns = ["backlog", "desenvolvimento", "concluido"];
    columns.forEach(column => {
        const columnList = document.getElementById(`${column}-list`);
        columnList.innerHTML = "";
        filteredTasks.filter(task => task.status === column).forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task");

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
            taskContent.textContent = task.title;
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

            taskElement.draggable = true;
            taskElement.ondragstart = (e) => {
                e.dataTransfer.setData("text/plain", task.id);
            };

            columnList.appendChild(taskElement);
        });
    });
}
