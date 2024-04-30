const express = require('express');
const app = express();
const cors = require('cors');

const register = require('./controllers/AddUsers/register'); 
const login =require('./controllers/AddUsers/login');
const forgotpassword = require('./controllers/ForgotPassword/forgotpassword');
const formulaire =require ('./controllers/Formulaire/formulaire');
const resetpassword = require ('./controllers/resetpassword/resetpassword');
const paiement = require ('./controllers/Gestion Cotisations/Paiements/paiement') ;
const profil = require ('./controllers/Profil/profil')
app.use(cors({
  origin: 'http://localhost:3001'
}));

  
app.use(express.json());

// Mrouteur sur l'application principale
app.use('/api', register);
app.use('/api', login);
app.use('/api', forgotpassword);
app.use('/api', formulaire);
app.use('/api/resetpassword/resetToken', resetpassword);
app.use('/api', paiement);
app.use('/api', profil);



const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
