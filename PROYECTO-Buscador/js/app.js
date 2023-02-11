
const marca = document.querySelector('#marca');
const year = document.querySelector('#year');
const minimo = document.querySelector('#minimo');
const maximo = document.querySelector('#maximo');
const puertas = document.querySelector('#puertas');
const transmision = document.querySelector('#transmision');
const color = document.querySelector('#color');

//generador de resultado
const resultado = document.querySelector('#resultado');

const max = new Date().getFullYear();//obtenemos el año actual
const min = max - 10;

//generar objeto
const datosdebusqueda = {
    marca:'',
    year:'',
    minimo:'',
    maximo:'',
    puertas:'',
    transmision:'',
    color:''
}
//eventos
document.addEventListener('DOMContentLoaded', () => {
    mostrarAutos(autos);

    llenarSelect();
})
//eventos selects para llenar el objeto de datos
marca.addEventListener('change',e => {
        datosdebusqueda.marca = e.target.value;
        filtrarAuto()
        
});
year.addEventListener('change',e => {
    datosdebusqueda.year = parseInt(e.target.value);
    filtrarAuto();
});
minimo.addEventListener('change',e => {
    datosdebusqueda.minimo = e.target.value;
    filtrarAuto();
});
maximo.addEventListener('change',e => {
    datosdebusqueda.maximo = e.target.value;
    filtrarAuto();
});
puertas.addEventListener('change',e => {
    datosdebusqueda.puertas= parseInt(e.target.value);
    filtrarAuto();
});
transmision.addEventListener('change',e => {
    datosdebusqueda.transmision = e.target.value;
    filtrarAuto();
});
color.addEventListener('change',e => {
    datosdebusqueda.color = e.target.value;
    filtrarAuto();
    //console.log(datosdebusqueda)
});
//funciones

function mostrarAutos(autos){
    
    limpiarHTML();//para limpiar antes de insertar los resultados
    
    autos.forEach(auto => {
        
        const {marca, modelo, year, puertas, precio, color, transmision} = auto;
        const autoHTML = document.createElement('p');
        autoHTML.textContent =`
            
            ${marca} ${modelo}-${year}-${puertas}Puertas - Transmmision: ${transmision} - Color: ${color} - Precio: ${precio}

        `;
        //insertar el html
        resultado.appendChild(autoHTML)
    });
}
//limpiar el html
function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}
function llenarSelect(){
    for(let i = max; i >= min; i--){
        const opcion = document.createElement('option');
        opcion.value = i;//entrada del option
        opcion.textContent = i;//lo que mostrara
        year.appendChild(opcion);
    }
}
function filtrarAuto(){
    const resultado = autos.filter( filtrarMarca ).filter(filtrarYear).filter(filtrarMinimo).filter( filtrarMaximo ).filter( filtrarPuertas ).filter(filtrarTransmision).filter(filtrarColor);
    if(resultado.length > 0){

        mostrarAutos(resultado);
    }else{
        mensajeError()
    }
    
    console.log(resultado)
}
function filtrarMarca(auto){
    const { marca } = datosdebusqueda;

    if( marca ){
        return auto.marca === marca;
    }
    return auto;
    
}
function filtrarYear(auto){
    const { year } = datosdebusqueda;

    if( year ){
        return auto.year === year;
    }
    return auto;
    
}
function filtrarMinimo(auto){
    const { minimo } = datosdebusqueda;
    console.log(minimo)
    if( minimo ){
        return auto.precio >= minimo; //mayor o igual porque le pasamos los mayores mas el minimo dado, es decir de un minmo en adelante
    }
    return auto;
}

function filtrarMaximo(auto){
    const { maximo } = datosdebusqueda;

    if( maximo ){
        return auto.precio <= maximo;
    }
    return auto;
    
}
function filtrarPuertas(auto){
    const { puertas } = datosdebusqueda;

    if( puertas ){
        return auto.puertas === puertas;
    }
    return auto;
    
}
function filtrarTransmision(auto){
    const { transmision } = datosdebusqueda;

    if( transmision ){
        return auto.transmision === transmision;
    }
    return auto;
}
function filtrarColor(auto){
    const { color } = datosdebusqueda;

    if( color ){
        return auto.color === color;
    }
    return auto;
}

///funcion para mensaje de error
function mensajeError(){
    limpiarHTML()
    console.log('no resultado')
    const noResultado = document.createElement('div')
    noResultado.classList.add('alerta', 'error');
    noResultado.textContent = 'No Hay Resultados'
    resultado.appendChild(noResultado);
    
}