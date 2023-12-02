// Función que envía los datos al backend
const forgotPassword = async (username) => {
  try {
    const response = await fetch(
      "https://e-store.up.railway.app/api/users/forgotPassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username }),
      }
    );

    const result = await response.json();

    if (result.response === "Correo de recuperación enviado al usuario.") {
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Correo de recuperación enviado al usuario",
        confirmButtonText: "Aceptar",
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href =
            "https://leotricotti.github.io/front-end/index.html";
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El usuario no existe",
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
  } catch (error) {
    console.log(error);
  }
};

// Código que captura los datos del formulario
document.addEventListener("DOMContentLoaded", () => {
  // Capturamos el formulario de login
  const loginForm = document.getElementById("login-form");

  // Función que captura los datos y actualiza la contraseña
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    forgotPassword(username);
  });
});

// Spinner
const restoreBtn = document.getElementById("forgot-button");

const btnSpinner = () => {
  restoreBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cargando...`;
};
