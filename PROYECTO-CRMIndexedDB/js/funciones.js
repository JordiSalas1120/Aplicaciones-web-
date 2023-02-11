function imprimirMensaje(mensaje, tipo){
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('px-4', 'py-3','rounded','max-w-lg', 'mx-auto','mt-6', 'text-center', 'border', 'alerta');
    if(tipo == 'error'){
        divMensaje.classList.add('bg-red-200', 'border-red-400', 'text-red-700');
    }else{
        divMensaje.classList.add('bg-green-200', 'border-green-400', 'text-green-700');
    }
    divMensaje.textContent = mensaje;
    
    formulario.appendChild(divMensaje);
    setTimeout(() => {
        divMensaje.remove();
    }, 4000);

}
function conectarDB(){
    const abrirConexion = window.indexedDB.open('crm',2)
    abrirConexion.onerror= function(){
        console.log('algo salio mal')
        imprimirMensaje('No se conecto a la DB','error')
    }
    abrirConexion.onsuccess =function(){
        console.log('se conecto a la db.......')
        
        DB = abrirConexion.result;
        console.log(abrirConexion.result);
    }
}