import express from 'express';
import firebaseAdmin from './firebase.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import crypto from 'crypto';
import { getAuth } from 'firebase-admin/auth'; // Firebase Admin Auth para validar idTokens



// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API DimeTú',
      version: '1.0.0',
      description: 'Documentación de la API de DimeTú'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local'
      }
    ]
  },
  apis: ['./src/index.mjs'], // Ruta a los archivos con comentarios JSDoc
};

const app = express();
const port = 3000;

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Función para generar un token aleatorio de 20 caracteres
function generateToken() {
  return crypto.randomBytes(10).toString('hex');
}

// Middleware para verificar token
const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'Token requerido' });
  }

  try {
    const tokenDoc = await firebaseAdmin.firestore().collection('tokens').doc(token).get();
    if (!tokenDoc.exists) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200' // Permite solo el acceso desde esta URL
}));


// Endpoint para autenticación y generación de token
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Autenticar usuario y generar token
 *     tags: 
 *       - Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Usuario autenticado y token generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de acceso
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */

// Endpoint para autenticación y generación de token
app.post('/api/login', async (req, res) => {
  const { username, password, idToken } = req.body;

  try {
    if (idToken) {
      // Caso 1: Validar el token de Firebase si se proporciona
      const decodedToken = await getAuth().verifyIdToken(idToken);
      if (!decodedToken) {
        return res.status(401).json({ error: 'idToken inválido o expirado' });
      }

      // Buscar datos adicionales del usuario en Firestore usando `uid`
      const userSnapshot = await firebaseAdmin.firestore().collection('usuarios')
        .where('uid', '==', decodedToken.uid)
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        return res.status(404).json({ error: 'Usuario no encontrado en Firestore' });
      }

      const userDoc = userSnapshot.docs[0];
      const user = userDoc.data();

      // Generar un token de acceso personalizado para la API
      const apiToken = generateToken();
      await firebaseAdmin.firestore().collection('tokens').doc(apiToken).set({
        userId: decodedToken.uid,
        createdAt: new Date(),
      });

      // Responder con el token y los datos adicionales del usuario
      return res.status(200).json({
        token: apiToken,
        usuario: {
          id: userDoc.id,
          nombre: user.nombre,
          tipoUsuario: user.tipoUsuario,
          idEmpresa: user.idEmpresa || null,
          email: user.email || null,
        },
      });
    } else {
      // Caso 2: Verificar directamente en la colección `usuarios`
      const userSnapshot = await firebaseAdmin.firestore().collection('usuarios')
        .where('nombre', '==', username)
        .where('password', '==', password) // Comparación directa con la contraseña en texto plano
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }

      const userDoc = userSnapshot.docs[0];
      const user = userDoc.data();

      // Generar un token de acceso personalizado para la API
      const apiToken = generateToken();
      await firebaseAdmin.firestore().collection('tokens').doc(apiToken).set({
        userId: userDoc.id,
        createdAt: new Date(),
      });

      // Responder con el token y los datos adicionales del usuario
      return res.status(200).json({
        token: apiToken,
        usuario: {
          id: userDoc.id,
          nombre: user.nombre,
          tipoUsuario: user.tipoUsuario,
          idEmpresa: user.idEmpresa || null,
          email: user.email || null,
        },
      });
    }
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});





/**
 * @swagger
 * tags:
 *   - name: Empresa
 *     description: Endpoints para la gestión de empresas
 *   - name: Sucursal
 *     description: Endpoints para la gestión de sucursales
 *   - name: Encuesta
 *     description: Endpoints para la gestión de encuestas
 *   - name: Pregunta
 *     description: Endpoints para la gestión de preguntas
 *   - name: Asignacion
 *     description: Endpoints para la gestión de asignaciones
 *   - name: Token
 *     description: Endpoints para la gestión de tokens
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Empresa:
 *       type: object
 *       properties:
 *         codigoEmpresa:
 *           type: string
 *           description: Código único de la empresa
 *         fechaCreacion:
 *           type: string
 *           format: date
 *           description: Fecha de creación de la empresa
 *         idEmpresa:
 *           type: integer
 *           description: ID único de la empresa
 *         nombreEmpresa:
 *           type: string
 *           description: Nombre de la empresa
 *         razonSocial:
 *           type: string
 *           description: Razón social de la empresa
 *         region:
 *           type: string
 *           description: Región de la empresa
 *         rutEmpresa:
 *           type: string
 *           description: RUT de la empresa
 *         vigencia:
 *           type: string
 *           description: Estado de vigencia de la empresa
 *     Sucursal:
 *       type: object
 *       properties:
 *         idSucursal:
 *           type: integer
 *           description: ID único de la sucursal
 *         nombreSucursal:
 *           type: string
 *           description: Nombre de la sucursal
 *         direccion:
 *           type: string
 *           description: Dirección de la sucursal
 *     Encuesta:
 *       type: object
 *       properties:
 *         idEncuesta:
 *           type: integer
 *           description: ID único de la encuesta
 *         pregunta:
 *           type: string
 *           description: Pregunta de la encuesta
 *         respuesta:
 *           type: string
 *           description: Respuesta de la encuesta
 *     Pregunta:
 *       type: object
 *       properties:
 *         idPregunta:
 *           type: integer
 *           description: ID único de la pregunta
 *         texto:
 *           type: string
 *           description: Texto de la pregunta
 *     Asignacion:
 *       type: object
 *       properties:
 *         idAsignacion:
 *           type: integer
 *           description: ID único de la asignación
 *         descripcion:
 *           type: string
 *           description: Descripción de la asignación
 *     Token:
 *       type: object
 *       properties:
 *         idToken:
 *           type: integer
 *           description: ID único del token
 *         valorToken:
 *           type: string
 *           description: Valor del token
 */

// ============  Endpoint Empresa ============

/**
 * @swagger
 * /api/getEmpresa:
 *   get:
 *     summary: Obtener todas las empresas
 *     tags: 
 *       - Empresa
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 *       500:
 *         description: Error del servidor
 */

app.get('/api/getEmpresa', authMiddleware, async (req, res) => {
  try {
    const db = firebaseAdmin.firestore();
    const snapshot = await db.collection('empresas').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/addEmpresa:
 *   post:
 *     summary: Agregar una nueva empresa
 *     tags: 
 *       - Empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       201:
 *         description: Empresa creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       500:
 *         description: Error del servidor
 */

// Endpoint para agregar una empresa
app.post('/api/addEmpresa', authMiddleware, async (req, res) => {
  try {
    const db = firebaseAdmin.firestore();
    const nuevaEmpresa = req.body;
    const docRef = await db.collection('empresas').add(nuevaEmpresa);
    res.status(201).json({ id: docRef.id, ...nuevaEmpresa });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/deleteEmpresa/{id}:
 *   delete:
 *     summary: Eliminar una empresa por ID
 *     tags: 
 *       - Empresa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa a eliminar
 *     responses:
 *       200:
 *         description: Empresa eliminada con éxito
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error del servidor
 */

// Endpoint para eliminar una empresa
app.delete('/api/deleteEmpresa/:id', authMiddleware, async (req, res) => {
  try {
    const db = firebaseAdmin.firestore();
    const empresaId = req.params.id;
    await db.collection('empresas').doc(empresaId).delete();
    res.status(200).json({ message: 'Empresa eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/updateEmpresa/{id}:
 *   put:
 *     summary: Actualizar una empresa por ID
 *     tags: 
 *       - Empresa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       200:
 *         description: Empresa actualizada con éxito
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error del servidor
 */
// Endpoint para actualizar una empresa
app.put('/api/updateEmpresa/:id', authMiddleware, async (req, res) => {
  try {
    const db = firebaseAdmin.firestore();
    const empresaId = req.params.id;
    const datosActualizados = req.body;
    await db.collection('empresas').doc(empresaId).update(datosActualizados);
    res.status(200).json({ message: 'Empresa actualizada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  // ============  Endpoint Sucursal   ============
//GetSucursal
/**
 * @swagger
 * /api/getSucursal:
 *   get:
 *     summary: Obtener todas las sucursales
 *     tags: 
 *       - Sucursal
 *     responses:
 *       200:
 *         description: Lista de sucursales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sucursal'
 *       500:
 *         description: Error del servidor
 */

// Endpoint para obtener sucursales
app.get('/api/getSucursal', authMiddleware, async (req, res) => {
  try {
    const data = (await firebaseAdmin.firestore().collection('sucursales').get()).docs.map(doc => doc.data());
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
app.get('/api/getSucursalesByEmpresa/:idEmpresa', authMiddleware, async (req, res) => {
  try {
    const idEmpresa = parseInt(req.params.idEmpresa, 10); // Convertir idEmpresa a número
    if (!idEmpresa) {
      return res.status(400).json({ error: 'El parámetro idEmpresa es obligatorio' });
    }

    // Consulta a Firestore
    const sucursalesSnapshot = await firebaseAdmin.firestore()
      .collection('sucursales')
      .where('empresa', '==', idEmpresa)
      .get();

    const sucursales = sucursalesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (!sucursales.length) {
      return res.status(404).json({ error: 'No se encontraron sucursales para esta empresa' });
    }

    res.status(200).json(sucursales);
  } catch (error) {
    console.error('Error al obtener sucursales por empresa:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


  // ============  Endpoint Encuesta   ============
  //GetEncuesta

  /**
   * @swagger
   * /api/getEncuesta:
   *   get:
   *     summary: Obtener todas las encuestas
   *     tags: 
   *       - Encuesta
   *     responses:
   *       200:
   *         description: Lista de encuentas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Encuesta'
   *       500:
   *         description: Error del servidor
   */
  
  app.get('/api/getEncuesta', authMiddleware, async (req, res) => {
    try {
      const data = (await firebaseAdmin.firestore().collection('encuestas').get()).docs.map(doc => doc.data());
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  //Api getEncuesta por idEmpresa
  app.get('/api/getEncuestasByEmpresa/:idEmpresa', authMiddleware, async (req, res) => {
    try {
      const idEmpresa = parseInt(req.params.idEmpresa, 10); // Convertir idEmpresa a número
      if (!idEmpresa) {
        return res.status(400).json({ error: 'El parámetro idEmpresa es obligatorio' });
      }
  
      // Consulta a Firestore
      const encuestasSnapshot = await firebaseAdmin.firestore()
        .collection('encuestas')
        .where('empresa', '==', idEmpresa)
        .get();
  
      const encuestas = encuestasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      if (!encuestas.length) {
        return res.status(404).json({ error: 'No se encontraron encuestas para esta empresa' });
      }
  
      res.status(200).json(encuestas);
    } catch (error) {
      console.error('Error al obtener encuestas por empresa:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // ============  Endpoint Preguntas  ============
  //GetPregunta

  /**
   * @swagger
   * /api/getPreguntas:
   *   get:
   *     summary: Obtener todas las preguntas
   *     tags: 
   *       - Pregunta
   *     responses:
   *       200:
   *         description: Lista de preguntas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Pregunta'
   *       500:
   *         description: Error del servidor
   */
  
  app.get('/api/getPregunta', authMiddleware, async (req, res) => {
    try {
      const data = (await firebaseAdmin.firestore().collection('preguntas').get()).docs.map(doc => doc.data());
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.put('/api/updatePregunta/:id', authMiddleware, async (req, res) => {
    try {
      const preguntaId = req.params.id;
      const datosActualizados = req.body;
      await firebaseAdmin.firestore().collection('preguntas').doc(preguntaId).update(datosActualizados);
      res.status(200).json({ message: 'Pregunta actualizada con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.delete('/api/deletePregunta/:id', authMiddleware, async (req, res) => {
    try {
      const preguntaId = req.params.id;
      await firebaseAdmin.firestore().collection('preguntas').doc(preguntaId).delete();
      res.status(200).json({ message: 'Pregunta eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  // ============  Endpoint Asignaciones   ============
  //GetAsignaciones

  /**
   * @swagger
   * /api/getAsignacion:
   *   get:
   *     summary: Obtener todas las asignaciones
   *     tags: 
   *       - Asignacion
   *     responses:
   *       200:
   *         description: Lista de asignaciones
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Asignacion'
   *       500:
   *         description: Error del servidor
   */
  
  app.get('/api/getAsignacion', authMiddleware, async (req, res) => {
    try {
      const data = (await firebaseAdmin.firestore().collection('asignaciones').get()).docs.map(doc => doc.data());
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
  // Endpoint para obtener tokens
app.get('/api/getToken', authMiddleware, async (req, res) => {
  try {
    const data = (await firebaseAdmin.firestore().collection('tokens').get()).docs.map(doc => doc.data());
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
  
// Puerto de salida
app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
