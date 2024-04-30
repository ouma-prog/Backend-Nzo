const express = require('express');
const router = express.Router();
const pool = require('../../../database');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/paiement', upload.single('fichier'), async (req, res) => {
    try {

        const { montant_sans_frais, montant_avec_frais, nom_destinataire, tel_destinataire, objet, operateur } = req.body;
        const frais = Number(montant_avec_frais) - Number(montant_sans_frais);        
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const fichier = req.file.path;

        // Insert payment data into database
        const result = await pool.query(
            'INSERT INTO paiement (montant_sans_frais, montant_avec_frais, frais, nom_destinataire, tel_destinataire, objet, operateur, fichier) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [montant_sans_frais, montant_avec_frais, frais, nom_destinataire, tel_destinataire, objet, operateur, fichier]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
