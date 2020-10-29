
let process = require('process');
let fs = require('fs');

let comandoDelUsuario = process.argv[2]; // Capturamos el comando que el usuario ingresó por consola
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
        posicion: listarTareasJS.length+1, //se agregó la propiedad posicion para mejorar el resto de los procesos
        titulo: process.argv[3],
        estado: process.argv[4],
    }
    listarTareasJS.push(tareaNueva);
    fs.writeFileSync('./tareas.json', JSON.stringify(listarTareasJS, null, 2));
    console.log ('Se ha creado una nueva tarea');
    break;
    case 'eliminarTarea': //MEJORAR: ELIMINAR POR N° DE TAREA
    let tareaAEliminar = process.argv[3];
    //1. creo un nuevo array filtrando la tarea a eliminar
    let tareasNoEliminadas= listarTareasJS.filter(function(elemento){ 
        return tareaAEliminar != elemento.posicion
    });
    //2. sobreescribo el archivo con las tareas que no fueron eliminadas
    fs.writeFileSync('./tareas.json', JSON.stringify(tareasNoEliminadas, null, 2)); 
    console.log ('Se ha eliminado la tarea');
    break;
    case 'actualizarEstado': //ahora actualiza el estado por la posicion de la tarea
    let posicionTarea = process.argv[3]; 
    let estadoNuevo = process.argv[4];
    let estadoAnterior = listarTareasJS[(posicionTarea-1)].estado;
    listarTareasJS[(posicionTarea-1)].estado = estadoNuevo;
    fs.writeFileSync('./tareas.json', JSON.stringify(listarTareasJS, null, 2));
    console.log("Estado: " + estadoAnterior + ", actualizado a: "+ estadoNuevo);
    break;
    case 'filtrarTareas': //por estado
    let estadoFiltrado = process.argv[3];
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
            console.log( tareasFiltradas[i].posicion+ '. ' + tareasFiltradas[i].titulo);
        }
    }
    break;
    case 'help':
    default: // Para cuando pone una accion que no tenemos registrada...
    console.log('Ingresa alguno de los siguientes comandos:');
    console.log('-------------------------------------');
    console.log('• listarTareas --> Para listar todas las tareas y sus estados.');
    console.log('• crearTarea "titulo" "estado"--> Para crear una nueva tarea.');
    console.log('• eliminarTarea "posicion"--> Para eliminar una tarea.');
    console.log('• actualizarEstado "posicion" "nuevo estado"--> Para actualizar el estado de una tarea existente.');
    console.log('• filtrarTareas "estado"--> Para filtrar tareas por sus estados.');
    break;
}
