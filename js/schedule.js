const csvURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtuUFRGjhjMklMtNqMCefNjJvwvzAw-nkI54Cq_YO3I3_zEY7xsSp5mGoW-Wvn4jelIZmT0ZG-bFEe/pub?output=csv';

async function fetchSchedule() {
    try {
        const response = await fetch(csvURL);
        const text = await response.text();
        
        // 1. SMART CSV PARSING 
        // This splits by rows while respecting line breaks inside "quoted cells"
        const rows = [];
        let p = '', c = '', r = [];
        let q = false; // "In quotes" flag

        for (let i = 0; i < text.length; i++) {
            c = text[i];
            if (c === '"') {
                q = !q; // Toggle quotes
            } else if (c === ',' && !q) {
                r.push(p.trim());
                p = '';
            } else if (c === '\n' && !q) {
                r.push(p.trim());
                rows.push(r);
                r = [];
                p = '';
            } else {
                p += c;
            }
        }
        if (p || r.length > 0) {
            r.push(p.trim());
            rows.push(r);
        }

        const tableHeader = document.getElementById('schedule-header');
        const tableBody = document.getElementById('schedule-body');
        
        tableHeader.innerHTML = ''; 
        tableBody.innerHTML = '';

        if (rows.length === 0) return;

        // 2. GENERATE DYNAMIC HEADERS (The Days)
        const headerRow = document.createElement('tr');
        const dayHeaders = rows[0]; 
        dayHeaders.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });
        tableHeader.appendChild(headerRow);

        // 3. GENERATE THE GRID (The Classes)
        for (let i = 1; i < rows.length; i++) {
            const rowData = rows[i];
            // Skip if the row is effectively empty
            if (!rowData.join('').trim()) continue;

            const tr = document.createElement('tr');
            
            // Loop through based on the number of headers
            for (let j = 0; j < dayHeaders.length; j++) {
                const td = document.createElement('td');
                const cellText = rowData[j] || ""; 
                
                // Convert Alt+Enter from Sheets into actual HTML breaks
                td.innerHTML = `<p>${cellText.replace(/\n/g, '<br>')}</p>`;

                const content = cellText.toLowerCase();

                // 4. STYLE ASSIGNMENT
                if (content === "") {
                    td.className = 'empty-cell';
                } else if (content.includes('adult basics')) {
                    td.className = 'basics-class';
                } else if (content.includes('adult')) {
                    td.className = 'adult-class';
                } else if (content.includes('family')) {
                    td.className = 'family-class';
                } else if (content.includes('prep')) {
                    td.className = 'prep-class';
                } else if (content.includes('private')) {
                    td.className = 'private-class';
                } else {
                    // Fallback for anything else (e.g. "Closed", "Testing")
                    td.className = 'default-class';
                }

                tr.appendChild(td);
            }
            tableBody.appendChild(tr);
        }
    } catch (error) {
        console.error('Error fetching schedule:', error);
        document.getElementById('schedule-body').innerHTML = 
            '<tr><td colspan="5" style="text-align:center;">Could not load schedule at this time.</td></tr>';
    }
}

// Run the function when the page loads
fetchSchedule();