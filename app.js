let fs = require('fs');
var input = require ('input');

async function appDeTareas(){
    const comandoDelUsuario = await input.select('\nHola, soy la App de Tareas! Qué te gustaría hacer?', ['crearTarea','listarTareas','eliminarTarea','actualizarEstado','filtrarTareas']);// Capturamos el comando que el usuario ingresó por consola
    let listarTareasJS = JSON.parse(fs.readFileSync('tareas.json', 'utf-8')); //parseo el archivo al mismo tiempo que lo importo
    switch(comandoDelUsuario) {
        case 'listarTareas':
        console.log('\nEste es el listado de tareas que existen');
        console.log('----------------------------------------');
        for (let i=0;i<listarTareasJS.length;i++){
            console.log((i+1) + '. ' + listarTareasJS[i].titulo + " -- " + listarTareasJS[i].estado);
        }
        break;
        case 'crearTarea':
        const tituloTareaNueva = await input.text('Por favor, ingresa el titulo de la nueva tarea. Por defecto el estado inicial será "pendiente".');  
        let tareaNueva = {
            posicion: listarTareasJS.length+1, //se agregó la propiedad posicion para mejorar el resto de los procesos
            titulo: tituloTareaNueva,
            estado: "pendiente",
        }
        listarTareasJS.push(tareaNueva);
        fs.writeFileSync('./tareas.json', JSON.stringify(listarTareasJS, null, 2));
        console.log ('Se ha creado una nueva tarea');
        break;
        case 'eliminarTarea': //ahora elimina tareas por posicion
        const tareaAEliminar = await input.text('Indica la posición de la tarea que quieres eliminar:');  
        //1. creo un nuevo array filtrando la tarea a eliminar
        let tareasNoEliminadas= listarTareasJS.filter(function(elemento){ 
            return tareaAEliminar != elemento.posicion
        });
        //2. actualizo las posiciones de las tareas restantes
        let tareasMapeadas= tareasNoEliminadas.map(function(elemento,indice){ 
            return {
                posicion: indice+1,
                titulo: elemento.titulo,
                estado: elemento.estado,
            }
        });
        //3. sobreescribo el archivo con las tareas que no fueron eliminadas
        fs.writeFileSync('./tareas.json', JSON.stringify(tareasMapeadas, null, 2)); 
        console.log ('Se ha eliminado la tarea');
        break;
        case 'actualizarEstado': //ahora actualiza el estado por la posicion de la tarea
        const posicionTarea = await input.text('Indica la posición de la tarea que quieres actualizar:');  
        const estadoNuevo = await input.text('Indica el nuevo estado:');  
        let estadoAnterior = listarTareasJS[(posicionTarea-1)].estado;
        listarTareasJS[(posicionTarea-1)].estado = estadoNuevo;
        fs.writeFileSync('./tareas.json', JSON.stringify(listarTareasJS, null, 2));
        console.log("Estado: " + estadoAnterior + ", actualizado a: "+ estadoNuevo);
        break;
        case 'filtrarTareas': //por estado
        const estadoFiltrado = await input.text('Indica el estado de las tareas que deseas filtrar:');
        //filtra las tareas por el estado solicitado
        let tareasFiltradas = listarTareasJS.filter(function(elemento){
            return estadoFiltrado == elemento.estado
        });
        if (tareasFiltradas.length == 0){
            console.log("No existen tareas con ese estado")
        } else {
            console.log('\nEste es el listado de tareas con estado: '+ estadoFiltrado); 
            console.log('-----------------------------------------------------------');
            for (let i=0;i<tareasFiltradas.length;i++){
                console.log( tareasFiltradas[i].posicion+ '. ' + tareasFiltradas[i].titulo); //ahora se respetan las posiciones originales
            }
        }
        break;
        case 'help':  // Para cuando pone una accion que no tenemos registrada...    
        console.log('Ingresa alguno de los siguientes comandos:');
        console.log('-------------------------------------');
        console.log('• listarTareas --> Para listar todas las tareas y sus estados.');
        console.log('• crearTarea "titulo" "estado"--> Para crear una nueva tarea.');
        console.log('• eliminarTarea "posicion"--> Para eliminar una tarea.');
        console.log('• actualizarEstado "posicion" "nuevo estado"--> Para actualizar el estado de una tarea existente.');
        console.log('• filtrarTareas "estado"--> Para filtrar tareas por sus estados.');
        break;
    }
}

appDeTareas();