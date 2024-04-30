const express = require('express');
const router = express.Router();
const pool = require('../../database'); // Make sure the path is correct for your database connection pool

router.post('/formulaire', async (req, res) => {
    const {
        civilite,
        prenom,
        nom,
        postnom,
        Pays_de_residence,
        telephone,
        adressePostale,
        codePostal,
        complementAdresse,
        ville
    } = req.body;

    try {
        // Update the table name to 'formulaire'
        const result = await pool.query(
            'INSERT INTO profil (civilite, prenom, nom, postnom, Pays_de_residence, telephone, adresse_postale, code_postal, complement_adresse, ville) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [civilite, prenom, nom, postnom, Pays_de_residence, telephone, adressePostale, codePostal, complementAdresse, ville]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
