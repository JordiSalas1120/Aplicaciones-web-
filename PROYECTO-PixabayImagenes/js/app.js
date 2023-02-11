const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario')
const paginacion = document.querySelector('#paginacion')

let totalPaginas;
let paginaActual = 1;
const totalporpagina = 40;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();
    const nuevoTermino = document.querySelector('#termino').value;
    if (nuevoTermino ===''){
        mostrarAlerta('Coloque un termino correcto para buscar');
        return
    }
    obtenerDatos();
}
function mostrarAlerta(mensaje){
    const verif = document.querySelector('.border-red-700');
    if(!verif){
        const alertaDiv = document.createElement('div');
    alertaDiv.classList.add('rounded','border-2', 'border-red-700', 'border','text-center','bg-white', 'p-3','max-w-lg','mx-auto', 'mt-6');
    alertaDiv.innerHTML = `
        <strong class="font-bold">ERROR!</strong>
        <span class="block sm:inline">${mensaje}</span>
    `
    resultado.appendChild(alertaDiv);
    setTimeout(() => {
            alertaDiv.remove();
    }, 4000);
    }
    
}

function  obtenerDatos(){
    const termino = document.querySelector('#termino').value;
    const key = '33466587-8179e2fd9d4c946dc97f649d6';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${totalporpagina}&page=${paginaActual}`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            totalPaginas = calcularTotalPaginas(datos.totalHits)
            mostrarDatos(datos.hits)
            
            
            
        }
        )
    
}
function calcularTotalPaginas(total){
    return parseInt(Math.ceil(total/totalporpagina))
}

function *generadorPaginas(total){
    
    for(let i = 1; i <= total ; i++ ) {
        yield i; //con yield estamos tomando ese valor que iteramos
    }
}
function mostrarDatos(datos){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
    datos.forEach(dato => {
     
        //+= concatena cada tarjeta creado en el iner en el resultado
        //con _blank hacemos que abra la img en otra ventana, pero como tiene problemas de seguridad se usan los siguientes atributos:rel="noopener noreferrer"

        const { largeImageURL, previewURL, likes, views } = dato;
        
        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${previewURL}"/>
                <div class="p-4">
                    <p class="font-bold">${likes} <span class="font-light">Likes</span> </p>
                    <p class="font-bold">${views} <span class="font-light">Views</span> </p>
                    <a class="block w-full uppercase font-bold bg-blue-800 hover:bg-blue-500 text-white text-center p-1 mt-5 rounded"
                    target="_blank" rel="noopener noreferrer" href="${largeImageURL}">Ver Imagen</a>
                </div>
            </div>
        </div>
        `
        
    });
    imprimirIterador()
    
}

function imprimirIterador(){
    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild)
    }
    const iterador = generadorPaginas(totalPaginas);
    while(true){
        const { value, done } = iterador.next(); 
        if(done) return
        const botonDiv = document.createElement('a');
            botonDiv.textContent = value;
            botonDiv.href ='#'
            botonDiv.dataset.pagina = value;
            botonDiv.classList.add('siguiente', 'bg-yellow-400', 'px-4','py-1','mr-2','font-bold','mb-1','rounded')

            paginacion.appendChild(botonDiv)
            botonDiv.onclick = ()=>{
                paginaActual = value;
                obtenerDatos();
            }
    }
}