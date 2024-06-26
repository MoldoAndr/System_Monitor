function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

async function fetchData(url, tableId) {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.text();
        if (tableId === 'procTable') {
            updateProcessTable(tableId, data);
        } else if (tableId === 'usbTable2') {
            updateUSBTable(tableId, data);
        }
        else
            updateTable(tableId, data);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById(tableId).querySelector('tbody').innerHTML = '<tr><td colspan="6">Failed to load data</td></tr>';
    }
}

function updateUSBTable(tableId, data) {
    let table = document.getElementById(tableId).querySelector('tbody');
    table.innerHTML = '';
    let rows = data.trim().split('\n');

    rows.forEach(row => {
        let columns;

        if (tableId === 'usbTable2') {
            columns = row.trim().split(/\$/);
        } else {
            columns = row.trim().split(/\s+/);
        }

        let htmlRow = '<tr>';

        columns.forEach(column => {
            htmlRow += `<td>${column.trim()}</td>`;
        });

        htmlRow += '</tr>';
        table.innerHTML += htmlRow;
    });
}


async function fetchAllData() {
    try {
        await fetchData('cpu', 'cpuTable');
        await fetchData('cpu_usage', 'usageTable');
        await fetchData('cpu_usage_total', 'totalUsage')
        await fetchData('mem', 'memTable');
        await fetchData('procs.txt', 'procTable');
        await fetchData('partition', 'partitionTable');
        await fetchData('model', 'systemModel');
        await fetchData('temp', 'tempTable');
        await fetchData('usb_events.txt', 'usbTable');
        await fetchData('network_usage', 'networkTable');
        await fetchData('ports', 'portsTable');
        await fetchData('battery_info', 'batteryTable');
        await fetchData('brightness', 'brightnessTable');
        await fetchData('usb', 'usbTable2');
        await fetchTasks();
    } catch (error) {
        console.error('Error fetching all data:', error);
    }
}

setInterval(fetchAllData, 200);

async function fetchTemperatureData() {
    try {
        let response = await fetch('temp');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.text();
        console.log(data);
        updateTemperatureTable('tempTable', data);
    } catch (error) {
        console.error('Error fetching temperature data:', error);
        document.getElementById('tempTable').querySelector('tbody').innerHTML = '<tr><td colspan="2">Failed to load temperature data</td></tr>';
    }
}

function updateProcessTable(tableId, data) {
    let table = document.getElementById(tableId).querySelector('tbody');
    table.innerHTML = '';
    let rows = data.trim().split('\n');

    rows.forEach(row => {
        let columns = row.trim().split(/\s+/);
        let pid = columns[0];
        let ppid = columns[1];
        let cpu = columns[2];
        let mem = columns[3];
        let processName = columns.slice(4).join(' ').split(' ')[0];
        let htmlRow = `<tr><td>${pid}</td><td>${ppid}</td><td>${cpu}</td><td>${mem}</td></tr>`;

        table.innerHTML += htmlRow;
    });
}

function updateTable(tableId, data) {
    let table = document.getElementById(tableId).querySelector('tbody');
    table.innerHTML = '';
    let rows = data.trim().split('\n');
    if (tableId === 'usbTable') {
        rows.forEach(row => {
            let columns = row.trim().split(/_/);
            let htmlRow = '<tr>';

            columns.forEach((column, index) => {
                htmlRow += `<td>${column}</td>`;
            });

            htmlRow += '</tr>';
            table.innerHTML += htmlRow;
        });
    }
    else {
        rows.forEach(row => {
            let columns = row.trim().split(/\s+/);
            let htmlRow = '<tr>';

            columns.forEach((column, index) => {
                htmlRow += `<td>${column}</td>`;
            });

            htmlRow += '</tr>';
            table.innerHTML += htmlRow;
        });
    }
}

function updateNetworkTable(tableId, data) {
    let table = document.getElementById(tableId).querySelector('tbody');
    table.innerHTML = '';
    let lines = data.trim().split('\n');
    let receiveLine = lines[0].trim();
    let uploadLine = lines[1].trim();
    let htmlRows = `
        <tr>
            <td>${receiveLine}</td>
        </tr>
        <tr>
            <td>${uploadLine}</td>
        </tr>
    `;

    table.innerHTML = htmlRows;
}

async function runCommand() {
    let command = document.getElementById('commandInput').value;
    try {
        let response = await fetch(`run_command.php?command=${encodeURIComponent(command)}`);
        if (!response.ok) {
            throw new Error('Failed to execute command');
        }
        let output = await response.text();
        document.getElementById('commandInput').value = '';
        if (output.startsWith('Error:')) {
            alert(output);
        } else {
            displayCommandOutput(output);
        }
        fetchAllData();
    } catch (error) {
        console.error('Error running command:', error);
    }
}

async function displayCommandOutput(output) {
    try {
        const tableBody = document.querySelector('#outputTable tbody');
        tableBody.innerHTML = '';
        const htmlRow = `<tr><td>${output}</td></tr>`;
        tableBody.innerHTML = htmlRow;
    } catch (error) {
        console.error('Error displaying command output:', error);
    }
}

fetchAllData();

document.querySelectorAll(".neon-button").forEach((button) => {
    button.addEventListener("click", function (e) {
        const numDrops = 10;
        const rect = button.getBoundingClientRect();

        for (let i = 0; i < numDrops; i++) {
            const drop = document.createElement("span");
            drop.classList.add("drop");

            const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 60;
            const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 60;

            drop.style.left = `${x}px`;
            drop.style.top = `${y}px`;

            document.body.appendChild(drop);

            setTimeout(() => {
                drop.remove();
            }, 5000);
        }
    });
});

function sendBrightnessRequest(direction) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "brightness.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            } else {
                console.error('Error:', xhr.statusText);
            }
        }
    };
    xhr.send("direction=" + direction);
}

function increaseBrightness() {
    sendBrightnessRequest("up");
}

function decreaseBrightness() {
    sendBrightnessRequest("down");
}

function addTask() {
    var taskName = document.getElementById("taskName").value;
    var taskTime = document.getElementById("taskTime").value;

    if (taskName && taskTime) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "task_manager.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
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

function fetchTasks() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "getCrontabTasks.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var tasks = xhr.responseText.split("\n");
            var taskList = document.getElementById("taskList");
            taskList.innerHTML = "";

            tasks.forEach(function (task) {
                if (task.trim() !== "") {
                    var parts = task.trim().split(/\s+/);
                    var scheduleParts = parts.slice(0, 5);
                    var command = parts.slice(5).join(" ");

                    var row = document.createElement("tr");
                    scheduleParts.forEach(function (part) {
                        var cell = document.createElement("td");
                        cell.textContent = part;
                        row.appendChild(cell);
                    });
                    var commandCell = document.createElement("td");
                    commandCell.textContent = command;
                    row.appendChild(commandCell);

                    taskList.appendChild(row);
                }
            });
        }
    };
    xhr.send();
}



fetchTasks();

function showSection(sectionId) {
    const buttons = document.querySelectorAll('.neon-button');
    const sections = document.querySelectorAll('.content-section');
    const section = document.getElementById(sectionId);
    const button = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
    if (section.classList.contains('active')) {
        section.classList.remove('active');
        button.classList.remove('active');
    } else {
        buttons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));
        section.classList.add('active');
        button.classList.add('active');
    }
}

function deleteTaskById() {
    var taskId = document.getElementById("taskIdInput").value;
    if (taskId) {
        deleteTask(taskId);
    } else {
        alert("Please enter a valid task ID.");
    }
}

function deleteTask(taskId) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "deleteCrontabTask.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            fetchTasks();
        }
    };
    xhr.send("taskId=" + encodeURIComponent(taskId));
}
