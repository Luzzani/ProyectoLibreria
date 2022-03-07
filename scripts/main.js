// // header toggle
((d) => {
    const $btnMenu = d.querySelector(".btnMenu");
    const $menu = d.querySelector(".menu");
    const $carrito = d.querySelector('#buttonModal');
    $btnMenu.addEventListener("click", (e) => {
      $btnMenu.firstElementChild.classList.toggle("none");
      $btnMenu.lastElementChild.classList.toggle("list");
      $menu.classList.toggle("is-active");
      $carrito.classList.add('none')
    });
  
    d.addEventListener("click", (e) => {
      if (!e.target.matches(".menu a")) return false;
  
      $btnMenu.firstElementChild.classList.remove("none");
      $btnMenu.lastElementChild.classList.add("list");
      $menu.classList.remove("is-active");
      $carrito.classList.remove('none')

    });
  })(document);

  // Libros tomado desde un archivo JSON

  fetch('books/books.json')
    .then(respuesta => respuesta.json())
    .then(datos => {
        for (const literal of datos) {
            listaLibros.push(
                new Libro(
                    literal.nombre,
                    literal.autor,
                    literal.sinopsis,
                    literal.precio,
                    literal.id,
                    literal.ventas,
                    literal.img,
                    literal.tag                
                    )
            )
        }
        librosHTML(listaLibros);
        filtroHTML(listaLibros);
    }).catch(mensaje => console.error(mensaje));


// localStorage 
const guardados = JSON.parse(localStorage.getItem("Carrito")) || [];
for (const literal of guardados) {
  carrito.push(
    new Libro(
      literal.nombre,
      literal.autor,
      literal.sinopsis,
      literal.precio,
      literal.id,
      literal.ventas,
      literal.img,
      literal.tag,
      literal.cantidad
    )
  );
  carritoHTML(carrito);
}