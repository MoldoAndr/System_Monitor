async function fetchData(url, tableId) {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.text(); // Fetching as plain text
        updateTable(tableId, data);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById(tableId).querySelector('tbody').innerHTML = '<tr><td colspan="6">Failed to load data</td></tr>';
    }
}

function updateTable(tableId, data) {
    let table = document.getElementById(tableId).querySelector('tbody');
    table.innerHTML = '';
    let rows = data.trim().split('\n');
    
    rows.forEach(row => {
        let columns = row.trim().split(/\s+/); // Split by one or more spaces
        let htmlRow = '<tr>';

        columns.forEach((column, index) => {
            htmlRow += <td>${column}</td>;

            // Add action button only for the last column (index == columns.length - 1)
            if (index === columns.length - 1) {
                if (tableId === 'procTable') {
                    htmlRow += <td><button class="button-kill" onclick="killProcess(${columns[0]})">Kill</button></td>;
                }
            }
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
}

setInterval(fetchAllData, 1000);

fetchAllData();

async function runCommand() {
    let command = document.getElementById('commandInput').value;
    try {
        let response = await fetch(run_command.php?command=${encodeURIComponent(command)});
        if (!response.ok) {
            throw new Error('Failed to execute command');
        }
        let output = await response.text();
        document.getElementById('commandInput').value = '';
        if (output.startsWith('Error:')) {
            alert(output); // Show error message in an alert box
        } else {
            displayCommandOutput(output); // Display the command output
        }
        fetchAllData(); // Refresh other data if needed
    } catch (error) {
        console.error('Error running command:', error);
    }
}

async function displayCommandOutput(output) {
    try {
        const tableBody = document.querySelector('#outputTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        const htmlRow = <tr><td>${output}</td></tr>;
        tableBody.innerHTML = htmlRow;
    } catch (error) {
        console.error('Error displaying command output:', error);
    }
}

async function killProcess(pid) {
    try {
        let response = await fetch(kill_process.php?pid=${pid});
        if (!response.ok) {
            throw new Error('Failed to kill process');
        }
        await writeToLogFile(pid); // Write PID to log file after killing process
        fetchAllData(); // Refresh data after killing process
    } catch (error) {
        console.error('Error killing process:', error);
    }
}

async function writeToLogFile(pid) {
    try {
        let response = await fetch(write_to_log.php?pid=${pid});
        if (!response.ok) {
            throw new Error('Failed to write to log file');
        }
        console.log(Successfully wrote PID ${pid} to log file.);
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}