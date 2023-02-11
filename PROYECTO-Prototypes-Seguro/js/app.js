
//constructores

function Seguro (marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro =  function () {
        /*
            1 = americano 1.15
            2 = asiatico 1.05
            3 = europeo 1.35
     */
    const base = 2000;
    let cantidad;

    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            
            break;
        case '2':
            cantidad = base * 1.05;
            
            break;
        case '3':
            cantidad = base * 1.35;
            
            break;
        
    }
    //sacamos la diferncia de años
    const diferencia = new Date().getFullYear() - this.year;
    //por cada año se le reduce un 3% al seguro del auto
    cantidad -= ((diferencia * 3) * cantidad) / 100;
    
    /*
            Si el seguro es básico se múltiplica por 30% mas
            Si el seguro es completo 50% mas
     */
    if (this.tipo === 'basico') {
        cantidad *= 1.3;
    } else {
        cantidad *= 1.5;
    }
    console.log(cantidad)
    return cantidad;
    
}
function UI(){}

//llenar opciones de los años 
UI.prototype.llenarCampos = () =>{
    const max = new Date().getFullYear(),//conseguimos el año actual
        min = max - 20; //el minimos de años

    const selectYear = document.querySelector('#year');
    
    for (let i = max; i > min; i--) {
        let option = document.createElement('option')//en el select hay opciones por ende un option
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option)
    }

}

UI.prototype.mostrarMensaje = (mensaje, tipo) =>{
    const div = document.createElement('div');
    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto')
    }
    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    //insertar en el HTML
    const form = document.querySelector('#cotizar-seguro');
    form.insertBefore(div, document.querySelector('#resultado'));//insertamos el mensaje(div) antes del id resultado
    //se elimina el mensaje a los tres segundos
    setTimeout(() => {
        div.remove();
    }, 3000);
    
}

UI.prototype.mostrarResultado =  (seguro, total) => {
    const {marca, year, tipo} = seguro;
    const div = document.createElement('div');
    div.classList.add('mt-10');
    div.innerHTML = `
        <p class="header">Tu Total</p>
        <p class="font-bold">Marca:<span class="font-normal"> ${marca} </span> </p>
        <p class="font-bold">Año:<span class="font-normal"> ${year} </span> </p>
        <p class="font-bold">Tipo:<span class="font-normal capitalize"> ${tipo} </span> </p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span> </p>
        
    `;
    const resultadoDiv = document.querySelector('#resultado');
    

    //mostramos el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    //ocultamos spinner despues de los 3 seg
    setTimeout(() => {
        spinner.style.display = 'none'
        resultadoDiv.appendChild(div);//pasado los 3 seg donde el spinner se esconde, mostramos el resultado
    }, 3000);
}
//instanciamos ui
const ui = new UI();
//recomendacion: usar prototypes para objetos que se crean como seguro y ui. Si los usamos en funciones como en en la de eventos que se trata de los selectores es inesesario ya que agregaria complegidad en vano


document.addEventListener('DOMContentLoaded', () =>{
    ui.llenarCampos();
})
eventListener()
function eventListener(){
    const form = document.querySelector('#cotizar-seguro');
    form.addEventListener('submit', validarForm);

}

function validarForm(e){
    e.preventDefault()
    
    //leer la marca
    const marca = document.querySelector('#marca').value;

    //leer el año
    const year = document.querySelector('#year').value;

    //leer tipo 
    const tipo = document.querySelector('input[name="tipo"]').value;

    if (marca === "" || year === "" || tipo === "") {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error')
        return;
    } 
        ui.mostrarMensaje('Cotizando...', ('correcto'))
    
        //eliminamos cotizacion previa
        const resultado = document.querySelector('#resultado div');
        if(resultado != null){
            resultado.remove()
        };
        //instanciar el seguro
        const seguro = new Seguro(marca, year, tipo);
        const total = seguro.cotizarSeguro();

        //mostrar resultado
        ui.mostrarResultado(seguro, total)
}