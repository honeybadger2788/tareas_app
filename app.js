
let process = require('process');
let fs = require('fs');

// Capturamos el comando que el usuario ingresó por consola
let comandoDelUsuario = process.argv[2];
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
    let tareaNueva = {
        titulo: process.argv[3],
        estado: process.argv[4],
    }
    listarTareasJS.push(tareaNueva);
    fs.writeFileSync('./tareas.json', JSON.stringify(listarTareasJS, null, 2));
    console.log ('Se ha creado una nueva tarea');
    break;
    case 'eliminarTarea':
    let tareaAEliminar = process.argv[3]; 
    let tareasNoEliminadas= listarTareasJS.filter(function(elemento){ //creo un nuevo array filtrando la tarea a eliminar
        return tareaAEliminar != elemento.titulo
    });
    fs.writeFileSync('./tareas.json', JSON.stringify(tareasNoEliminadas, null, 2)); //sobreescribo el archivo con las tareas que no fueron eliminadas
    console.log ('Se ha eliminado la tarea');
    break;
    case 'actualizacionDeEstado':
    let tituloTarea = process.argv[3]; 
    let estadoNuevo = process.argv[4];
    let tareaAActualizar= listarTareasJS.filter(function(elemento){ //filtro el estado anterior
        return tituloTarea == elemento.titulo
    });
    let estadoAnterior = tareaAActualizar[0].estado;
    let tareasNoActualizadas= listarTareasJS.filter(function(elemento){ //elimino la tarea a actualizar
        return tituloTarea != elemento.titulo
    });
    fs.writeFileSync('./tareas.json', JSON.stringify(tareasNoActualizadas, null, 2));
    let tareaActualizada = { //creo una nueva tarea con los datos actualizados
        titulo: tituloTarea,
        estado: estadoNuevo,
    }
    tareasNoActualizadas.push(tareaActualizada);
    fs.writeFileSync('./tareas.json', JSON.stringify(tareasNoActualizadas, null, 2)); 
    console.log("Estado: " + estadoAnterior + ", actualizado a: "+ estadoNuevo);
    break;
    case 'filtrarTareas': //por estado
    let estadoFiltrado = process.argv[3]; 
    let tareasFiltradas = listarTareasJS.filter(function(elemento){
        return estadoFiltrado == elemento.estado
    }) 
    console.log('\nEste es el listado de tareas '+ estadoFiltrado +'s'); //podemos hacer algo que nos valide el estado escrito? o que nos diga, "no hay tareas con ese estado"?
    console.log('----------------------------------------');
    for (let i=0;i<tareasFiltradas.length;i++){
        console.log((i+1) + '. ' + tareasFiltradas[i].titulo);
    }
    break;
    // O para cuando pone una accion que no tenemos registrada...
    default:
    console.log('No entiendo qué me estás pidiendo :(');
}
