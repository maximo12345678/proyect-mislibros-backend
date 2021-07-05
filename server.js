// VIDEO --> https://www.youtube.com/watch?v=OWukxSRtr-A

//EXPRESS permite crear servidores HTTP de una manera sencillac
const express = require('express') //lo igualamos al modulo que instalamos
const mysql = require('mysql')
const myconn = require('express-myconnection')
const path = require('path')

const app = express() // aca lo ejectuamos

const routes = require('./routes') //traemos lo que el archivo ROUTES exporta, osea las rutas

app.set('port', process.env.PORT || 9000) //configuramos la aplicacion. PROCESS, es una variable de ambiente, es util cuando ya el hosting te da un puerto que podes usar, sino usa el 9000

const dbOptions = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '12345678', //tuve que ejecutar esto para actualizar la contraseña, sino no andaba ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
    database: 'library', //ya tenes que tner creada tu base de datos, tu esquema
}


//PARA PODER DARLE PERMISO AL SERVIDOR DE REACT DONDE CONSUMO ESTA API.
const cors = require('cors');
//use it before all route definitions
app.use(cors({origin: 'http://localhost:3000'})); //https://romantic-bardeen-d1c0d5.netlify.app


// MIDDLEWARES  - PARA LA CONEXION CON EL BANCO DE DATOS. 
app.use(myconn(mysql, dbOptions, 'single')) //primer parametro, instancia de sql, segunda son configuraciones y el tercero la estrategia de conexion, puede ser pul, request

//es para que la app o servidor logre entender lo que viene por la peticion POST o cualquiera
app.use(express.json())



// RUTAS -------------------------------------- 
app.get('/', (req, res)=>{ //recibe un requerimiento y una respuesta como parametro
    res.send('Probando ruta principal')
})


//le damos permiso al cliente de usar la carpeta con las fotos que trajimos en el get de la base de datos, por ejemplo http://localhost:9000/7-maxiyanez.png asi te trae muestra esa imagen
app.use(express.static(path.join(__dirname, 'dbimagenes'))) //dejo este directorio dbimagenes estatico y como que le doy permiso para que se pueda usar en el navegador en la ruta del l ado del servidor


app.use('/api', routes)




// SERVER RUNNING --------------------------------------------
app.listen(app.get('port'), () =>{ //con el get. accedes a la config de la app que hicimos arriba, 
    console.log('server running on port', app.get('port'))
}) //para que el servidor escuche 




// npm i nodemon --save-dev   el comando adicional es para que lo instale como una dependencia de desarrollo, la app no necesita o requiere este modulo para funcionar, solo es para mi comodidad de no tener que refrescar por cada cambio
// npm i mysql para la base de datos y npm i express-myconnection da metodos para conectar y hacer consultas a la base de datos



