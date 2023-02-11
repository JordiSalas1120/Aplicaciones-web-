(function(){
    let DB;
    let clienteId;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');
     formulario.addEventListener('submit', actualizarDatos);

    document.addEventListener('DOMContentLoaded', () =>{
        conectarDB()
        //obtenemos los parametros de la url URLSearchParams es un api la cual nos ayuda con eso
        const parametroURL =  new URLSearchParams(window.location.search);
        //con get obtenemos el valor del id de la url con window location
        clienteId = parametroURL.get('id');
        if(clienteId){
            setTimeout(() => {
                obtenerCliente(clienteId)//pasamos de parametro el id de la url
            }, 300);
            
        }
    });
    function actualizarDatos(e){
        e.preventDefault();
        console.log('se actualizarDatos')
        if(nombreInput.value === '' || emailInput.value ==='' || telefonoInput.value ==='' || empresaInput.value ===''){
            imprimirMensaje('No puede haber un campo vacio', 'error');
            return
        }
        //actualizar datos con un objectlioteral
        
        const clienteActualizado = {
            nombre:nombreInput.value,
            email:emailInput.value,
            telefono:telefonoInput.value,
            empresa:empresaInput.value,
            id: Number(clienteId)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.onerror = () =>{
            imprimirMensaje('no se pudo editar', 'error')
        }
       transaction.oncomplete = () =>{
            imprimirMensaje('se edito correctamente');

        }
        setTimeout(() => {
            window.location.href = 'index.html' 
        }, 1000);
        ;
    }

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'],'readonly');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        
        cliente.onsuccess = (e) =>{
            
            
                const cursor = e.target.result;
                if(cursor){
                    //volvemos a iterar todos si hay al menos uno y cal pasarle de parametro tambien .id comprobamos si es el cliente y asi rellenamos el formulario
                    if (cursor.value.id === Number(id)){
                        llenarFomulario(cursor.value);
                        console.log(cursor.value);
                    }
                    cursor.continue();
                }
        } 
        
    }
    function llenarFomulario(cursor){
        const { nombre, email, telefono, empresa, id } = cursor;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
     
        console.log(nombre);

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
})();