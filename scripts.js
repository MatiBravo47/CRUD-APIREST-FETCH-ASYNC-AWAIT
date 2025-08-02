const url = 'https://crudcrud.com/api/850c80492c814c5b8608f0feaf47537e/usuarios';

window.onload = () => {
    document.getElementById('popUp').classList.remove('open');
    getObjects();
};

async function loadObjects() {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

async function getObjects() {
    try {
        const data = await loadObjects();
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        data.forEach(insertTr);
    } catch (error) {
        swal("Error", "Error al cargar los objetos: " + error.message, "error");
    }
}

async function addObject() {
    const data = {
        name: document.getElementById('name').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        gender: document.getElementById('gender').value,
    };
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
}

function viewObject(object) {
    document.getElementsByName('id2')[0].value = object._id;
    document.getElementsByName('name2')[0].value = object.name;
    document.getElementsByName('lastName2')[0].value = object.lastName;
    document.getElementsByName('email2')[0].value = object.email;
    document.getElementsByName('gender2')[0].value = object.gender;
    document.getElementById('popUp').classList.add('open');
}

function closeModal() {
    document.getElementById('popUp').classList.remove('open');
}

function insertTr(object) {
    const tbody = document.querySelector('tbody');
    const row = tbody.insertRow();
    row.id = object._id;

    row.insertCell().innerText = object._id;
    row.insertCell().innerText = object.name;
    row.insertCell().innerText = object.lastName;
    row.insertCell().innerText = object.email;
    row.insertCell().innerText = object.gender;

    const viewCell = row.insertCell();
    const viewButton = document.createElement('button');
    viewButton.className = 'btn btn-view';
    viewButton.innerText = 'VER';
    viewButton.addEventListener('click', () => viewObject(object));
    viewCell.appendChild(viewButton);

    const delCell = row.insertCell();
    const delButton = document.createElement('button');
    delButton.className = 'btn';
    delButton.innerText = 'BORRAR';
    delButton.addEventListener('click', () => deleteObject(object._id));
    delCell.appendChild(delButton);
    clearInputs();
}

async function saveObject() {
    const name = document.getElementById('name').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const gender = document.getElementById('gender').value.trim();

    if (name && lastName && email && gender) {
        try {
            const newUser = await addObject();
            insertTr(newUser);
            swal("Buen trabajo!", "Usuario agregado satisfactoriamente", "success");
        } catch (error) {
            swal("Error", "Error al guardar el objeto: " + error.message, "error");
        }
    } else {
        swal("Error", "Por favor, complete todos los campos", "error");
    }
}

async function deleteObject(id) {
    try {
        await fetch(`${url}/${id}`, { method: 'DELETE' });
        const row = document.getElementById(id);
        if (row) row.remove();
        swal("Usuario Eliminado", "El usuario ha sido eliminado correctamente", "success");
        clearInputs();
    } catch (error) {
        swal("Error", "Error al eliminar el objeto: " + error.message, "error");
    }
}

async function modifyObject() {
    const id = document.getElementsByName('id2')[0].value;
    const data = {
        name: document.getElementsByName('name2')[0].value,
        lastName: document.getElementsByName('lastName2')[0].value,
        email: document.getElementsByName('email2')[0].value,
        gender: document.getElementsByName('gender2')[0].value
    };
    const response = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(response.statusText);
    return { _id: id, ...data };
}

async function updateObject() {
    const name = document.getElementsByName('name2')[0].value.trim();
    const lastName = document.getElementsByName('lastName2')[0].value.trim();
    const email = document.getElementsByName('email2')[0].value.trim();
    const gender = document.getElementsByName('gender2')[0].value.trim();

    if (name && lastName && email && gender) {
        try {
            const updatedUser = await modifyObject();
            const row = document.getElementById(updatedUser._id);
            if (row) {
                row.cells[1].innerText = updatedUser.name;
                row.cells[2].innerText = updatedUser.lastName;
                row.cells[3].innerText = updatedUser.email;
                row.cells[4].innerText = updatedUser.gender;
            }
            closeModal();
            clearInputs();
            swal("Usuario actualizado!", "El usuario ha sido actualizado correctamente.", "success");
        } catch (error) {
            swal("Error", "Error al actualizar el objeto: " + error.message, "error");
        }
    } else {
        swal("Error", "Por favor, complete todos los campos.", "error");
    }
}

function clearInputs() {
    ['name', 'lastName', 'email', 'gender'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('name').focus();
}
