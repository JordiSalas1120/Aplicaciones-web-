const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const listarCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

CargarEvenListeners();
function CargarEvenListeners(){
    //Cuando se agregue un curso "agregar carrito"
    listarCursos.addEventListener('click', agregarCursos);
    //para eliminar articulo del carrito
    carrito.addEventListener('click', borrarCurso);

    vaciarCarrito.addEventListener('click', limpiarHTML)

    //cargar carrito con el storage al estar listo el dom
    document.addEventListener('DOMContentLoaded', ()=> {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTLM();0
    } )


}

function agregarCursos(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const contenidoCurso = e.target.parentElement.parentElement;//le pasamos todo el divcomo haciendo una copia para hacer el html en el carrito
        //console.log(e.target.parentElement.parentElement)
        leerDatos(contenidoCurso);
    }
}

function borrarCurso(e){
    //console.log(e.target.classList)
    e.preventDefault();
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id')
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId)
        console.log(articulosCarrito)
        carritoHTLM();
    }
}


function leerDatos(curso){

    //crear un objeto en el cual se almacen los datos
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    //agregar articulos en el carrito
    //articulosCarrito = [...articulosCarrito, infoCurso]//usamos el sprade operator para que se cargue lo anteriror en el array cada que coloquemos nuevo objeto sino se pert¡deria guardando solo el que se agruego
    
    //verificamos si esta duplicado
    if(articulosCarrito.some( curso => curso.id === infoCurso.id)){
        //reccorremos el objeto y verificamos si existe el elemento
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso
            }else{
                return curso;
            }
        });
        articulosCarrito = [...cursos]
        console.log(articulosCarrito)
    }else{
        articulosCarrito = [...articulosCarrito, infoCurso]
    }
    //reccorremos el objeto y verificamos si existe el elemento
    //if(existe){
        //actualizamos la cantidad
        //const cursos = articulosCarrito.map( curso => {
            //if(curso.id === infoCurso.id){
                //curso.cantidad++;
                //return curso;
            //}else{
                //return curso;
            //}
        //});
        //articulosCarrito = [...cursos];
    //}else{
        //articulosCarrito = [...articulosCarrito, infoCurso] 
    //}
    
    console.log(articulosCarrito)
    carritoHTLM();
    
}

function carritoHTLM(){
    //limpiar el html
    limpiarHTML();

    //recorre el carrito y genera el html
    articulosCarrito.forEach( curso => {
        //creamos el html
            const {imagen, titulo, precio, cantidad, id} = curso;//aplicando destruturing en un objeto. llamamos al objeto al mismo rato que creamos la variable 
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${imagen}" width="100">
                </td>
                <td>${titulo}</td>
                <td>${precio}</td>
                <td>${cantidad}</td>
                <td>
                    <a href="#" class="borrar-curso" data-id="${id}">x</a>
                </td>
                
            
            `;
            //agregamos el html creado en el tbody
            contenedorCarrito.appendChild(row);
    });
    sincronizarStorage();
}
//funcion que agrefue al storage el carrito
function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}
function limpiarHTML(){
    //forma lenta de limpiar
    //contenedorCarrito.innerHTML = '';
    //mejor performance
    while(contenedorCarrito.firstChild){//preguntamos si tiene hijos, siempre y cuando tenga se ejecutara  y limpiara
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);//le indicamos que elimine el primer hijo

    }
}