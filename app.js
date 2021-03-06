const glasses = document.querySelector('.glasses');
const objval = document.getElementById('objectif');
const objsuccess = document.querySelector('.obj-success');
const objdate = document.getElementById('objdate');
const settoday = document.getElementById('settoday');

function getLocaleDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();

    return `${year}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`;
}

function getLocaleTimeString(ts) {
    const d = new Date(ts || Date.now());
    const h = d.getHours();
    const m = d.getMinutes();

    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}`;
}

function registerNewGlass() {
    // cannot modify past records
    const now = Date.now();
    if (objdate.value === getLocaleDateString()) {
        const sets = getSettings(); // today
        sets.glasses.add(now);
        setSettings(sets);
        displayObj();
    }
}

function unRegisterGlass(e) {
    // cannot modify past records
    if (objdate.value === getLocaleDateString()) {
        const sets = getSettings(); // today
        sets.glasses.delete(Number(e.target.getAttribute('data-ts')));
        setSettings(sets);
        displayObj();
    }
}

function extraGlassButton() {
    const gl = document.createElement('div');
    gl.textContent = '+';
    gl.className = 'extra-glass';
    gl.addEventListener('click', registerNewGlass, false);

    const gc = document.createElement('div');
    gc.className = 'glass-container';

    gc.appendChild(gl);

    return gc;
}

function emptyGlass() {
    const gl = verreVide.cloneNode();
    gl.addEventListener('click', registerNewGlass, false);

    const gc = document.createElement('div');
    gc.className = 'glass-container';

    gc.appendChild(gl);

    return gc;
}

function fullGlass(ts) {
    const gl = verrePlein.cloneNode();
    gl.setAttribute('data-ts', ts);
    gl.addEventListener('click', unRegisterGlass, false);

    const gt = document.createTextNode(getLocaleTimeString(ts));

    const gc = document.createElement('div');
    gc.className = 'glass-container';

    gc.appendChild(gl);
    gc.appendChild(gt);

    return gc;
}

function setToday() {
    objdate.value = getLocaleDateString();
    objdate.dispatchEvent(new Event('change'));
}

function clearGlasses() {
    let gl;
    while ((gl = glasses.firstChild) !== null) {
        glasses.removeChild(gl);
    }
}

function displayGlasses(sets) {
    clearGlasses();

    const glassSet = sets.glasses;
    const objectif = sets.objectif;
    const gs = Array.from(glassSet);
    let empty = false;
    for (let i = 0; i < Math.max(objectif, gs.length); i++) {
        if (i < gs.length) {
            glasses.appendChild(fullGlass(gs[i]));
        } else {
            empty = true;
            glasses.appendChild(emptyGlass());
        }
    }

    glasses.appendChild(extraGlassButton());

    if (empty) {
        objsuccess.classList.add('hidden');
    } else objsuccess.classList.remove('hidden');
}

function updateObjectif(settings) {
    objval.value = settings.objectif;
}

function displayObj() {
    let ds = objdate.value;
    if (ds) {
        ds = new Date(ds).toLocaleDateString();
        let settings = getSettings(ds);
        if (!settings) {
            settings = createSettings(ds);
            if (!settings) {
                throw new Error('Error setting new date default settings');
            }
        }

        updateObjectif(settings);
        displayGlasses(settings);
    } else setToday();
}

function changeObj() {
    let no = Number(objval.value);
    // cannot update past or future objects
    if (!isNaN(no) && no > 0 && no < 51 && objdate.value === getLocaleDateString()) {
        const sets = getSettings(); // today
        sets.objectif = no;
        setSettings(sets);
        displayObj();
    } else {
        let ds = objdate.value;
        if (ds) {
            ds = new Date(ds).toLocaleDateString();
            const settings = getSettings(ds);
            if (settings) {
                updateObjectif(settings);
            }
        }
    }
}

objval.addEventListener('change', changeObj, false);
objdate.addEventListener('change', displayObj, false);
settoday.addEventListener('click', setToday, false);

displayObj();