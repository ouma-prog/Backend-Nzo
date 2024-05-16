const express = require('express');
const pool = require('../../database'); 
const router = express.Router();

router.put('/NvProfil', async (req, res) => {
    const { nom, prenom, postnom, email } = req.body;
    try {
        // Vérifier d'abord si l'email existe dans la base de données
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length === 0) {
            // Si l'email n'existe pas, renvoyer une erreur
            return res.status(404).json({ message: "L'utilisateur avec cet email n'existe pas." });
        }

        // Si l'email existe, mettre à jour les champs nom, prénom et postnom
        const updatedUser = await pool.query(
            'UPDATE users SET nom = $1, prenom = $2, postnom = $3 WHERE email = $4 RETURNING *',
            [nom, prenom, postnom, email]
        );

        res.json(updatedUser.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil :', error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil." });
    }
});

module.exports = router;
