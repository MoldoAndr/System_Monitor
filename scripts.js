async function fetchData(url, tableId) {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.text();
        if (tableId === 'procTable') {
            updateProcessTable(tableId, data);
        } else {
            updateTable(tableId, data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById(tableId).querySelector('tbody').innerHTML = '<tr><td colspan="6">Failed to load data</td></tr>';
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
        let memory = columns[3];
        let processName = columns.slice(4).join(' ').split(' ')[0];
        let htmlRow = `<tr><td>${pid}</td><td>${ppid}</td><td>${cpu}</td><td>${memory}</td><td>${processName}</td></tr>`;
        
        table.innerHTML += htmlRow;
    });
}


function updateTable(tableId, data) {
    let table = document.getElementById(tableId).querySelector('tbody');
    table.innerHTML = '';
    let rows = data.trim().split('\n');
    
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


async function fetchAllData() {
    await fetchData('cpu', 'cpuTable');
    await fetchData('mem', 'memTable');
    await fetchData('proc', 'procTable');
    await fetchData('partition', 'partitionTable');
    await fetchData('model','systemModel');
    await fetchTemperatureData();
}

setInterval(fetchAllData, 200);

fetchAllData();

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


async function writeToLogFile(pid) {
    try {
        let response = await fetch(`write_to_log.php?pid=${pid}`);
        if (!response.ok) {
            throw new Error('Failed to write to log file');
        }
        console.log(`Successfully wrote PID ${pid} to log file.`);
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

async function fetchTemperatureData() {
    try {
        let response = await fetch('temp'); 
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.text(); 
        updateTemperatureTable('tempTable', data);
    } catch (error) {
        console.error('Error fetching temperature data:', error);
        document.getElementById('tempTable').querySelector('tbody').innerHTML = '<tr><td colspan="2">Failed to load temperature data</td></tr>';
    }
}

function updateTemperatureTable(tableId, data) {
    let table = document.getElementById(tableId).querySelector('tbody');
    table.innerHTML = '';
    let rows = data.trim().split('\n');

    rows.forEach(row => {
        let columns = row.trim().split(/\s+/); 
        let htmlRow = '<tr>';

        columns.forEach(column => {
            htmlRow += `<td>${column}</td>`;
        });

        htmlRow += '</tr>';
        table.innerHTML += htmlRow;
    });
}

setInterval(fetchTemperatureData, 200);
fetchTemperatureData();

