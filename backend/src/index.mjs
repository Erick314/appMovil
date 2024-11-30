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

      // Generar un token de acceso personalizado para la API
      const apiToken = generateToken();
      await firebaseAdmin.firestore().collection('tokens').doc(apiToken).set({
        userId: decodedToken.uid,
        createdAt: new Date(),
      });

      return res.status(200).json({ token: apiToken });
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

      return res.status(200).json({ token: apiToken });
    }
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Usar el middleware en rutas que requieran autenticación
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

app.get('/api/getEmpresa', async (req, res) => {
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

app.post('/api/addEmpresa', async (req, res) => {
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

app.delete('/api/deleteEmpresa/:id', async (req, res) => {
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
app.put('/api/updateEmpresa/:id', async (req, res) => {
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

app.get('/api/getSucursal', async (req, response) => {
  try{
    const data = (await firebaseAdmin.firestore().collection('sucursales').get()).docs.map(doc => doc.data());
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error.message})
  }});
  
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
  
  app.get('/api/getEncuesta',async (req, response) => {
    try {
      const data = (await firebaseAdmin.firestore().collection('encuestas').get()).docs.map(doc => doc.data());
      response.status(200).json(data);
    }catch (error){
      response.status(500).json({error: error.message})
    }});
  
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
  
  app.get('/api/getPregunta', async (req, response) => {
    try{
      const data = (await firebaseAdmin.firestore().collection('preguntas').get()).docs.map(doc => doc.data());
      response.status(200).json(data);
    }catch (error){
      response.status(500).json({error: error.message})
    }});
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
  
  app.get('/api/getAsignacion', async (req, response) =>{
    try {
      const data =(await firebaseAdmin.firestore().collection('asignaciones').get()).docs.map(doc => doc.data());
      response.status(200).json(data);
    }catch (error){
      response.status(500).json({error: error.message})
    }
  });
  
  // ============  Endpoint Token   ============}
  //GetToken

  /**
   * @swagger
   * /api/getToken:
   *   get:
   *     summary: Obtener todas las token
   *     tags: 
   *       - Token
   *     responses:
   *       200:
   *         description: Lista de token
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Token'
   *       500:
   *         description: Error del servidor
   */
  
  app.get('/api/getToken', async (req, response) =>{
    try {
      const data = (await firebaseAdmin.firestore().collection('token').get()).docs.map(doc => doc.data());
      response.status(200).json(data);
    }catch (error){
      response.status(500).json({error: error.message});
    }});
  
  
// Puerto de salida
app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
