const glasses = document.querySelector('.glasses');
const objdate = document.getElementById('objdate');
const settoday = document.getElementById('settoday');

function registerNewGlass() {
    // cannot modify past records
    const now = Date.now();
    if (objdate.value === new Date().toISOString().slice(0, 10)) {
        const sets = getSettings(); // today
        sets.glasses.add(now);
        setSettings(sets);
        displayObj();
    }
}

function unRegisterGlass(e) {
    // cannot modify past records
    if (objdate.value === new Date().toISOString().slice(0, 10)) {
        const sets = getSettings(); // today
        sets.glasses.delete(Number(e.target.getAttribute('data-ts')));
        setSettings(sets);
        displayObj();
    }
}

function emptyGlass() {
    const gl = verreVide.cloneNode();
    gl.addEventListener('click', registerNewGlass, false);

    return gl;
}

function fullGlass(ts) {
    const gl = verrePlein.cloneNode();
    gl.setAttribute('data-ts', ts);
    gl.addEventListener('click', unRegisterGlass, false);

    return gl;
}

function setToday() {
    objdate.value = new Date().toISOString().slice(0, 10);
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
    for (let i = 0; i < objectif; i++) {
        if (i < gs.length) {
            glasses.appendChild(fullGlass(gs[i]));
        } else glasses.appendChild(emptyGlass());
    }
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

        displayGlasses(settings);
    } else setToday();
}

objdate.addEventListener('change', displayObj, false);
settoday.addEventListener('click', setToday, false);

displayObj();