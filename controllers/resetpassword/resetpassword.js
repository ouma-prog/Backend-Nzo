const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../../database'); // Assurez-vous que cela pointe vers votre fichier de configuration de la base de données.
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Endpoint pour la réinitialisation de mot de passe
router.post('/resetpassword', async (req, res) => {
    const { token, newPassword } = req.body; // Réception du token et du nouveau mot de passe

    try {
        // Vérifier le token et récupérer l'utilisateur
        const tokenData = await pool.query('SELECT * FROM forgotpassword WHERE token = $1', [token]);

        if (tokenData.rows.length === 0) {
            // Si aucun token n'est trouvé, renvoyer une erreur
            return res.status(400).json({ message: "Token invalide ou expiré." });
        }

        // Destructurer les données du token
        const { email, expiration, used } = tokenData.rows[0];

        // Vérifier si le token a déjà été utilisé ou s'il est expiré
        if (used || new Date() > new Date(expiration)) {
            return res.status(400).json({ message: "Token invalide ou expiré." });
        }

        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Nombre de tours de hachage recommandé

        // Mettre à jour le mot de passe de l'utilisateur dans la table 'users'
        await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

        // Marquer le token comme utilisé dans la table 'forgotpassword'
        await pool.query('UPDATE forgotpassword SET used = true WHERE token = $1', [token]);

        // Réponse indiquant le succès de la réinitialisation
        res.status(200).json({ message: "Votre mot de passe a été réinitialisé avec succès." });
    } catch (error) {
        // Gestion des erreurs
        console.error(error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});
module.exports = router;