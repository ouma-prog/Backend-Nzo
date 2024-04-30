const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../../database'); 
const router = express.Router();

// Route pour récupérer les données de l'utilisateur par email
router.get('/profil', async (req, res) => {
  const email = req.query.email; // Ou extraire de l'authentification de la session/du token
  try {
    const userQuery = await pool.query('SELECT nom, prenom, postnom , email  FROM users WHERE email = $1', [email]);
    
    if (userQuery.rows.length > 0) {
      const user = userQuery.rows[0];
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
