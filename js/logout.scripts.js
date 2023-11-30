// Ultima desconexión
const lastConnection = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user.email;

  const response = await fetch(
    "https://e-store.up.railway.app/api/sessions/lastConnection",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        username: username,
        action: "logout",
      }),
    }
  );
};

//Cerrar sesión
const logout = () => {
  Swal.fire({
    title: "¿Estás seguro que deseas cerrar sesión?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: `Cerrar sesión`,
    denyButtonText: `Cancelar`,
    showClass: {
      popup: "animate__animated animate__zoomIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Gracias por utilizar nuestros servicios",
        showConfirmButton: true,
        confirmButtonText: `Aceptar`,
        showClass: {
          popup: "animate__animated animate__zoomIn",
        },
        hideClass: {
          popup: "animate__animated animate__zoomOut",
        },
      });
      setTimeout(() => {
        lastConnection();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.setItem("currentPage", 1);
        localStorage.removeItem("usersDeleted");
        window.location.href = "https://e-store.up.railway.app/index.html";
      }, 2000);
    }
  });
};
