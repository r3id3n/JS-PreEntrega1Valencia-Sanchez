/************** Entrega de proyecto 3 **************/
//Ingreso de personal

// Función para obtener los usuarios almacenados en el localStorage
function getUsersFromStorage() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Función para guardar los usuarios en el localStorage
function saveUsersToStorage(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Función para cargar los usuarios desde un archivo JSON
async function loadUsersFromJSON() {
  const response = await fetch("usuarios.json");
  return await response.json();
}

// Función para renderizar la lista de usuarios
function renderUsers() {
  const userList = document.getElementById("userList");
  userList.innerHTML = ""; // Limpiar la lista antes de renderizar

  const users = getUsersFromStorage();
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `Nombre: ${user.username}, Correo electrónico: ${user.email}`;

    // Botones para editar y eliminar usuario
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => {
      editUser(user);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";

    // Swal.fire confirmation before deleting user
    deleteButton.addEventListener("click", () => {
      Swal.fire({
        title: "Estas seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, bórralo!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteUser(user.id);
          Swal.fire({
            title: "Eliminado",
            text: "El usuario ha sido eliminado.",
            icon: "success",
          });
        }
      });
    });

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    userList.appendChild(li);
  });
}

// Función para agregar un usuario
async function addUser(username, email) {
  const users = getUsersFromStorage();
  const newUser = { id: Date.now(), username, email }; // Generar un ID único para el nuevo usuario
  users.push(newUser);
  saveUsersToStorage(users);
  renderUsers();
}

// Función para editar un usuario
async function editUser(user) {
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const addButton = document.getElementById("addButton");
  const editButton = document.getElementById("editButton");

  usernameInput.value = user.username;
  emailInput.value = user.email;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";

  editButton.addEventListener("click", async () => {
    const newUsername = usernameInput.value.trim();
    const newEmail = emailInput.value.trim();
    if (newUsername !== "" && newEmail !== "") {
      const users = getUsersFromStorage();
      const index = users.findIndex((u) => u.id === user.id);
      users[index] = {
        ...users[index],
        username: newUsername,
        email: newEmail,
      };
      saveUsersToStorage(users);
      renderUsers();
      addButton.style.display = "inline-block";
      editButton.style.display = "none";
      usernameInput.value = "";
      emailInput.value = "";
    }
  });
}

// Función para eliminar un usuario
async function deleteUser(userId) {
  let users = getUsersFromStorage();
  users = users.filter((user) => user.id !== userId);
  saveUsersToStorage(users);
  renderUsers();
}

// Evento de envío del formulario para agregar usuario
document
  .getElementById("userForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    if (username !== "" && email !== "") {
      addUser(username, email);
      usernameInput.value = ""; // Limpiar el campo de nombre de usuario después de agregar el usuario
      emailInput.value = ""; // Limpiar el campo de correo electrónico después de agregar el usuario
    }
  });

// Renderizar usuarios al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  const users = await loadUsersFromJSON();
  saveUsersToStorage(users);
  renderUsers();
});
