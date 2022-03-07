// funcion mostrar libros en la interfaz
function librosHTML(list) {
  let listaLibros = document.getElementById("listBooks");
  listaLibros.innerHTML = "";
  for (const libro of list) {
    listaLibros.innerHTML += `
        <div class="wrap">
            <div class="titleBooks">
                <h2>${libro.nombre}</h2>
            </div>
            <div class="content">
            <div class="imgContainer">
                <div class="imgCard">
                <img class="imgBook" src=${libro.img} alt="imagen del libro ${libro.nombre}">
                </div>
            </div>
            <div class="infoContainer">
                <div class="cardSinopsis">
                    <p class="text">${libro.sinopsis}</p>
                </div>
                <div class="cardPrecio">
                    <span class="precio" >Precio: ${libro.precio} $</span>
                </div>
                <div class="cardButton">
                    <button class="btnCard" id="${libro.id}">Comprar</button>
                </div>
            </div>
            </div>
        </div>
        `;
  }
  eventoBoton();
}
function modalEvent() {
  const openModal = document.getElementById("buttonModal");
  const modal = document.querySelector(".modal");
  const closeModal = document.querySelector(".modalClose");
  openModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("modalShow");
  });
  closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("modalShow");
  });
}
function carritoHTML(lista) {
  contentModal.innerHTML = `<a class="modalClose" href="#">cerrar</a>`;
  cantidadCarrito.innerHTML = lista.length;
  let precioFinal = 0;
  modalEvent();
  for (const producto of lista) {
    contentModal.innerHTML += `
        <div class="flexModal">
        <h3 class="titleModalBook">Libro:${producto.nombre}</h3>
        <span class="span">Precio: $ ${producto.precio}</span>
        <span class="span">Cantidad: ${producto.cantidad}</span>
        <span class="span">Subtotal: $${producto.subTotal()}</span>
        <button id="${producto.id}" class="remove">X</button></div>
          `;
    precioFinal += producto.subTotal();
    eventoRemove();
    modalEvent();
  }
  let total = document.createElement("span");
  total.classList.add("span");
  total.innerHTML = `Total: $${precioFinal} <button id="comprar" class="comprar">Finalizar compra</button><button id="envio" class="comprar">Envío</button>`;
  contentModal.append(total);
  finalizarCompra();
  envioCompra();
}
function eventoBoton() {
  let botones = document.getElementsByClassName("btnCard");
  for (const btn of botones) {
    btn.addEventListener("click", function () {
      let compra = carrito.find((libro) => libro.id == this.id);
      if (compra) {
        compra.addCantidad();
      } else {
        compra = listaLibros.find((libro) => libro.id == this.id);
        carrito.push(compra);
      }
      localStorage.setItem("Carrito", JSON.stringify(carrito));
      carritoHTML(carrito);
      Toastify({
        text: `Se ha agregado al carrito: ${compra.nombre}`,
        duration: 3000,
        gravity: "bottom",
        className: "info",
        style: {
          background: "linear-gradient(75deg, #511d47 35%, #ffcb3a)",
        },
        offset: {
          x: "2em",
          y: "10em",
        },
      }).showToast();
    });
  }
}

function filtroHTML(list) {
  const tag = list.map((libro) => libro.tag);
  crearSelect(sinDuplicados(tag), "tag");
  //
  const precio = list.map((libro) => libro.precio);
  crearSelect(sinDuplicados(precio), "precio");

  //
  const autor = list.map((libro) => libro.autor);
  crearSelect(sinDuplicados(autor), "autor");
}

function crearSelect(list, key) {
  const filtro = document.getElementById("select");
  let newSelect = document.createElement("select");
  newSelect.classList.add("select");
  newSelect.innerHTML =
    "<option>Filtro por " +
    key +
    "</option>" +
    "<option>" +
    list.join("</option><option>") +
    "</option>";
  filtro.append(newSelect);
  newSelect.addEventListener("change", function () {
    const filtrados = listaLibros.filter((libro) => libro[key] == this.value);
    librosHTML(filtrados);
  });
}

function sinDuplicados(list) {
  let sinDuplicar = [];
  list.forEach((libro) => {
    if (!sinDuplicar.includes(libro)) {
      sinDuplicar.push(libro);
    }
  });
  return sinDuplicar;
}
function eventoRemove() {
  const remove = document.getElementsByClassName("remove");
  for (const btn of remove) {
    btn.addEventListener("click", function () {
      let index = carrito.findIndex((libro) => libro.id == this.id);
      let libro = carrito[index];
      if (libro.cantidad > 1) {
        libro.removeCantidad();
        localStorage.setItem("Carrito", JSON.stringify(carrito));
      } else {
        carrito.splice(index, 1);
        localStorage.setItem("Carrito", JSON.stringify(carrito));
      }
      carritoHTML(carrito);
      Toastify({
        text: `Se ha quitado del carrito: ${libro.nombre}`,
        duration: 3000,
        gravity: "bottom",
        className: "info",
        style: {
          background: "linear-gradient(75deg, #511d47 35%, #ffcb3a)",
        },
        offset: {
          x: "2em",
          y: "10em",
        },
      }).showToast();
    });
  }
}

function finalizarCompra() {
  if (carrito.length >= 1) {
    const finalizarCompra = document.getElementById("comprar");
    finalizarCompra.addEventListener("click", function () {
      contentModal.innerHTML = `<a class="modalClose" href="#">cerrar</a><h2>Compra finalizada</h2>`;
      localStorage.clear();
      modalEvent();
      eventoRemove();
      cantidadCarrito.innerHTML = 0;
      Toastify({
        text: `Gracias por su compra`,
        duration: 3000,
        gravity: "bottom",
        className: "info",
        style: {
          background: "linear-gradient(75deg, #511d47 35%, #ffcb3a)",
        },
        offset: {
          x: "2em",
          y: "10em",
        },
      }).showToast();
    });
  }
}

function envioCompra() {
  const envio = document.getElementById("envio");
  envio.addEventListener("click", function () {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then((respuesta) => {
        return respuesta.json();
      })
      .then((datos) => {
        contentModal.innerHTML = `
               <div class="flexModal">
                 <h3 class="titleModalBook">Información del envío</h3>
                 <select id="provFiltro"></select> 
                 <select id="munFiltro"></select>
                <button id="compraEnvio" class="comprar">Finalizar Compra</button>    
              </div>
                `;
        const provFiltro = document.getElementById("provFiltro");
        for (const provincia of datos.provincias) {
          provFiltro.innerHTML += `<option value="${provincia.id}">${provincia.nombre}</option>`;
        }
        provFiltro.onchange = () => {
          let idProvincia = provFiltro.value;
          let rutaBusqueda = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${idProvincia}&campos=id,nombre&max=100`;
          fetch(rutaBusqueda)
            .then((respuesta) => respuesta.json())
            .then((dato) => {
              let munFiltro = document.getElementById("munFiltro");
              for (const municipio of dato.municipios) {
                munFiltro.innerHTML += `<option value="${municipio.id}">${municipio.nombre}</option>`;
              }
              document.getElementById("compraEnvio").onclick = () => {
                fetch("https://jsonplaceholder.typicode.com/posts", {
                  method: "POST",
                  body: JSON.stringify({
                    carrito: carrito,
                    idProvincia: idProvincia,
                    idMunicipio: munFiltro.value,
                  }),
                  headers: {
                    "Content-type": "application/json; charset=UTF-8",
                  },
                })
                  .then((respuesta) => respuesta.json())
                  .then((data) => {
                    contentModal.innerHTML = `<h2>Compra Finalizada</h2> <a class="modalClose" href="#">cerrar</a>`;
                    modalEvent();
                    cantidadCarrito.innerHTML = 0;
                  });
                localStorage.clear();
              };
            });
        };
      })
      .catch((mensaje) => {
        console.log(mensaje);
      });
  });
}
