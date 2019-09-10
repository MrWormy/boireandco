const DEFAULT_SETTINGS = {
    water: {
        name: 'verres d\'eau',
        picture: 'data:image/jpeg;base64,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',
        dailyObjective: 8,
        currentObjective: 0
    }
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(function (reg) {
            // registration worked
            console.log('SW Registration succeeded. Scope is ' + reg.scope);
        }).catch(function (error) {
        // registration failed
        console.log('SW Registration failed with ' + error);
    });
}

function getSettings() {
    const settings = localStorage.getItem('settings');
    try {
        return JSON.parse(settings);
    } catch (e) {
        console.error(e);
        return null;
    }
}

function setSettings(settings) {
    try {
        localStorage.setItem('settings', JSON.stringify(settings));
    } catch (e) {
        console.error(e);
    }
}

function resetSettings() {
    localStorage.setItem('settings', JSON.stringify(DEFAULT_SETTINGS));
    return JSON.parse(localStorage.getItem('settings'));
}

function loadSetting() {
    const set = localStorage.getItem('settings');
    if (set) {
        try {
            return JSON.parse(set);
        } catch (e) {
            console.log('unknown settings, resetting...');
            return resetSettings();
        }
    } else return resetSettings();

}

function addOneToDaily(element) {
    const set = getSettings();

    if (set.hasOwnProperty(element)) {
        const co = set[element].currentObjective;
        set[element].currentObjective = (co) ? co + 1 : 1;
        setSettings(set);
        loadPage();
    } else {
        console.warn(`trying to update unknown element ${element}`);
    }
}

function svgLine(x1, y1, x2, y2, stroke = 'black', strokeWidth = '14') {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('x2', x2);
    line.setAttribute('y1', y1);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', stroke);
    line.setAttribute('stroke-width', strokeWidth);

    return line;
}

function createAddElement(parent, element, config) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width', '144');
    svg.setAttribute('height', '144');
    svg.appendChild(svgLine(20,72,124,72));
    svg.appendChild(svgLine(72,20,72,124));
    svg.addEventListener('click', addOneToDaily.bind(null, element), false);
    svg.style.backgroundColor = (config.currentObjective >= config.dailyObjective) ? 'green' : 'red';
    parent.appendChild(svg);
}

function loadElementPicture(parent, element) {
    for (let i = 0; i < (element.currentObjective || 0); i++) {
        const eltPicture = new Image();
        eltPicture.src = element.picture;
        parent.appendChild(eltPicture);
    }
}

function loadContent(elements) {
    const content = document.getElementById('content');
    for (let element in elements) {
        const parent = document.createElement('div');
        if (elements.hasOwnProperty(element)) {
            loadElementPicture(parent, elements[element]);
            createAddElement(parent, element, elements[element]);
        }
        content.appendChild(parent);
    }
}

function clearElement (el) {
    let child;
    while ((child = el.firstChild) !== null) {
        el.removeChild(child);
    }
}

function loadPage() {
    clearElement(document.getElementById('content'));
    const els = loadSetting();
    loadContent(els);
}

loadPage();
