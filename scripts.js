//URL base de la API RESTful 
const url = 'https://crudcrud.com/api/850c80492c814c5b8608f0feaf47537e/usuarios'

// Al cargar la página exitosamente, oculta el cuadro de diálogo y obtiene los objetos de la API
window.onload = () => {
    $('#popUp').hide();
    getObjects();
};

//Metodo GET - Obtener datos de un recurso

async function loadObjects() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        throw error;
    }
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


//POST - Crear un nuevo recurso

async function addObject(){
    const data = {
        name: document.getElementById('name').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        gender: document.getElementById('gender').value,
    };

    try {
        const response = await fetch(url, {
            method: 'post', 
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(data) 
        });

        if(!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

function viewObject(object) {
    document.getElementsByName('id2')[0].value = object._id;
    document.getElementsByName('name2')[0].value = object.name;
    document.getElementsByName('lastName2')[0].value = object.lastName;
    document.getElementsByName('email2')[0].value = object.email;
    document.getElementsByName('gender2')[0].value = object.gender;
    $('#popUp').dialog({
        modal: true,
        width: 400,
        height: 350,
        closeText: ''
    }).css('font-size', '15px')
}

function insertTr(object) {
    const tbody = document.querySelector('tbody');
    
    const row = tbody.insertRow();
    row.setAttribute('id', object._id)
    
    const idCell = row.insertCell()
    idCell.innerHTML = object._id;
    
    var nameCell = row.insertCell();
    nameCell.innerHTML = object.name;

    var lastNameCell = row.insertCell();
    lastNameCell.innerHTML = object.lastName;
    
    var emailCell = row.insertCell()
    emailCell.innerHTML = object.email;

    var genderCell = row.insertCell()
    genderCell.innerHTML = object.gender;

    const viewCell = row.insertCell()
    const viewButton = document.createElement('button');
    viewButton.className = 'btn btn-view';
    viewButton.textContent = 'VER';
    viewButton.addEventListener('click',() => viewObject(object));
    viewCell.appendChild(viewButton); 
        
    const delCell = row.insertCell();
    const delButton = document.createElement('button');
    delButton.className = 'btn';
    delButton.textContent = 'BORRAR';
    delButton.addEventListener('click', () => deleteObject(object._id));        
    delCell.appendChild(delButton);
    clearInputs()
}

//Valida los campos de entrada y llama a addObject() para agregar un nuevo objeto.
//Inserta el nuevo objeto en la tabla.
async function saveObject() {
    //Si ambos campos tienen valores válidos, continúa con el envío de los datos
    if (
        document.getElementById('name').value.trim() !== '' &&
        document.getElementById('lastName').value.trim() !== '' &&
        document.getElementById('email').value.trim() !== '' &&
        document.getElementById('gender').value.trim() !== ''
    ) {        
        try {
            const newUser = await addObject();
            insertTr(newUser);
            swal("Buen trabajo!", "Usuario agregado satisfactoriamente", "success");
        }catch (error){
            swal("Error", "Error al guardar el objeto: " + error.message, "error");
        }
    } else {
        swal("Error", "Por favor, complete todos los campos", "error");
    }
}

//DELETE - Eliminar un recurso existente
async function removeObject(id){
    try {
        const response = await fetch(`${url}/${id}`, { method: 'DELETE'});
        if (!response.ok) throw new Error(response.statusText);
    } catch (error) {
        throw error;
    }
}

async function deleteObject(id) {
    try {
        await removeObject(id);
        const row = document.getElementById(id);
        if (row) row.remove();
        swal("Usuario Eliminado", "El usuario ha sido eliminado correctamente", "success");
        clearInputs();
    } catch (error) {
        swal("Error", "Error al eliminar el objeto:" + error.message, "error");
    }
}

//PUT - Actualizar un recurso existente
async function modifyObject(){
    const id = document.getElementsByName('id2')[0].value;
    const data = {
        name: document.getElementsByName('name2')[0].value,
        lastName: document.getElementsByName('lastName2')[0].value,
        email: document.getElementsByName('email2')[0].value,
        gender: document.getElementsByName('gender2')[0].value
    };

    try {
        const response = await fetch (`${url}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        if(!response.ok) throw new Error(response.statusText);
        return { _id:id, ...data};
    } catch (error) {
        throw error;
    }
} 

function clearInputs() {
    document.getElementById('name').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('name').focus();
}

async function updateObject() {
    if (
                document.getElementsByName('name2')[0].value.trim() !== '' &&
        document.getElementsByName('lastName2')[0].value.trim() !== '' &&
        document.getElementsByName('email2')[0].value.trim() !== '' &&
        document.getElementsByName('gender2')[0].value.trim() !== ''
    ){
        try {
            const updatedUser = await modifyObject();
            const row = document.getElementById(updatedUser._id);
            if (row) {
                row.cells[1].innerText = updatedUser.name;
                row.cells[2].innerText = updatedUser.lastName;
                row.cells[3].innerText = updatedUser.email;
                row.cells[4].innerText = updatedUser.gender;
            }
            $('#popUp').dialog('close');
            clearInputs();
            swal("Usuario actualizado!", "El usuario ha sido actualizado correctamente.", "success");
        } catch (error) {
            swal("Error", "Error al actualizar el objeto: " + error.message, "error");
        }
    } else {
        swal("Error", "Por favor, complete todos los campos.", "error");
    }
}