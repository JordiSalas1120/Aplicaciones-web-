const btnEnviar = document.querySelector('#enviar')
const reset = document.querySelector('#resetBtn');
const formulario = document.querySelector('#enviar-mail')

//variables del formulario
const mail = document.querySelector('#email');
const asunto = document.querySelector('#asunto');
const mensaje = document.querySelector('#mensaje');

const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


cargarEventos();
function cargarEventos(){
    //cuando el app arranca
    document.addEventListener('DOMContentLoaded', iniciarApp);

    //campos del formulario
    mail.addEventListener('blur', validarForm)
    mensaje.addEventListener('blur', validarForm)
    asunto.addEventListener('blur', validarForm)
    //resetear formulario con boton
    reset.addEventListener('click', resetearForm)

    //enviar Formulario
    formulario.addEventListener('submit', enviarEmail)
    
    
}

//funciones

function iniciarApp(){
    btnEnviar.disabled = true;
    btnEnviar.classList.add('cursor-not-allowed', 'opacity-50')
    validarForm
}

function validarForm(e){
    
    if(e.target.value.length > 0){
         //eliminar errores
        const error = document.querySelector('p.error');
        if(error){
            error.remove()

        }
        e.target.classList.remove('border', 'border-red-500');
        e.target.classList.add('border', 'border-green-500');
    }else{
        e.target.classList.remove('border', 'border-green-500');
        e.target.classList.add('border', 'border-red-500');
        mostrarError('Todos los campos son obligatorios')
    }
    if(e.target.type === 'email'){
        

        //const resultado = e.target.value.indexOf('@');
        if(er.test(e.target.value)){//expresion regular(buscar un patron y que se cumpla)
            const error = document.querySelector('p.error');
            if(error){
                error.remove()

            }
            e.target.classList.remove('border', 'border-red-500');
            e.target.classList.add('border', 'border-green-500');
        }else{
            e.target.classList.remove('border', 'border-green-500');
            e.target.classList.add('border', 'border-red-500');
            
                mostrarError('El mail no es valido')
            
        }
    }
    if (er.test(mail.value) && asunto.value !== '' && mensaje.value !== '' ){
        btnEnviar.disabled = false;
        btnEnviar.classList.remove('cursor-not-allowed', 'opacity-50')
    }
    
}

function mostrarError(mensaje){
    const mensajeError = document.createElement('p');
    mensajeError.textContent = mensaje;
    mensajeError.classList.add('border', 'border-red-500', 'background-red-100', 'text-red-500', 'p-3', 'm-6', 'text-center', 'error')
    const error = document.querySelectorAll('.error')

    if(error.length === 0){
        formulario.appendChild(mensajeError)
    }else{
    
    }
}
function resetearForm(e) {
    if(e.target.classList.contains('reset')){
        formulario.reset();
        e.preventDefault()
        console.log('reseteando')
    }
    iniciarApp()
}

function enviarEmail(e){
    e.preventDefault()
    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'flex';
    //despues de 3 segundos desaparecer el spinner y mostrar mensaje
    setTimeout(() => {
        spinner.style.display = 'none';
        
        //crear mensaje de  enviado
        const parrafo = document.createElement('p');
        parrafo.textContent = 'Datos Enviados Exitosamente';
        parrafo.classList.add('bg-green-500', 'text-center', 'p-2', 'text-white', 'font-bold' ,'uppercase', 'my-10')
        formulario.insertBefore(parrafo, spinner);
        setTimeout(() => {
            parrafo.remove();
            formulario.reset()
            iniciarApp()
        }, 5000);
        

    }, 3000);
}
