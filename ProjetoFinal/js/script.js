// Função para abrir o modal de edição ou criação de tarefa
function openTaskModal(taskId = null) {
    const modal = document.getElementById("task-modal");
    const form = document.getElementById("task-form");
    const titleField = document.getElementById("modal-title");
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        document.getElementById("task-id").value = task.id;
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-desc").value = task.description;
        document.getElementById("task-priority").value = task.priority === "high-priority" ? "Alta" : task.priority === "medium-priority" ? "Média" : "Baixa";
        document.getElementById("task-deadline").value = task.deadline;
        document.getElementById("task-responsible").value = task.responsible;
        titleField.innerText = "Editar Tarefa";
    } else {
        form.reset();
        titleField.innerText = "Adicionar Tarefa";
    }
    modal.style.display = "block";
}

// Função para excluir uma tarefa
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
}

// Renderizar tarefas com botões de edição e exclusão no backlog
function renderTasks() {
    const columns = ["backlog", "desenvolvimento", "concluido"];
    columns.forEach(column => {
        const columnList = document.getElementById(`${column}-list`);
        columnList.innerHTML = "";
        tasks.filter(task => task.status === column).forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task", task.priority);

            // Checar se o prazo está próximo
            const deadlineDate = new Date(task.deadline);
            const today = new Date();
            const timeDiff = deadlineDate - today;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            if (column === "concluido") {
                taskElement.classList.add("completed");
            } else if (daysDiff <= 3 && daysDiff >= 0) {
                taskElement.classList.add("near-deadline");
            }

            // Título e prioridade da tarefa
            const taskContent = document.createElement("span");
            taskContent.textContent = `${task.title} - ${task.priority.replace('-', ' ').toUpperCase()}`;
            taskElement.appendChild(taskContent);

            // Botões de edição e exclusão para o backlog
            if (column === "backlog") {
                const editButton = document.createElement("button");
                editButton.textContent = "Editar";
                editButton.onclick = () => openTaskModal(task.id);
                taskElement.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Excluir";
                deleteButton.onclick = () => deleteTask(task.id);
                taskElement.appendChild(deleteButton);
            }

            taskElement.draggable = true;
            taskElement.ondragstart = (e) => e.dataTransfer.setData("text", task.id);
            columnList.appendChild(taskElement);
        });
    });
}
function searchTasks() {
    const query = document.getElementById("search").value.toLowerCase();
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query) ||
        task.responsible.toLowerCase().includes(query) ||
        task.deadline.includes(query)
    );
    renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
    document.querySelectorAll(".task-list").forEach(list => list.innerHTML = "");
    filteredTasks.forEach(task => {
        const columnList = document.getElementById(`${task.status}-list`);
        const taskElement = document.createElement("div");
        taskElement.classList.add("task", task.priority);
        taskElement.textContent = `${task.title} - ${task.priority.replace('-', ' ').toUpperCase()}`;

        if (task.status === "backlog") {
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.onclick = () => openTaskModal(task.id);
            taskElement.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Excluir";
            deleteButton.onclick = () => deleteTask(task.id);
            taskElement.appendChild(deleteButton);
        }

        taskElement.draggable = true;
        taskElement.ondragstart = (e) => e.dataTransfer.setData("text", task.id);
        columnList.appendChild(taskElement);
    });
}
