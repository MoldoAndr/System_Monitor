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
        } else {
            updateTable(tableId, data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById(tableId).querySelector('tbody').innerHTML = '<tr><td colspan="6">Failed to load data</td></tr>';
    }
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
        fetchAllData(); // Refresh all data after running command
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
