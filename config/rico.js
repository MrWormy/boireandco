// file could be module, export last 3
const verrePlein = document.createElement('img');
const verreVide = document.createElement('img');

// only from app.js ...
verrePlein.src = 'config/verreplein.png';
verreVide.src = 'config/verrevide.png';

const defaultSettings = {
    objectif: 4
};

function getKeyFromDS(ds) {
    let key = `rico-${ds}`;
    if (!ds) {
        key = `rico-${new Date().toLocaleDateString()}`;
    }

    return key;
}

function validateSettings(settings) {
    if(!settings || !(settings instanceof Object)) throw new Error('invalid settings format, must be Object');
    if(!settings.hasOwnProperty('objectif')) throw new Error('missing setting propery : objectif');
    if(!settings.hasOwnProperty('objdate')) throw new Error('missing setting propery : objdate');
    if(!settings.hasOwnProperty('glasses')) throw new Error('missing setting propery : glasses');
    if(settings.objectif !== Number(settings.objectif)) throw new Error('invalid format : objectif');
    if(settings.objdate !== String(settings.objdate)) throw new Error('invalid format : objdate');
    if(!(settings.glasses instanceof Set)) throw new Error('invalid format : glasses');

    return true;
}

function parseSettings(str) {
    let settings = JSON.parse(str);
    settings.glasses = new Set(settings.glasses);

    return settings;
}

function stringifySettings(settings) {
    validateSettings(settings);
    let str = Object.assign({}, settings);
    str.glasses = Array.from(str.glasses);

    return JSON.stringify(str);
}

function getSettings(dateString) {
    const settings = localStorage.getItem(getKeyFromDS(dateString));
    if (settings) {
        try {
            return parseSettings(settings);
        } catch (e) {
            console.log(e);
        }
    }

    return null;
}

function setSettings(settings, dateString) {
    try {
        localStorage.setItem(getKeyFromDS(dateString), stringifySettings(settings));
    } catch (e) {
        console.error(e);
    }

    return false;
}

// Init new default settings
function createSettings(dateString) {
    let ds = dateString ? dateString : new Date().toLocaleDateString();
    const newSettings = Object.assign({objdate: ds, glasses: new Set()}, defaultSettings);
    try {
        localStorage.setItem(getKeyFromDS(ds), stringifySettings(newSettings));
    } catch (e) {
        console.error(e);
    }

    return getSettings(ds);
}

