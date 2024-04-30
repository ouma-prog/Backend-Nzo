const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../../database');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Récupération de l'email et du mot de passe depuis la requête

    try {
        // Rechercher l'utilisateur par email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length === 0) {
            // Si aucun utilisateur n'est trouvé, renvoyez une erreur
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Si un utilisateur est trouvé, stockez-le dans une variable
        const user = userResult.rows[0];

        // Afficher les mots de passe pour le débogage
        console.log('Password from request:', password);         // Le mot de passe envoyé par l'utilisateur
       console.log('Hashed password from DB:', user.password);  // Le mot de passe haché stocké dans la base de données
        
        // Comparer le mot de passe fourni avec le mot de passe haché stocké
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            // Si le mot de passe ne correspond pas, renvoyez une erreur
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }

        // Si le mot de passe correspond, l'utilisateur est connecté avec succès
        res.json({ message: "Connexion réussie", user: { id: user.id, email: user.email } });
    } catch (err) {
        // Si une erreur se produit, renvoyez une réponse d'erreur
        console.error(err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});


module.exports = router;
