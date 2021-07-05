const express = require('express')

const routes = express.Router() //metodo express, para crear las rutas
//aca no quiero responder con un texto plano, sino con la lista de libros que tengo en la base de datos, en formato jason y asi formamos la API


//middleware -  es algo que se ejecuta antes de ejecutar las peticiones
const multer = require('multer') //es un middleware para poder subir imagenes a la BD (ver documentacion)
const path = require('path') //lo usamos para usar su metodo JOIN para juntar 2 rutas
const fs = require('fs') //para leer el archivo de la imagen


//configracion del multer. necesita recibir la imagen y almacenarla temporalmente en una carpeta para que el servidor la use despues 
const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, 'imagenes'), //aca se crea o guarda en la carpeta imagenes . sino se guardaria en cualquier lado
    filename: (req, file, cb) => { //recibe el requerimiento, el archivo y la callback  -- se le da el filename sino lo guarda con cualquier nombre aleatroio
        cb(null, Date.now() + "-" + file.originalname) //para que sean unicos los nombres, con Date.now() le ponemos la fecha de subida + el nombre del archivo como vos lo tenias guardado en tu pc. habria que agregarle un UNIQID por las dudas
      }
    
})


//para recibir la imagen
const fileUpload = multer ({ //recibe un objeto con las propiedades del storage
    storage: diskstorage
}).single('imagen')//IMAGE ES EL MISMO QUE EL QUE LE PUSIMOS A LA IMAGEN EN REACT



// __DIRNAME es la ruta principal del proyecto, siempre




// CREACION DE RUTAS  // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS 
// CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS 
// CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS 




// RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES
// RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES
// RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES



// GET de todas las imagenes 
routes.get('/imagenes', (req, res)=>{ //fileUpload sube la imagen a la carpeta IMAGES temporalmente, aca las subimos a la tabla
    
    req.getConnection((err, conn) => { //recibe error o conexion
        if (err) return res.status(500).send("Error of service")

        conn.query('SELECT * FROM imagenes', (err, rows) =>{ //obtenemos las filas que estan en la base de datos
            if (err) return res.status(500).send("Error of service 2")
            
            rows.map( img =>{
                fs.writeFileSync(path.join(__dirname, 'dbimagenes/' + img.id + '-maxiyanez.png'), img.datos) //ruta donde colocar la imagen. concatenamos con path, dirname que es la ruta raiz del directorio con la carpeta que creamos de imagenes para guardar temporalmente las que vienen de la consulta a la base. pasamos la ruta y los datos
            })

            //defino array donde guardo el nombre de cada imagen
            const directorioImagen = fs.readdirSync( path.join(__dirname, 'dbimagenes/') ) //esto lee los archivos que hay en un directorio y retorna los nombres de los archivos. recibe la ruta de path

            res.json(directorioImagen) //el objeto javascript de rows lo transofrmamos a json y lo mandamos como respuesta
            
            //console.log(fs.readdirSync( path.join(__dirname, 'dbimagenes/') )) //asi vemos que es lo que trae la consulta
        })
    })
})



// GET de una sola imagen (asi la traemos al a carpeta DBIMAGENEs y puedo consumirla desde el front) recibo el ID del libro, asi busco la imagen q tiene ese id
routes.get('/unaImagen/:id', (req, res)=>{ 
    
    req.getConnection((err, conn) => { //recibe error o conexion
        if (err) return res.status(500).send("Error of service")

        conn.query('SELECT imagenes.id, imagenes.datos FROM imagenes WHERE idLibro = ?', [req.params.id], (err, rows) =>{ //obtenemos las filas que estan en la base de datos
            if (err) return res.status(500).send("Error of service 2")

            //al ser solo 1 imagen por libro, simplemente en la query traigo id y datos, y aca mapeo eso que me vino y lo escribo en la carpeta DBIMAGENES, si no estaba la pone y si ya esta no la pone 2 veces
            rows.map( img =>{
                fs.writeFileSync(path.join(__dirname, 'dbimagenes/' + img.id + '-maxiyanez.png'), img.datos) //ruta donde colocar la imagen. concatenamos con path, dirname que es la ruta raiz del directorio con la carpeta que creamos de imagenes para guardar temporalmente las que vienen de la consulta a la base. pasamos la ruta y los datos
                res.send(rows) //si cada libro tuviera varias imagenes, con lo comentado abajo de directorioImagen podria devolver un array de varias imagenes o algo
                //console.log(rows)
            })

            

            // const directorioImagen = fs.readdirSync( path.join(__dirname, 'dbimagenes/') ) //esto lee los archivos que hay en un directorio y retorna los nombres de los archivos. recibe la ruta de path
            // res.send(directorioImagen) //retornamos la direccion que se guardo en DBIMAGENES
            //console.log(fs.readdirSync( path.join(__dirname, 'dbimagenes/') )) //asi vemos que es lo que trae la consulta
        })
    })
 
})



// DELETE de 1 imagen
routes.delete('/imagenes/:id',(req, res)=>{ //en REQ esta el ID
    
    req.getConnection((err, conn) => { //recibe error o conexion
        if (err) return res.status(500).send("Error of service")

        conn.query('DELETE FROM imagenes WHERE id = ?', [req.params.id], (err, rows) =>{ //obtenemos las filas que estan en la base de datos
            if (err) return res.status(500).send("Error of service 2")
            

            // HAY QUE ELIMINARLA TAMBIEN DE LA CARPETA DE FOTOS, NO SOLO DE LA BASE DE DATOS COMO ARRIBA

            fs.unlinkSync(path.join(__dirname, 'dbimagenes/' + req.params.id + '-maxiyanez.png')) //funcion de FS para borrar un archivo,  es sincronica


            res.send("Imagen borrada ")
        })
    })
 
})





// tipo de dato LONGBLOB -> objeto largo del tipo binario, los datos de la imagen estaran en tipo binario
routes.post('/imagen/:id', fileUpload,(req, res)=>{ //fileUpload sube la imagen a la carpeta IMAGES temporalmente, aca las subimos a la tabla
    
    req.getConnection((err, conn) => { //recibe error o conexion
        if (err) return res.status(500).send("Error of service")

        const tipo = req.file.mimetype //MIMETYPE es la propiedad del file, es el formato
        const nombre = req.file.originalname
        const datos = fs.readFileSync(path.join(__dirname, 'imagenes', req.file.filename)) //este metodo de FS permite leer un archivo, hay qye pasarle la ruta donde esta. la tenemos en PATH en este caso. req.file esta todos los datos de la imagen, filename el nombre que creamos arriba de todo
        const idLibro = req.params.id

        conn.query('INSERT INTO imagenes set ?', [{tipo, nombre, datos, idLibro}], (err, rows) =>{//el array corresponde al signo de pregunta, y la arrow function que recibe un error o las rows(fila). TIPO, NOMBRE, DATOS con el mismo nombre que en la base, sino pones tipo: datos: dato
            if (err) return res.status(500).send("Error of service 2")
            
            res.send("Image saved succefully!!")
        })
    })
 
    //console.log(req.file)

}) 




// RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES
// RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES
// RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES // RUTAS DE IMAGENES





// RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS
// RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS
// RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS


// NO me reconocia la api entre medio de los dos get de abajo
// GET para traer todos los libros que tengan publico el estado
routes.get('/librosPublicos', (req, res)=>{ //fileUpload sube la imagen a la carpeta IMAGES temporalmente, aca las subimos a la tabla

    req.getConnection((err, conn) => { //recibe error o conexion
        if (err) return res.status(500).send("Error of service")


        conn.query(`SELECT L.id, L.titulo, L.autor, L.edicion, L.descripcion, I.id AS idImagen, L.urlDescarga, L.privacidad, L.idUsuario
        FROM libros L 
        LEFT JOIN imagenes I ON L.id = I.idlibro
        WHERE L.privacidad = 'Publica'  
       `
       ,(err, rows)=>{//error y ROWS filas o registros, contiene todos los campos
            if (err) {
                return res.send(err) //TRATAMOS EL ERROR
            }  
            res.json(rows) //envia los datos que obtiene desde la consulta al cliente, en formato json. NO PUEDE HABER MAS DE UN RES.SEND O RES.JSON en cada funcion. el segundo no lo mustra
        }) 
    })
})


// METODO GET traer todos los libros por ID de usuario
routes.get('/:idUsuario', (req, res)=>{
    req.getConnection((err, conn)=>{ //parametro, error y conextion
        //aca ejecutamos la query o consulta que queres realizar a la BD 
        if (err) {
            return res.send(err) //TRATAMOS EL ERROR
        }

        //primer parametro: linea comandos sql para poder hacer una consulta
        conn.query(`SELECT L.id, L.titulo, L.autor, L.edicion, L.descripcion, I.id AS idImagen, L.urlDescarga, L.privacidad, L.idUsuario
                    FROM libros L 
                    LEFT JOIN imagenes I ON L.id = I.idlibro
                    WHERE L.idUsuario = ? 
                   `
                   , [req.params.idUsuario] ,(err, rows)=>{//error y ROWS filas o registros, contiene todos los campos
                        if (err) {
                            return res.send(err) //TRATAMOS EL ERROR
                        }  
                        res.json(rows) //envia los datos que obtiene desde la consulta al cliente, en formato json. NO PUEDE HABER MAS DE UN RES.SEND O RES.JSON en cada funcion. el segundo no lo mustra
        }) 


    })
})







// METODO DELETE
routes.delete('/:id', (req, res)=>{ //la ruta es con el ID, recibimos el parametro a traves de la ruta
    req.getConnection((err, conn)=>{ 
        
        if (err) {
            return res.send(err) 
        }

        conn.query('DELETE FROM libros WHERE id = ?', [req.params.id] , (err, rows)=>{ //PARAMS.id hace referencia al de la ruta, y se le asigna al signo de pregunta del where
            console.log(req.params.id)
            if (err) {
                return res.send(err) 
            }  
            res.send("Book deleted succefully!!")
        }) 


    })
})




// METODO PUT - EDITAR
routes.put('/:id', (req, res)=>{
    req.getConnection((err, conn)=>{ 
        
        if (err) {
            return res.send(err) 
        }

        console.log(req.body)

        conn.query('UPDATE libros set ? WHERE id = ?', [req.body, req.params.id] , (err, rows)=>{ //[req.body, req.params.id], es por orden, el primero del array se asigna al primer signo de pregunta, uno es el registro completo y el otro el ID q viene por parametro  en la ruta
            if (err) {
                return res.send(err) 
            }  
            res.send("Book edited succefully!!")//res.json(rows) 
        }) 


    })
})


// METODO GET traer solo 1 libro
routes.get('/unLibro/:id', (req, res)=>{

    req.getConnection((err, conn)=>{

        if (err) {
            return res.send(err) 
        }

        conn.query('SELECT * FROM libros WHERE id = ?', [req.params.id] ,(err, rows)=>{
            if (err) {
                return res.send(err) 
            }  
            res.json(rows)
        }) 


    })
})


// METODO POST agregamos una 
routes.post('/',  (req, res) =>{

    req.getConnection((err, conn)=>{ 
        
        if (err) {
            return res.send(err) 
        }

        //console.log(req.body)

        conn.query('INSERT INTO libros set ?', [req.body] , (err, rows)=>{ //agregamos un nuevo registro, el ? va el dato
            if (err) {
                return res.send(err) 
            }  

            //console.log(res.json(rows))
            return res.send(rows)


            //res.send("Book added succefully!!")//res.json(rows) 
        }) 


    })
})

// RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS
// RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS
// RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS // RUTAS DE LIBROS





// RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS
// RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS
// RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS// RUTAS DE USUARIOS


// POST crear un usuario
routes.post('/agregarUsuario', (req, res) => {
    req.getConnection((err, conn) => {
        if (err){
            return res.send(err)
        }

        conn.query('INSERT into usuarios set ?', [req.body], (err, rows) =>{
            if (err){
                return res.send(err)
            }

            res.json(rows)
        })


    })
})


// GET de un usuario por su nombre de usuario en el parametro. me sirve para traer todos sus datos o para validar en el register si alguno existe con ese nombre
//despues en la BD restringir la subida de un nombreUsuario repetido en la tabla usuarios, con el indice
routes.get('/traerUsuario/:nombreUsuario', (req, res) =>{
    req.getConnection((err, conn) =>{
        if (err){
            return res.send(err)
        }

        conn.query('SELECT * FROM usuarios WHERE nombreUsuario = ?', [req.params.nombreUsuario], (err, rows) =>{
            if (err){
                return res.send(err)
            }

            res.send(rows)
        })

    })
})



// GET traer usuario por ID







// RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS
// RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS
// RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS // RUTAS DE USUARIOS// RUTAS DE USUARIOS




// CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS 
// CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS 
// CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS // CREACION DE RUTAS 
//EXTENSION DESDE ACA DE VISUAL STUDIO CODE, "REST CLIENT" para probar las apis. O usar el posman
//instalar https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en
module.exports = routes //exportamos routes de esta manera




