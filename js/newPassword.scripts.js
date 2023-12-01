// Funcion que actualiza la contraseña del usuario
const updatePassword = async (newPasswordData, repitPasswordData, token) => {
  if (newPasswordData !== repitPasswordData) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Las contraseñas no coinciden",
      confirmButtonText: "Aceptar",
      showClass: {
        popup: "animate__animated animate__zoomIn",
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut",
      },
    }).then(() => {
      window.location.href = `https://leotricotti.github.io/front-end/html/newPassword.html${token}`;
    });
  }
  try {
    const response = await fetch(
      (url = `https://e-store.up.railway.app/api/users/updatePassword/${token}`),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPasswordData,
        }),
      }
    );

    const result = await response.json();

    if (result.message === "El token no pudo ser verificado") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El token no pudo ser verificado. Por favor, intente de nuevo.",
        confirmButtonText: "Aceptar",
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      }).then(() => {
        window.location.href = "forgotPassword.html";
      });
    } else if (result.err === "Error de autenticación") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La contraseña no puede ser igual a la anterior",
        confirmButtonText: "Aceptar",
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      }).then(() => {
        window.location.href = `https://leotricotti.github.io/front-end/html/newPassword.html${token}`;
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Su contraseña ha sido actualizada exitosamente",
        confirmButtonText: "Aceptar",
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      }).then(() => {
        window.location.href =
          "https://leotricotti.github.io/front-end/index.html";
      });
    }
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Constantes que capturan los elementos del DOM
  const newPassword = document.getElementById("password");
  const repitPassword = document.getElementById("repit-password");
  addEventListener("submit", (e) => {
    e.preventDefault();
    const token = new URLSearchParams(window.location.search).get("token");
    updatePassword(newPassword.value, repitPassword.value, token);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Constantes que capturan los elementos del DOM
  const repitEyeOpen = document.getElementById("repit-eye-open");
  const repitEyeClose = document.getElementById("repit-eye-close");
  const repitEyeContainer = document.getElementById("repit-eye-container");
  // Función que agrega un evento de click al botón de mostrar/ocultar contraseña
  repitEyeContainer.addEventListener("click", () => {
    repitEyeOpen.classList.toggle("show-password");
    repitEyeClose.classList.toggle("show-password");
    showNewPassword();
  });
});

const showNewPassword = () => {
  const repitPassword = document.getElementById("repit-password");
  repitPassword.type = repitEyeOpen.classList.contains("show-password")
    ? "text"
    : "password";
};
