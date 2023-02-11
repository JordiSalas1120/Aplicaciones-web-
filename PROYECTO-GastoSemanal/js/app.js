//variables y selectores 
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//eventos
eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto );
    formulario.addEventListener('submit', agregandoGasto)
}

//clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos=[...this.gastos, gasto];
        this.calcularRestante();//asi se llama cada que se agregue un gasto
        
        

        
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);//array method, leer mejor su doc
        this.restante = this.presupuesto - gastado
        console.log(this.restante)
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.calcularRestante();
         
    }

}
class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }
    imprimirMensaje(mensaje, tipo){
        //vreamos el div del mensaje
        const div = document.createElement('div');
        div.classList.add('text-center', 'alert');
        if(tipo == 'error'){
            div.classList.add('alert-danger')
        }else{
            div.classList.add('alert-success')
        }
        //agragndo mensaje al div
        div.textContent =  mensaje;
        //agregamos  el HTML
        document.querySelector('.primario').insertBefore(div, formulario);
        //temporalizador para eliminar mensaje
        setTimeout(() => {
            div.remove();
        }, 3000);
    }
    mostrarGastos(gastos){
        
       this.limpiarHtml();
        //iterrar sobre gastos 
        gastos.forEach(gasto => {
            
            const liGasto = document.createElement('li');
            const { nombre , cantidad, id } = gasto;
            //creando el li
            liGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            liGasto.dataset.id = id;//con esto colocamos el atributo data-id y lepasamos el id de cada objeto

            //imprimir en el html
            if(nombre && cantidad){
                liGasto.innerHTML = `
                ${nombre}: <span class="badge badge-pill badge-primary">$${cantidad}</span> `;
            }

            //boton para eliminar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = `Borrar &times;`//para colocar una x y usamos inner porque texcontent no aplica en este caso
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            liGasto.appendChild(btnBorrar);
            //div.textContent = nombre, cantidad;
            gastoListado.appendChild(liGasto);
            
        });
    }
    limpiarHtml(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }
    comprobarPresupuesto(presupuestoObj){
        const { presupuesto, restante} = presupuestoObj; //nombre del parametro difernete sino causa error porque ya hay una variable con ese nombre
        const restanteDiv = document.querySelector('.restante');
        if((presupuesto / 4)>restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto / 2 )> restante){
            restanteDiv.classList.remove('alert-success','alert-danger');
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //comprobamos si es menor a cero para mandar un mensaje
        if (restante <= 0){
            ui.imprimirMensaje('Se ha quedado sin presupuesto');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }

    }


}
const ui = new UI();

let presupuesto;//creamos variable porque si instanciamos aqui no habria que valor pasarle a la clase como presupuesto

//funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("Cual es tu presupuesto?");
    if(presupuestoUsuario ===   '' || presupuestoUsuario === null || isNaN(presupuestoUsuario)||presupuestoUsuario<=0){//isNaN es una funcin que convierte a Number y retorna un bool si es string o no
        window.location.reload();
    //reload es una funcion que recarga la pagina
    }
    //instanciando la clase Presupuesto
    presupuesto = new Presupuesto (presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);

}

//funcion para agrgar gastos
function agregandoGasto(e){
    e.preventDefault();//ya que estamos recibiendo el valor del submit

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    if(cantidad == ''|| nombre == ''){
        ui.imprimirMensaje('Ambos campos son necesarios', 'error')
    }else if(cantidad < 1 || isNaN(cantidad)){
        ui.imprimirMensaje('La cantidad debe ser mayor a 0','error')
    }
    //aplicamos object lietal(contrario dde destructuring) para extraer los valores
    const gasto = { nombre, cantidad, id: Date.now() };//date now poeque en un proyecto grande seria el id de una base de datos
    
    
    //agregar nuevo gasto
    presupuesto.nuevoGasto(gasto);
    //imprimer alerta de correcto
    ui.imprimirMensaje('El Gasto se agrego correctamente');
    //imprimir llistado de gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    //actualiza el UI del restante
    ui.actualizarRestante(restante);

    //cambiar el color de la caja del restante
    ui.comprobarPresupuesto(presupuesto);
    //reinicia el form
    formulario.reset();

}

function eliminarGasto(id){
    //eliminar objeto
    presupuesto.eliminarGasto(id);

    //eliminar del html
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    //actualiza el UI del restante
    ui.actualizarRestante(restante);

    //cambiar el color de la caja del restante
    ui.comprobarPresupuesto(presupuesto);
}
