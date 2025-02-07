// Wartet darauf, dass das DOM vollständig geladen ist, bevor der Code ausgeführt wird
document.addEventListener('DOMContentLoaded', function () {
    // Holt das Element mit der ID 'theme-switch'
    const themeSwitch = document.getElementById('theme-switch');
    // Holt das aktuelle Thema aus dem lokalen Speicher oder setzt es auf 'light', wenn nichts gespeichert ist
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Wenn das aktuelle Thema 'dark' ist, fügt es die Klasse 'dark-theme' zum Body hinzu und setzt den Schalter auf 'checked'
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeSwitch.checked = true;
    }

    // Fügt einen Event-Listener hinzu, der ausgeführt wird, wenn sich der Zustand des Schalters ändert
    themeSwitch.addEventListener('change', function () {
        // Wenn der Schalter aktiviert ist, fügt es die Klasse 'dark-theme' zum Body hinzu und speichert das Thema als 'dark'
        if (themeSwitch.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            // Wenn der Schalter deaktiviert ist, entfernt es die Klasse 'dark-theme' vom Body und speichert das Thema als 'light'
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
});

/**
 * Fügt eine neue Zeile für den angegebenen Tag hinzu.
 *
 * @param {HTMLElement} row - Das Element, das geklickt wurde, um eine neue Zeile hinzuzufügen.
 */
/**
 * Fügt eine neue Zeile in den entsprechenden Tagescontainer ein.
 * 
 * @param {HTMLElement} row - Die Zeile, die als Referenz für die neue Zeile dient.
 * 
 * Die Funktion extrahiert den Tag aus dem data-day Attribut der übergebenen Zeile.
 * Sie sucht dann den Container, der diesem Tag entspricht.
 * Wenn der Container gefunden wird, erstellt die Funktion eine neue Zeile (div).
 * Die neue Zeile erhält die Klasse 'row'.
 * Die Funktion zählt die vorhandenen Zeilen im Container und erhöht die Anzahl um 1.
 * Die neue Zeile wird mit einem Label und einem Textbereich für Tätigkeiten sowie einem Label und einem Eingabefeld für Stunden gefüllt.
 * Schließlich wird die neue Zeile vor der übergebenen Zeile eingefügt.
 */
function addRow(row) {
    const day = row.dataset.day;
    const container = document.querySelector(`.day-container[data-day="${day}"]`);
    
    if (container) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        
        const rowCount = container.querySelectorAll('.row').length + 1;
        newRow.innerHTML = `
            <label for="${day}_activity_${rowCount}">Tätigkeiten ${day.charAt(0).toUpperCase() + day.slice(1)}:</label>
            <textarea id="${day}_activity_${rowCount}" name="${day}_activity_${rowCount}" rows="5" required></textarea><br>
            
            <label for="stunden_${day}_${rowCount}">Stunden ${day.charAt(0).toUpperCase() + day.slice(1)}:</label>
            <input type="number" id="stunden_${day}_${rowCount}" name="stunden_${day}_${rowCount}" required><br>
        `;
        row.insertAdjacentElement('beforebegin', newRow);
    }
}

/**
 * Generiert ein PDF-Dokument aus den Formulardaten und speichert es mit einem Dateinamen,
 * der auf der aktuellen Kalenderwoche basiert.
 *
 * Diese Funktion sammelt alle Eingabe- und Textbereichsfelder aus dem Formular mit der
 * ID 'ausbildungsnachweis-form', erstellt ein neues jsPDF-Dokument und fügt die
 * Formulardaten dem PDF hinzu. Das PDF wird dann mit einem Dateinamen im Format
 * 'KW<Kalenderwoche>_Ausbildungsnachweis.pdf' gespeichert.
 */
function generatePDF() {
    const form = document.getElementById('ausbildungsnachweis-form');
    const fields = form.querySelectorAll('input, textarea');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    fields.forEach((field, index) => {
        doc.text(`${field.name}: ${field.value}`, 10, 10 + 10 * index);
    });

    const week = new Date().getWeekNumber();
    doc.save(`KW${week}_Ausbildungsnachweis.pdf`);
}

function getWeekNumberFromForm() {
    const weekInput = document.getElementById('woche');
    return weekInput ? parseInt(weekInput.value.split('-W')[1], 10) : new Date().getWeekNumber();
}

Date.prototype.getWeekNumber = function () {
    const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};