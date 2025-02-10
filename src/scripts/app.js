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

    const previewButton = document.getElementById('preview-button');
    previewButton.addEventListener('click', previewPDF);

    // Lade die gespeicherten Formulardaten
    loadFormData();
});

async function previewPDF() {
    const form = document.getElementById('ausbildungsnachweis-form');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    sessionStorage.setItem('formData', JSON.stringify(data));
    window.location.href = 'preview.html';
}

function loadFormData() {
    const formData = JSON.parse(sessionStorage.getItem('formData'));
    if (formData) {
        const form = document.getElementById('ausbildungsnachweis-form');
        for (const [key, value] of Object.entries(formData)) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value;
            }
        }
    }
}