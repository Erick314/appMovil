import firebaseAdmin from 'firebase-admin';
import serviceAccount from '../credentials/serviceAccountKey.json' assert { type: 'json' };

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://dimetu-27640.firebaseio.com' // Asegúrate de que la URL sea correcta
});

export default firebaseAdmin;
