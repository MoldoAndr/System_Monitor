function addTask() {
    var taskName = document.getElementById("taskName").value;
    var taskTime = document.getElementById("taskTime").value;

    if (taskName && taskTime) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "task_manager.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Task added successfully");
                fetchTasks();
            }
        };
        xhr.send("taskName=" + encodeURIComponent(taskName) + "&taskTime=" + encodeURIComponent(taskTime));
    } else {
        alert("Please enter both task name and scheduled time.");
    }
}

function deleteTask(taskNumber) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "task_manager.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Task deleted successfully");
            fetchTasks();
        }
    };
    xhr.send("taskNumber=" + encodeURIComponent(taskNumber));
}


function fetchTasks() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "tasks.txt", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var tasks = xhr.responseText.split("\n");
            var taskList = document.getElementById("taskList");
            taskList.innerHTML = ""; 

            tasks.forEach(function(task, index) {
                if (task.trim() !== "") {
                    var parts = task.split(",");
                    var taskName = parts[0];
                    var taskTime = parts[1];

                    var row = document.createElement("tr");
                    var nameCell = document.createElement("td");
                    var timeCell = document.createElement("td");
                    var deleteCell = document.createElement("td");
                    var deleteButton = document.createElement("button");

                    nameCell.textContent = taskName;
                    timeCell.textContent = taskTime;
                    deleteButton.textContent = "Delete";
                    deleteButton.setAttribute("onclick", "deleteTask(" + (index + 1) + ")");
                    deleteCell.appendChild(deleteButton);

                    row.appendChild(nameCell);
                    row.appendChild(timeCell);
                    row.appendChild(deleteCell);

                    taskList.appendChild(row);
                }
            });
        }
    };
    xhr.send();
}

fetchTasks();

