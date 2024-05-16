const express = require('express');
const router = express.Router();
const pool = require('../../database'); 

router.post('/formulaire', async (req, res) => {
    const {
        civilite,
        prenom,
        nom,
        postnom,
        paysDeResidence,
        telephonePortable,
        adressePostale,
        complementAdresse,
        ville,
        quartier,      
        concession,
        nb_parcelle,
        nb_total_concession
    } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO profil (civilite, prenom, nom, postnom, Pays_de_residence, telephone, adresse_postale ,  complement_adresse, ville, quartier, concession, nb_parcelle, nb_total_concession) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
            [civilite, prenom, nom, postnom, paysDeResidence, telephonePortable, adressePostale, complementAdresse, ville, quartier, concession, nb_parcelle, nb_total_concession]
        );
        

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
