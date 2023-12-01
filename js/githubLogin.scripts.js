// Última conexión
const lastConnection = async (username) => {
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
        action: "login",
      }),
    }
  );
};

// Crea un carrito vacío en la base de datos
const createCart = async () => {
  try {
    if (localStorage.getItem("cartId")) {
      return;
    }
    const response = await fetch("https://e-store.up.railway.app/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        products: [],
      }),
    });
    const result = await response.json();
  } catch (error) {
    console.log(error);
  }
};

// Función que captura la información del usuario y la almacena en el local storage
const getUser = async () => {
  try {
    const response = await fetch(
      "https://e-store.up.railway.app/api/users/current",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const result = await response.json();
    const role = result.data.role;
    if (result) {
      localStorage.setItem("user", JSON.stringify(result.data));
      lastConnection(result.data.email);
    }

    const url = role === "admin" ? "realTimeProducts.html" : "products.html";
    window.location.href = `https://leotricotti.github.io/front-end/html/${url}`;

    return result;
  } catch (error) {
    console.log(error);
  }
};

const githubRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  localStorage.setItem("token", urlParams.get("token"));
  Swal.fire({
    icon: "success",
    title: "Inicio de sesión exitoso",
    text: "Serás redirigido en un momento...",
    showConfirmButton: false,
    timer: 2000,
    showClass: {
      popup: "animate__animated animate__zoomIn",
    },
    hideClass: {
      popup: "animate__animated animate__zoomOut",
    },
  }).then(() => {
    getUser();
    createCart();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.search.includes("token")) {
    githubRedirect();
  }
});
