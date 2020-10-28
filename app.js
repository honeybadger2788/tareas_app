
let process = require('process');
let fs = require('fs');

// Capturamos el comando que el usuario ingresó por consola
let comandoDelUsuario = process.argv[2];
let listarTareasJS = JSON.parse(fs.readFileSync('tareas.json', 'utf-8')); //parseo el archivo al mismo tiempo que lo importo

switch(comandoDelUsuario) {
    case 'listarTareas':
    console.log('Este es el listado de tareas que existen');
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
    case 'borrarTarea':
    break;
    case 'filtrarTarea': //por estado
    let estadoFiltrado = process.argv[3]; 
    let tareasFiltradas = listarTareasJS.filter(function(elemento){
        return estadoFiltrado == elemento.estado
    }) 
    console.log('Este es el listado de tareas '+ estadoFiltrado +'s');
    console.log('----------------------------------------');
    for (let i=0;i<tareasFiltradas.length;i++){
        console.log((i+1) + '. ' + tareasFiltradas[i].titulo);
    }
    break;
    // O para cuando pone una accion que no tenemos registrada...
    default:
    console.log('No entiendo qué me estás pidiendo :(');
}
