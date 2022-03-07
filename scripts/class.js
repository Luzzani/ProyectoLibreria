class Libro {
    constructor(nombre, autor, sinopsis, precio, id, ventas, img, tag, cantidad){
        this.nombre = nombre;
        this.autor = autor;
        this.sinopsis = sinopsis;
        this.precio = precio;
        this.id = id;
        this.ventas = ventas;
        this.img = img;
        this.tag = tag;
        this.cantidad = cantidad || 1;
    }
    addCantidad(){
        this.cantidad++;
    }
    removeCantidad(){
        this.cantidad--;
    }
    subTotal(){
        return this.precio * this.cantidad;
    }
}
