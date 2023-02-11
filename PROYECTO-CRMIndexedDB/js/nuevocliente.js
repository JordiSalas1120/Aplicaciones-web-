(function(){
    const formulario = document.querySelector('#formulario')
    let DB;

    document.addEventListener('DOMContentLoaded',() => {
        conectarDB();
        formulario.addEventListener('submit', validarForm);
    });
   

    
    function validarForm(e){
        e.preventDefault();
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;
        if(nombre =='' ||email ==''||telefono =='' || empresa ==''){
            console.log('todos los campos son necesarios');
            imprimirMensaje('Todos los campos son necesarios', 'error');
        }
        //creamos un object literal para lenar datos en vez de extraer con destructuring
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        }
        cliente.id = Date.now();//damos un id del tiempo donde se creo
        console.log(cliente);
        crearCliente(cliente);
    }

    function crearCliente(cliente){
        console.log(DB);
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        // console.log(objectStore);

        objectStore.add(cliente);

        transaction.onerror = () => {
            imprimirMensaje('Algo salio mal', 'error');
        }
        transaction.oncomplete =()=>{
            imprimirMensaje('Se registo el cliente correctamente')
            setTimeout(() => {
                window.location.href = 'index.html'
            }, 3000);
        }
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
})()