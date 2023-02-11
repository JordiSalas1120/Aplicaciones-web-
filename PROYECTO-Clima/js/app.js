const contenedor = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load',()=>{
    formulario.addEventListener('submit', buscarClima);

});

function buscarClima(e){
    e.preventDefault();
    //validar el formulario
    //#ciudad
    //#pais
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;
    limpiarHtml()
    if(ciudad == '' || pais == ''){
        mostrarError('Todos los campos son necesarios');
        return;
    }
    //consultaremos a la API   
    consultarApi(ciudad, pais);

}

function consultarApi(ciudad,pais){
    const appId = '44b30d6b5d77156915ca221a0fcdf628';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    fetch(url)
        .then(respuesta => respuesta.json())

        .then(datos => {
            limpiarHtml()
            if(datos.cod === '404'){
                mostrarError('Debes introducir una ciudad y pais valido');
                return
            }
            const clima = datos.main;
            const name = datos.name;
            mostrarClima(clima, name);
        })
}
function mostrarClima(clima, name){
    const { temp, temp_max, temp_min }= clima;
    const tempC = kelvinCelcius(temp);
    const tempMmax = kelvinCelcius(temp_max);
    const tempMin = kelvinCelcius( temp_min);

    const nombreCiudad = document.createElement('p')
    nombreCiudad.innerHTML = `${name}`
    nombreCiudad.classList.add('text-center','font-bold','text-xl');

    const actual = document.createElement('p')

    actual.innerHTML = `${tempC} &#8451`
    actual.classList.add('text-center','font-bold','text-6xl');

    const max = document.createElement('p');
    max.innerHTML = `Max: ${tempMmax} &#8451`
    max.classList.add('text-center','font-bold','text-xl');

    const min = document.createElement('p');
    min.innerHTML = `Min: ${tempMin} &#8451`
    min.classList.add('text-center','font-bold','text-xl');

    resultado.appendChild(nombreCiudad)
    resultado.appendChild(actual);
    resultado.appendChild(max);
    resultado.appendChild(min);
    resultado.classList.add('text-white')


}

const kelvinCelcius = (grados) => parseInt(grados -273.15);

function limpiarHtml(){
    while(resultado.firstChild){
            resultado.removeChild(resultado.firstChild)
    }
}
function mostrarError(mensaje){
    const alerta = document.querySelector('.border-red-700');
    if (!alerta){
        const divError = document.createElement('div');
    divError.classList.add('bg-white','p-3','border-red-700','border-2', 'text-center', 'border-solid', 'm-2','text-base','uppercase');
    divError.innerHTML = `
        <span class="font-bold">!Error</span>
        <p>${mensaje}</p>
    `
    
    formulario.appendChild(divError);
    setTimeout(() => {
        divError.remove();
    }, 4000);
    }
    
}