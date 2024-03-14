const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const mqtt = require("mqtt");
// Modulos utilizados

const app = express();
const port = 8080;
// Configuracion del puerto

// Configurar middleware para analizar el cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors());


const mongoUrl = "mongodb+srv://notjm:tqsjTGz5oWJlOdm2@eco-nido.dbwpny9.mongodb.net/?retryWrites=true&w=majority&appName=Eco-Nido";

// Cliente MQTT
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");


// Ruta para recibir datos desde la ESP32
app.post('/insertDevice', async (req, res) => {
  const data = req.body;

  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección
    const db = client.db("EcoNido");
    const deviceCollection = db.collection("device");
    const deviceHistoryCollection = db.collection("deviceHistory");

    const { mac } = data;
    const existsDevice = await deviceCollection.findOne({ mac: mac });

    // Comprobación de dispositivo
    if (!existsDevice) {
      // Insertar los datos en la colección si no existe
      await deviceCollection.insertOne(data);
    } else {
      // Actualizar datos si ya existe el dispositivo
      await deviceCollection.updateOne({ mac: mac }, { $set: data });
    }

    // Historial de dispositivo
    await deviceHistoryCollection.insertOne(data);

    // Cerrar la conexión
    client.close();
    console.log("Conexión cerrada");

    // Responder a la ESP32 con un mensaje de confirmación
    res.send("Datos recibidos y guardados en la base de datos");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos," + error);
  }
});

// Para peticiones de sensoresz
app.post('/device/sensor', async (req, res) => {
  const data = req.body;
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexion exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y las colecciones
    const db = client.db("EcoNido");
    const deviceCollection = db.collection("device");

    // Primero se comprueba si no existe el usuario
    const { mac } = data;
    const exists = await deviceCollection.findOne({ mac: mac });

    if (!exists) {
      res.status(404).send("No se encontro el dispositivo:" + mac);
    } else {
      res.json(exists);
    }

    client.close();
  } catch (error) {
    console.error("Error al conectar MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});


// Para peticiones de contactos   
app.post('/user/contacto', async (req, res) => {
  const data = req.body;
  try {
    const client = await MongoClient.connect(
      mongoUrl,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log("Conexion exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y las colecciones
    const db = client.db("EcoNido");
    const questionCollection = db.collection("preguntas");

    // Primero se comprueba si no existe el usuario
    const { email } = data;
    const exists = await questionCollection.findOne({ email: email });

    if (!exists) {
      questionCollection.insertOne(data);
      res.json({
        title: "Question insert",
        message: "Success",
        status: true,
      })
    } else {
      res.json({
        title: "Question exists",
        message: "Failed",
        status: false,
      })
    }

    client.close();
  } catch (error) {
    console.error("Error al conectar MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
})

// Para peticioens de empresas

// Ruta para recibir datos de mi ecoWeb (Registro de usuarios)
app.post('/user', async (req, res) => {
  const data = req.body;
  let client; // Declarar la variable client fuera del bloque try para que pueda cerrarse en el bloque finally

  try {
    // Conectar a la base de datos MongoDBAtlas
    client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y las colecciones
    const db = client.db("EcoNido");
    const userCollection = db.collection("users");

    // Comprobar si no existe el usuario
    const { username } = data;
    const exists = await userCollection.findOne({ username: username });

    if (!exists) {
      await userCollection.insertOne(data);
      res.send("Datos registrados satisfactoriamente");
    } else {
      res.send("Los datos enviados ya existen");
    }

    console.log("Datos recibidos del usuario");

  } catch (error) {
    console.error("Error al conectar MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

// Para peticiones de login
app.post('/user/login', async (req, res) => {
  const data = req.body;
  try {
    // Validacion de datos
    const { username, password } = data;
    if (!username || !password) {
      return res.status(400).send('Falta información de autenticación');
    }

    // Conectar a la base de datos MongoDBAtlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexion exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y las colecciones
    const db = client.db("EcoNido");
    const userCollection = db.collection("users");

    const exists = await userCollection.findOne({ username: username, password: password });
    if (!exists) {
      res.status(401).json({ status: false });
    } else {
      const { permisos, dispositivo } = exists;
      res.status(200).json({ status: true, tipo: permisos, dispositivo: dispositivo });
    }
    client.close();

  } catch (error) {
    console.error("Error al conectar MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
})

// Para peticiones de edicion y eliminacion
app.post('/user/edit', async (req, res) => {
  const data = req.body;

  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexion exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección de usuarios
    const db = client.db("EcoNido");
    const userCollection = db.collection("users");

    // Comprobar si el usuario existe
    const { username } = data;
    const existingUser = await userCollection.findOne({ username: username });

    if (!existingUser) {
      res.status(404).json({ status: false, message: 'Usuario no encontrado' });
    } else {
      // Realizar la acción de edición (actualización)
      await userCollection.updateOne({ username: username }, { $set: data });
      res.status(200).json({ status: true, message: 'Usuario actualizado con éxito' });
    }

    client.close();
  } catch (error) {
    console.error("Error al conectar MongoDB Atlas:", error);
    res.status(500).json({ status: false, message: 'Error al conectar a la base de datos' });
  }
});

app.post('/user/delete', async (req, res) => {
  const data = req.body;

  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexion exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección de usuarios
    const db = client.db("EcoNido");
    const userCollection = db.collection("users");

    // Comprobar si el usuario existe
    const { username } = data;
    const existingUser = await userCollection.findOne({ username: username });

    if (!existingUser) {
      res.status(404).json({ status: false, message: 'Usuario no encontrado' });
    } else {
      // Realizar la acción de eliminación
      await userCollection.deleteOne({ username: username });
      res.status(200).json({ status: true, message: 'Usuario eliminado con éxito' });
    }

    client.close();
  } catch (error) {
    console.error("Error al conectar MongoDB Atlas:", error);
    res.status(500).json({ status: false, message: 'Error al conectar a la base de datos' });
  }
});

// Para obtener todos los usuarios
app.get('/user/manage', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conexión exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colección de usuarios
    const db = client.db("EcoNido");
    const userCollection = db.collection("users");

    // Obtener todos los usuarios
    const allUsers = await userCollection.find({}).toArray();

    res.status(200).json(allUsers);

    client.close();
  } catch (error) {
    console.error("Error al conectar MongoDB Atlas:", error);
    res.status(500).json({ status: false, message: 'Error al conectar a la base de datos' });
  }
});

/* **********************************************
*
*
*                  PRODUCTOS
*
*
* ********************************************** */
app.get('/productos', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("ConexiÃ³n exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colecciÃ³n
    const db = client.db("EcoNido");
    const productoCollection = db.collection("products");

    // Realizar la consulta a la colecciÃ³n de usuarios
    const products = await productoCollection.find({}).toArray();

    // Cerrar la conexiÃ³n
    client.close();
    console.log("ConexiÃ³n cerrada");

    // Responder con los resultados de la consulta
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});

// Actualizar un producto existente
app.put('/productosedit/:id', async (req, res) => {
  const productId = req.params.id; // Obtener el ID del usuario a editar desde los parÃ¡metros de la solicitud
  const productData = req.body; // Obtener los datos del usuario a editar desde el cuerpo de la solicitud
  console.log(productId);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("ConexiÃ³n exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colecciÃ³n
    const db = client.db("EcoNido");
    const productCollection = db.collection("products");

    // Realizar la actualizaciÃ³n del usuario en la colecciÃ³n
    const result = await productCollection.updateOne({ _id: new ObjectId(productId) }, { $set: productData });

    // Verificar si se actualizÃ³ el usuario correctamente
    if (result.modifiedCount === 1) {
      console.log("Usuario actualizado correctamente.");
      res.status(200).send("Usuario actualizado correctamente.");
    } else {
      console.log("El usuario no pudo ser encontrado o actualizado.");
      res.status(404).send("El usuario no pudo ser encontrado o actualizado.");
    }

    // Cerrar la conexiÃ³n
    client.close();
    console.log("ConexiÃ³n cerrada");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos:" + error);
  }
});

// Eliminar un producto
app.delete('/productos/:id', async (req, res) => {
  const productId = req.params.id; // Obtener el ID del usuario a eliminar desde los parÃ¡metros de la solicitud
  console.log(productId);
  try {
    // Conectar a la base de datos MongoDB Atlas
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("ConexiÃ³n exitosa a MongoDB Atlas");

    // Obtener una referencia a la base de datos y la colecciÃ³n
    const db = client.db("EcoNido");
    const collection = db.collection("products");

    // Realizar la eliminaciÃ³n del usuario en la colecciÃ³n
    const result = await collection.deleteOne({ _id: new ObjectId(productId) });  // Suponiendo que el ID del usuario sea Ãºnico

    // Verificar si se eliminÃ³ el usuario correctamente
    if (result.deletedCount === 1) {
      console.log("Producto eliminado correctamente.");
      res.status(200).send("Producto eliminado correctamente.");
    } else {
      console.log("El Producto no pudo ser encontrado o eliminado.");
      res.status(404).send("El Producto no pudo ser encontrado o eliminado.");
    }

    // Cerrar la conexiÃ³n
    client.close();
    console.log("ConexiÃ³n cerrada");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    res.status(500).send("Error al conectar a la base de datos");
  }
});

app.get('/empresa', async (req, res) => {
  try{
    const client =await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("ConexiÃ³n exitosa a MongoDB Atlas");

     // Obtener una referencia a la base de datos y la colecciÃ³n
     const db = client.db("EcoNido");
     const Mision= db.collection("empresa");

       // Realizar la consulta a la colecciÃ³n de usuarios
    const products = await productoCollection.find({}).toArray();

    // Cerrar la conexiÃ³n
    client.close();
    console.log("ConexiÃ³n cerrada");

    // Responder con los resultados de la consulta
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos");
  }
});



// Manejo MQTT peticiones
const listen = (state) => {
  mqttClient.publish('ecoTopic', state);
  console.log(`Mensaje "${state}" enviado al topic "ecoTopic" satisfactoriamente`);
};

// Manejo MQTT POST
app.post('/mqtt', (req, res) => {
  console.log('Body:', req.body);

  const { state } = req.body;
  if (!state || !['lightON', 'lightOFF', 'fanON', 'fanOFF'].includes(state)) {
    return res.status(400).send('Parámetros inválidos');
  }

  listen(state);
  res.status(200).send('Mensaje recibido correctamente');
});


// Manejar errores 404 para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send("Ruta no encontrada");
});

// Manejar errores 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error del servidor');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});