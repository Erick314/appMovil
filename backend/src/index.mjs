import express from 'express';
import firebaseAdmin from './firebase.js';
import cors from 'cors'; 

//para la api web
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' assert { type: "json" }; // Ruta a swagger.json


const app = express();
const port = 3000;


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200' // Permite solo el acceso desde esta URL
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




// Endpoint  Empresas
//Get para mostrar
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

//Post para agregar
app.post('/api/addEmpresa', async (req, res) => {
  console.log(req.body)
  try {
    const db = firebaseAdmin.firestore();
    const nuevaEmpresa = req.body;
    const docRef = await db.collection('empresas').add(nuevaEmpresa);
    res.status(201).json({ id: docRef.id, ...nuevaEmpresa });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Delete para eliminar
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
//Put para modificar
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


app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);

});
