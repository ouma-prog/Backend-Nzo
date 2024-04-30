const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../../database'); // Assurez-vous que ce chemin est correct
const router = express.Router();

router.post('/register', async (req, res) => {
    // Récupérer les données du formulaire d'inscription
    const { Nom, Prenom, Email, Password, Postnom, Pays_de_residence } = req.body;

    // Vérifier si toutes les données nécessaires sont fournies
    if (!Nom || !Prenom || !Email || !Password || !Postnom || !Pays_de_residence ) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Enregistrer l'utilisateur dans la base de données
        const newUser = await pool.query(
            'INSERT INTO public.users (nom, prenom, email, password, postnom, pays_de_residence) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [Nom, Prenom, Email, hashedPassword, Postnom, Pays_de_residence]
        );
        
        // Si tout se passe bien, envoyer les données de l'utilisateur en réponse
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur lors de l'enregistrement de l'utilisateur" });
    }
});

module.exports = router;
