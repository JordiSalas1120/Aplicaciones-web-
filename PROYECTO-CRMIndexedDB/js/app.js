//creamos base de datos en una IIFE
(function(){
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes')
    document.addEventListener('DOMContentLoaded', ()=>{
       crearDB(); 
       if(window.indexedDB.open('crm',2)){
        obtenerClientes();
       }
       listadoClientes.addEventListener('click', eliminarRegistro)
    });
    function eliminarRegistro(e){
        e.preventDefault();
        

        if(e.target.classList.contains('eliminar')){
            const clienteId = Number(e.target.dataset.cliente);
            const confirmar = confirm('Quiere eliminar registro?');
            if(confirmar){
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');
             
                objectStore.delete(clienteId);
                transaction.oncomplete = ()=>{
                    console.log('Cliente eliminado')
                    e.target.parentElement.parentElement.remove();
                }
                transaction.onerror = ()=>{
                    console.log('hubo un error y no se elimino','error')
                }
            }
             
        }
        
    }
    function crearDB(){
        const crearDB = window.indexedDB.open('crm',2);
        crearDB.onerror = ()=>{
            console.log('No se creo la db')
        }
        crearDB.onsuccess = () =>{
            console.log('la db se ha creado correctamente')
            //cuando se cree correctamente le pasamos el valor a la let DB
            DB = crearDB.result;
        }
        crearDB.onupgradeneeded =function(e) {
            const db = e.target.result;
            console.log(db);

            const objectStore = db.createObjectStore('crm',{
                keyPath: 'id',
                autoIncrement: true
            });
            objectStore.createIndex('nombre','nombre', {unique:false});
            objectStore.createIndex('email','email', {unique:true});
            objectStore.createIndex('telefono','telefono', {unique:false});
            objectStore.createIndex('empresa','empresa', {unique:false});
            objectStore.createIndex('id','id', {unique:true});
           
        }
    }
    function obtenerClientes(){
        
        const conexion = window.indexedDB.open('crm',2);

        conexion.onerror =() =>{
            console.log('algo salio mal');
        }

        conexion.onsuccess = () =>{
            console.log('obteniendo los clientes');
            DB = conexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');
            console.log(objectStore);
            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;
                

                if(cursor){
                    const { nombre, email, telefono, empresa, id } = cursor.value;
                    console.log(id)
                    const listClientes = document.querySelector('#listado-clientes');
                    listClientes.innerHTML += ` <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                    `;
                    //el  signo ? en el enlace de arriba es un query string, forma de pasar un parametro a una url
                    cursor.continue();
                }else{

                }

                
            }
        }

    }
})()