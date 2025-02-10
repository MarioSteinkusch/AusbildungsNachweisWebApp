document.addEventListener('DOMContentLoaded', function () {
    const themeSwitch = document.getElementById('theme-switch');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', function () {
        if (themeSwitch.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    const downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', downloadPDF);

    const correctionButton = document.getElementById('correction-button');
    correctionButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // Lade die PDF-Vorschau
    loadPDFPreview();
});

function loadPDFPreview() {
    const formData = JSON.parse(sessionStorage.getItem('formData'));
    if (formData) {
        const pdfContainer = document.getElementById('pdf-preview');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Füge die Formulardaten dem PDF hinzu
        let y = 10;
        for (const [key, value] of Object.entries(formData)) {
            doc.text(`${key}: ${value}`, 10, y);
            y += 10;
        }

        // Zeige die PDF-Vorschau an
        const pdfDataUri = doc.output('datauristring');
        pdfContainer.innerHTML = `<iframe src="${pdfDataUri}" style="width: 100%; height: 500px;"></iframe>`;
    }
}

function downloadPDF() {
    const formData = JSON.parse(sessionStorage.getItem('formData'));
    if (formData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Füge die Formulardaten dem PDF hinzu
        let y = 10;
        for (const [key, value] of Object.entries(formData)) {
            doc.text(`${key}: ${value}`, 10, y);
            y += 10;
        }

        // Extrahiere Jahr und Kalenderwoche aus dem Formular
        const weekInput = formData['week'];
        console.log('Week input:', weekInput); // Debugging line
        const weekRegex = /^\d{4}-W\d{2}$/;
        if (weekInput && weekRegex.test(weekInput)) {
            const [year, week] = weekInput.split('-W');
            doc.save(`${year}_KW${week}_Ausbildungsnachweis.pdf`);
        } else {
            alert('Invalid week format in form data. Expected format: YYYY-Www');
        }
    }
}