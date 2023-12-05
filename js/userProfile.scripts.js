// Función que captura la información del usuario y la almacena en el local storage
const getUser = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      "https://e-store.up.railway.app/api/users/current",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    const stopSpinner = [result.data];

    if (result.data) {
      localStorage.setItem("user", JSON.stringify(result.data));
      showSpinner(stopSpinner);
    }

    renderUserProfile();

    return result;
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  getUser();
});

// Función que renderiza el perfil del usuario
function renderUserProfile() {
  const userProfileForm = document.getElementById("user-profile-form");
  const userProfile = [JSON.parse(localStorage.getItem("user"))];
  let html = "";

  html += `
    ${userProfile.map((user) => {
      return `
        <div class="row">
          <div class="col-md-4 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5">
              <div class="position-relative">
                <img class="rounded-circle mt-5" width="150px" height="150px" src="../img/user-avatar.png" />
              </div>
              <span class="font-weight-bold">${user.first_name} ${user.last_name}</span>
              <span class="text-black-50">${user.email}</span>
              <div id="link-container"></div>
            </div>
          </div>
          <div class="col-md-7 border-right">
            <div class="p-3 py-5">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="text-right">Perfil</h4>
              </div>
              <div class="row mt-2">
                <div class="col-md-6">
                  <label class="labels" for='first_name'>Nombre</label>
                  <input type="text" class="form-control" value=${user.first_name} id='first_name' autocomplete="off" required/>
                </div>
                <div class="col-md-6">
                  <label class="labels" for="last_name">Apellido</label>
                  <input type="text" class="form-control" value=${user.last_name} id="last_name" autocomplete="off" required/>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-md-12">
                  <label class="labels" for="phone_number">Teléfono</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ingrese su telefono"
                    id="phone_number"
                    value="${user.phone_number}" 
                    required
                    autocomplete="off"
                  />
                </div>
                <div class="col-md-12 mt-3">
                  <label class="labels" for="home_address">Dirección de envío</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ingrese su dirección"
                    value="${user.home_address}"
                    id="home_address"
                    required
                    autocomplete="off"
                  />
                </div>
                <div class="col-md-12 mt-3">
                  <label class="labels" for="zip_code">Código Postal</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ingrese su código postal"
                    value="${user.zip_code}"
                    id="zip_code"
                    required
                    autocomplete="off"
                  />
                </div>
                <div class="col-md-12 mt-3">
                  <label class="labels" for="state">Provincia</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ingrese su provincia"
                    value="${user.state}"
                    id="state"
                    required
                    autocomplete="off"
                  />
                </div>
                <div class="col-md-12 mt-3">
                  <label class="labels" for="city">Ciudad</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ingrese su ciudad"
                    value="${user.city}"
                    id="city"
                    required
                    autocomplete="off"
                  />
                </div>
                <div class="mt-5 text-center">
                  <button
                    type="submit"
                    id="signup-button"
                    class="btn btn-secondary profile-button"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    })}
  `;

  userProfileForm.innerHTML = html;
}

// Función que completa el perfil del usuario
document.addEventListener("DOMContentLoaded", () => {
  const userProfileForm = document.getElementById("user-profile-form");
  userProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const phone_number = document.getElementById("phone_number").value;
    const home_address = document.getElementById("home_address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zip_code = document.getElementById("zip_code").value;

    const userData = {
      first_name,
      last_name,
      phone_number,
      home_address,
      city,
      state,
      zip_code,
    };

    Swal.fire({
      icon: "question",
      title: "¿Confirma los cambios?",
      text: "Si desea puede modificar sus datos más tarde.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#3085d6",
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        sendProfileData(userData);
      }
    });
  });
});

// Función que envía los datos del perfil del usuario al servidor
async function sendProfileData(data) {
  const userProfile = [JSON.parse(localStorage.getItem("user"))];
  const token = localStorage.getItem("token");
  const userId = userProfile[0].email;
  const response = await fetch(
    "https://e-store.up.railway.app/api/users/userProfile",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: data,
        uid: userId,
      }),
    }
  );

  const result = await response.json();

  if (result.message === "Perfil actualizado con éxito.") {
    Swal.fire({
      icon: "success",
      title: "¡Datos actualizados!",
      confirmButtonText: "Aceptar",

      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    }).then((resulted) => {
      if (resulted.isConfirmed) {
        localStorage.setItem("user", JSON.stringify(result.data));
        renderDropdownMenu();
        window.location.reload();
      }
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "¡Error!",
      text: "No se pudieron actualizar los datos.",
      confirmButtonText: "Aceptar",

      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    });
  }

  return result;
}

// Función que redirige al usuario a la página de productos
const goToProducts = () => {
  window.location.href =
    "https://leotricotti.github.io/front-end/html/products.html";
};
