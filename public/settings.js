const thumbnails = document.getElementById('thumbnail');

const settingFieldConfig = {
    'name': {
        name: 'nom',
        type: 'input',
        valueField: 'value',
        hasLabel: true,
        properties: {
            type: 'text',
            value: '#value'
        }
    },
    'picture': {
        name: 'image',
        type: 'img',
        valueField: 'src',
        properties: {
            width: 144,
            height: 144,
            src: '#value'
        }
    },
    'dailyObjective' : {
        name: 'objectif quotidien',
        type: 'input',
        valueField: 'value',
        hasLabel: true,
        isInt: true,
        properties: {
            type: 'number',
            value: '#value'
        }
    },
    'currentObjective': {
        name: 'avancement actuel',
        type: 'input',
        valueField: 'value',
        hasLabel: true,
        isInt: true,
        properties: {
            type: 'number',
            value: '#value'
        }
    },
    'default': {
        name: 'champ inconnu',
        type: 'input',
        valueField: 'value',
        hasLabel: true,
        properties: {
            type: 'text',
            value: '#value'
        }
    }
};

const THUMBNAIL_DIMENSION = 144;

function setTransformation(ctx, o, width = THUMBNAIL_DIMENSION, height = THUMBNAIL_DIMENSION) {
    switch (o) {
        case 2:
            ctx.setTransform(-1, 0, 0, 1, width, 0);
            break;
        case 3:
            ctx.setTransform(-1, 0, 0, -1, width, height);
            break;
        case 4:
            ctx.setTransform(1, 0, 0, -1, 0, height);
            break;
        case 5:
            ctx.setTransform(0, 1, 1, 0, 0, 0);
            break;
        case 6:
            ctx.setTransform(0, 1, -1, 0, height, 0);
            break;
        case 7:
            ctx.setTransform(0, -1, -1, 0, height, width);
            break;
        case 8:
            ctx.setTransform(0, -1, 1, 0, 0, width);
            break;
        default:
            break;
    }
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

function getOrientation(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const view = new DataView(e.target.result);
        if (view.getUint16(0, false) !== 0xFFD8)
        {
            return callback(-2);
        }
        const length = view.byteLength;
        let offset = 2;
        while (offset < length) {
            if (view.getUint16(offset+2, false) <= 8) return callback(-1);
            const marker = view.getUint16(offset, false);
            offset += 2;
            if (marker === 0xFFE1)
            {
                if (view.getUint32(offset += 2, false) !== 0x45786966)
                {
                    return callback(-1);
                }

                const little = view.getUint16(offset += 6, false) === 0x4949;
                offset += view.getUint32(offset + 4, little);
                const tags = view.getUint16(offset, little);
                offset += 2;
                for (let i = 0; i < tags; i++)
                {
                    if (view.getUint16(offset + (i * 12), little) === 0x0112)
                    {
                        return callback(view.getUint16(offset + (i * 12) + 8, little));
                    }
                }
            }
            else if ((marker & 0xFF00) !== 0xFF00)
            {
                break;
            }
            else
            {
                offset += view.getUint16(offset, false);
            }
        }
        return callback(-1);
    };
    reader.readAsArrayBuffer(file);
}

function resize(tm, o, e) {
    const c = document.createElement('canvas');
    c.width = THUMBNAIL_DIMENSION;
    c.height = THUMBNAIL_DIMENSION;
    const ctx = c.getContext('2d');
    setTransformation(ctx, o, THUMBNAIL_DIMENSION, THUMBNAIL_DIMENSION);
    ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height, 0, 0, THUMBNAIL_DIMENSION, THUMBNAIL_DIMENSION);
    ctx.setTransform(1,0,0,1,0,0);
    tm.src = c.toDataURL('image/jpeg', 0.92);
}

function newThumbnail (tmb, e) {
    if (e.target.files[0]) {
        getOrientation(e.target.files[0],(o) => {
            const fr = new FileReader();
            const pr = new Image();

            fr.addEventListener('load', function () {
                pr.addEventListener('load', resize.bind(null, tmb, o), false);
                pr.src = fr.result;
            }, false);

            fr.readAsDataURL(e.target.files[0]);
        });
    }
}

function clearElement (el) {
    let child;
    while ((child = el.firstChild) !== null) {
        el.removeChild(child);
    }
}

function createElWithBinding(type, child, className, eventType, cb, ...args) {
    if (typeof type === 'string') {
        const el = document.createElement(type);
        if (child) {
            el.appendChild(child);
        }
        if (className) {
            el.className = className;
        }
        if (eventType && cb) {
            el.addEventListener(eventType, cb.bind(el, ...args), false);
        }
        return el;
    }

    return null;
}

function getSettingsValues(name) {
    const settings = document.querySelectorAll(`.setting-${name}`);
    const ret = {};
    Array.prototype.forEach.call(settings, (setting) => {
        const settingName = setting.id.split('-')[1];
        const setVal = setting[settingFieldConfig[settingName].valueField];
        ret[settingName] = settingFieldConfig[settingName].isInt ? parseInt(setVal) || 0 : setVal;
    });
    return ret;
}

function updateSetting(name) {
    const updatedSettings = getSettingsValues(name);
    const currentSettings = getSettings();
    if (currentSettings) {
        currentSettings[name] = updatedSettings;
        setSettings(currentSettings);
    }
}

function deleteSetting(name) {
    const currentSettings = getSettings();
    // if (currentSettings.hasOwnProperty(name)) {
    //     delete currentSettings[name];
    //     setSettings(currentSettings);
    //     document.getElementById('settings').removeChild(document.getElementById(`setting-${name}-container`));
    // }
}

function populateElementFromSetting (element, settingValue, properties) {
    for (let property in properties) {
        if (properties.hasOwnProperty(property)) {
            const propertyVal = properties[property];
            if (propertyVal === '#value') element[property] = settingValue;
            else element[property] = propertyVal;
        }
    }
}

function createLabel(forId, settingName) {
    const label = document.createElement('label');
    label.htmlFor = forId;
    label.appendChild(document.createTextNode(`${settingFieldConfig[settingName].name} : `));

    return label;
}

function createElementFromSetting (setDiv, setting, settingName, name) {
    const settingConfig = settingFieldConfig[settingName] || 'default';
    const el = document.createElement(settingConfig.type);
    const settingId = `setting-${settingName}-${name}`;
    el.id = settingId;
    el.className += ` setting-${name}`;
    if (settingConfig.properties) populateElementFromSetting(el, setting[settingName], settingConfig.properties);
    if (settingConfig.hasLabel) {
        // setDiv.appendChild(createLabel(settingId, settingName));
    }
    setDiv.appendChild(el);
    setDiv.appendChild(document.createElement('br'));

    return el;
}

function createHiddenFileInput(parent, img, id) {
    const input = createElWithBinding('input', null, 'dsp-hidden', 'change', newThumbnail, img);
    input.type = 'file';
    input.accept = 'image/*';
    input.id = id;
    parent.appendChild(input);
}

function populateSetting (parent, setting, name) {
    const setDiv = document.createElement('div');
    setDiv.id = `setting-${name}-container`;
    for (let settingName in setting) {
        if (setting.hasOwnProperty(settingName)) {
            if (settingName === 'picture') {
                const inputId = `hidden-${settingName}-${name}`;
                const label = document.createElement('label');
                const img = createElementFromSetting(label, setting, settingName, name);
                label.htmlFor = inputId;
                setDiv.appendChild(label);
                createHiddenFileInput(setDiv, img, inputId);
            } else {
                createElementFromSetting(setDiv, setting, settingName, name);
            }
        }
    }

    setDiv.appendChild(createElWithBinding('button', document.createTextNode('update'), null, 'click', updateSetting, name));
    setDiv.appendChild(createElWithBinding('button', document.createTextNode('delete'), null, 'click', deleteSetting, name));
    parent.appendChild(setDiv);
}

populateSettings = () => {
    const setting = document.getElementById('settings');
    clearElement(setting);
    const sets = getSettings();
    if (sets) {
        for (let set in sets) {
            if (sets.hasOwnProperty(set)) {
                populateSetting(setting, sets[set], set);
            }
        }
    }
};


populateSettings();
