function iniciarApp(){
    const selectCategoria = document.querySelector('#categorias')
    const resultado = document.querySelector('#resultado')
    const modal = new bootstrap.Modal('#modal', {})
    const favoritosDiv = document.querySelector('.favoritos')

    if(selectCategoria ){
        selectCategoria.addEventListener('change', seleccionarCategoria)
        function obtenerDatos(){
            const url = 'https://www.themealdb.com/api/json/v1/1/categories.php'
            fetch(url)
                .then(respuesta => respuesta.json())
                .then(datos =>mostrarCategorias(datos.categories)  )
        }
        obtenerDatos()
    }
    
    if(favoritosDiv ){
        obtenerFavoritos()
        
    }
    function obtenerFavoritos(){
        const favorito = JSON.parse(localStorage.getItem('favorito')) ?? [];
        if(favorito.length){
            mostrarRecetas(favorito);
            return
        }
        const noFavorito = document.createElement('p');
        noFavorito.classList.add('fs-4', 'text-center','font-bold', 'mt-5');
        noFavorito.textContent = 'Aun no hay favoritos';
        favoritosDiv.appendChild(noFavorito);
    }

    function mostrarCategorias(categorias = []){
        categorias.forEach(categoria =>{
            const option = document.createElement('OPTION')
            option.value = categoria.strCategory;
            option.textContent = categoria.strCategory;
            
            selectCategoria.appendChild(option)
        })
    }
    function seleccionarCategoria(e){
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetas(resultado.meals))
    }
    
    function mostrarRecetas(recetas=[]){
        limpiarHtml(resultado);
        recetas.forEach( receta => {
            //scripting
            const { idMeal, strMeal, strMealThumb } = receta
            const recetaConte = document.createElement('div');
            recetaConte.classList.add('col-md-4');

            const card = document.createElement('div');
            card.classList.add('card', 'mb-4');

            const img = document.createElement('img');
            img.classList.add('card-img-top');
            img.alt = `Imagen del platillo ${strMeal ?? receta.titulo}`;
            img.src = strMealThumb ?? receta.img;
            
            const recetaCArdBody = document.createElement('div');
            recetaCArdBody.classList.add('card-body');

            const recetaHeding = document.createElement('h3');
            recetaHeding.classList.add('card-title', 'mb-3');
            recetaHeding.textContent = strMeal ?? receta.titulo;

            const rectaBtn = document.createElement('button');
            rectaBtn.classList.add ('btn', 'btn-danger', 'w-100');
            rectaBtn.textContent ='Ver Receta';
            //conectar el boton con el modal de boodstrap que ya esta implementada en el js de bood
           /* rectaBtn.dataset.bsTarget = '#modal';
            rectaBtn.dataset.bsToggle = 'modal';*/

            rectaBtn.onclick = () => seleccionarReceta(idMeal ?? receta.id);
            
            //inyectar al html

            recetaCArdBody.appendChild(recetaHeding);
            recetaCArdBody.appendChild(rectaBtn);

            card.appendChild(img);
            card.appendChild(recetaCArdBody);
            
            recetaConte.appendChild(card)

            resultado.appendChild(recetaConte);

        })
    }
    //obtenemos la receta para colocarla en el modal utilizando la id
    function seleccionarReceta(id){
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(receta => mostrarRecetaModal(receta.meals[0]))
    }
    function mostrarRecetaModal(receta){
        console.log(receta);
        const { idMeal, strMeal, strInstructions, strMealThumb } = receta
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        const modalFooter =  document.querySelector('.modal-footer');
        limpiarHtml(modalFooter)
        const guardarBtn = document.createElement('button');
        guardarBtn.classList.add('btn', 'btn-danger', 'col');
        guardarBtn.textContent = existeStorage(idMeal) ? 'Eliminar Favorito' : 'Guardar Favorito';

        guardarBtn.onclick = ()=>{

            if(existeStorage(idMeal)){
                eliminarStorage(idMeal);
                guardarBtn.textContent = 'Guardar Favorito'
                mostrarToast('Se ha eliminado Correctamente')
                return
            }
            agregarFavorito({
                id: idMeal,
                Titulo: strMeal,
                img: strMealThumb
            })
            guardarBtn.textContent = 'Eliminar Favorito'
            mostrarToast('Se ha guardado Correctamente')
        }

      
        const cerrarBtn = document.createElement('button');
        cerrarBtn.classList.add('btn', 'btn-secondary', 'col');
        cerrarBtn.textContent = 'Cerrar'
        cerrarBtn.onclick =() => modal.hide();

        modalFooter.appendChild(guardarBtn);
        modalFooter.appendChild(cerrarBtn);

       
        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal} "/>
            <h3 class="my-3">Instrucciones</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredientes y Cantidades</h3>
        `
        //iterar los ingedientes y cantidades
        const listgroup = document.createElement('ul');
        listgroup.classList.add('list-group')
        for(let i = 1; i <= 20; i++){
            if(receta[`strIngredient${i}`]){
                const ingredientes = receta[`strIngredient${i}`];
                const cantidades = receta[`strMeasure${i}`];
                const ingredienteli = document.createElement('li');
                ingredienteli.classList.add('list-group-item')
                ingredienteli.textContent = `Ingredientes: ${ingredientes} - ${cantidades}`;
                listgroup.appendChild(ingredienteli);
            }

        }
        modalBody.appendChild(listgroup)
        
        //show y hide son metodos de bootstrap para mostar u ocultar el modal
        modal.show();
       
        
    }
    function agregarFavorito(receta){
        //como es un obj para lllevarlo a arreglo usamos json.parse
        // los ?? son el operador llamado nullish coalescing que verifica si el lado izquierdo se cumple, si marca undifined o null  aplica el derecho
        const favorito = JSON.parse(localStorage.getItem('favorito')) ?? []; //devuelve un obj
        localStorage.setItem('favorito', JSON.stringify([...favorito, receta])) //devuelve una cadena
    }
    function existeStorage(id){
        const favorito = JSON.parse(localStorage.getItem('favorito')) ?? [];// ya se creo ahora se cumple lo izquierdo
        return favorito.some(favorit => favorit.id === id)//some itera y devuelve un true con tal que un elemento cumpla la codicion
    }
    function eliminarStorage(id){
        const favorito = JSON.parse(localStorage.getItem('favorito')) ?? [];
        const nuevoFavorito = favorito.filter(favo => favo.id !== id);
        localStorage.setItem('favorito',JSON.stringify(nuevoFavorito));
    }
    function mostrarToast(mensaje){
        const toastDiv = document.querySelector('#toast')
        const toastBody = document.querySelector('.toast-body')
        const toast = new bootstrap.Toast(toastDiv);
        toastBody.textContent = mensaje;
        toast.show()
    }
    function limpiarHtml(selector){
        while(selector.firstChild){
            selector.removeChild(selector.firstChild);
        }
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp);