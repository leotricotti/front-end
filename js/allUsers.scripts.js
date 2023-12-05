// Capitalizar la primera letra de una palabra
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Función que captura la información del usuario y la almacena en el local storage
const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  const usersProfile = [];
  try {
    const response = await fetch("https://e-store.up.railway.app/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    usersProfile.push(...result.data);
    if (result.message !== "Usuarios enviados al cliente con éxito.") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo cargar la información de los usuarios",
        confirmButtonText: "Aceptar",
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      });
    } else {
      showSpinner(usersProfile);
      renderAllUsersProfile(usersProfile);
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

// Función que renderiza el perfil del usuario
function renderAllUsersProfile(usersProfile) {
  const profileContainer = document.getElementById("profile-container");
  const usersDeleted = localStorage.getItem("usersDeleted") || 0;
  let html = "";
  html += `
  <div class="row container w-50 d-flex justify-content-around">
    <div class="col-md-6 mb-3">
      <h4>
        Usuarios totales:
        <small class="text-muted">${usersProfile.length}</small>
      </h4>
    </div>
    <div class="col-md-6 mb-3">
      <h4>
        Usuarios eliminados:
        <small class="text-muted">${usersDeleted}</small>
      </h4>
    </div>
  </div>
    ${usersProfile.map((user) => {
      return `
        <div class="row container rounded bg-white w-50">
          <div class="col-md-4 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5">
              <div class="position-relative">
                <img class="rounded-circle" width="150px" height="150px" src="../img/user-avatar.png" />
              </div>
              <span class="font-weight-bold">${user.first_name} ${
        user.last_name
      }</span>
              <span class="text-black-50">${user.email}</span>
            </div>
            <div class="mb-5  text-center">
              <button
                type="button"
                id="signup-button"
                class="btn btn-secondary profile-button mb-3 ${
                  user.role === "admin" ? "disabled" : ""
                }"
                onclick="updateUserRole('${user.email}', '${user.role}')"
              >
                Update Role
              </button>
              <button
                type="button"
                id="delete-user-button"
                class="btn btn-secondary profile-button ${
                  user.role === "admin" ? "disabled" : ""
                }"
                onclick="getUserToDelete('${user.email}')"
              >
                Delete Users
              </button>
          </div>
          </div>
          <div class="col-md-7 border-right">
            <div class="p-3 py-5">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="text-right">Perfil</h4>
              </div>
              <div class="row mt-2">
                <div class="col-md-6">
                  <span class="text-underline mb-4" >
                   <u>Nombre</u>
                  </span>
                  <p class='text' >${user.first_name}</p>
                </div>
                <div class="col-md-6">
                  <span class="text-underline mb-4" >
                    <u>Apellido</u>
                  </span>
                  <p class='text' >${user.last_name}</p>
                </div>
              </div>
              <div class="row mt-2">
              <div class="col-md-12">
                <span class="text-underline mb-4" >
                 <u>Correo Electrónico</u>
                </span>
                <p class='text' >${user.email}</p>
              </div>
              <div class="col-md-12">
                <span class="text-underline mb-4" >
                  <u>Role</u>
                </span>
                <p class='text'>${capitalize(user.role)}</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      `;
    })}
  `;

  profileContainer.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", getAllUsers);

// Función para actualizar el rol del usuario
async function updateUserRole(userId, userRole) {
  let newRoleData = "";

  if (userRole === "user") {
    newRoleData = "premium";
  } else {
    newRoleData = "user";
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡Estás a punto de actualizar el rol del usuario!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Sí, actualizar`,
    cancelButtonText: "Cancelar",
    showClass: {
      popup: "animate__animated animate__zoomIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      sendNewRoleToServer(userId, newRoleData);
    }
  });
}

const sendNewRoleToServer = async (userId, newRoleData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `https://e-store.up.railway.app/api/users/premium/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role: newRoleData,
      }),
    }
  );

  const result = await response.json();

  if (!result.message === "Rol actualizado con exito.") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No se pudo actualizar el rol",
      confirmButtonText: "Aceptar",
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "¡Felicitaciones!",
      text: "Rol actualizado con éxito",
      confirmButtonText: "Aceptar",
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }
};

// Función que elimina un usuario
const userToDelete = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `https://e-store.up.railway.app/api/users/userDelete/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();
  showSpinner(result);

  if (!result.message === "Usuario eliminado con exito.") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No se pudo eliminar el usuario",
      confirmButtonText: "Aceptar",
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "¡Felicitaciones!",
      text: "Usuario eliminado con éxito",
      confirmButtonText: "Aceptar",
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }
};

const getUserToDelete = (userId) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡Estás a punto de eliminar el usuario!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Sí, eliminar`,
    cancelButtonText: "Cancelar",
    showClass: {
      popup: "animate__animated animate__zoomIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      userToDelete(userId);
    }
  });
};

// Función que elimina los usuarios desconectad
const deleteUnConnectedUsers = () => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡Estás a punto de eliminar los usuarios desconectados!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Sí, eliminar`,
    cancelButtonText: "Cancelar",
    showClass: {
      popup: "animate__animated animate__zoomIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUsers();
    }
  });
};

// Función que elimina los usuarios desconectados
const deleteUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "https://e-store.up.railway.app/api/users/deleteUnconnectedUsers",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  console.log(result);

  if (result.data?.length > 0) {
    localStorage.setItem("usersDeleted", result.data.length);
  }

  if (result.message === "No hay usuarios para eliminar") {
    Swal.fire({
      icon: "success",
      title: "Felicitaciones",
      text: "No hay usuarios para eliminar",
      confirmButtonText: "Aceptar",
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "Operación realizada con éxito",
      text: "Los usuarios han sido eliminados",
      confirmButtonText: "Aceptar",
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    }).then((resulted) => {
      if (resulted.isConfirmed) {
        window.location.reload();
      }
    });
  }
};

// Función que redirige al usuario a la página de productos
const goToProducts = () => {
  window.location.href =
    "https://leotricotti.github.io/front-end/html/products.html";
};
