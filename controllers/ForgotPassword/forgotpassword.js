require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../../database'); // Assurez-vous que cela pointe vers votre fichier de configuration de la base de données.
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Configuration du transporteur de messagerie avec des variables d'environnement
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});

// Fonction pour envoyer l'e-mail de réinitialisation de mot de passe
async function sendResetEmail(email, resetToken) {
    const resetPasswordUrl = `http://yourwebsite.com/reset-password/${resetToken}`; // Modifiez avec l'URL de votre choix

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: 'Réinitialisation de mot de passe',
        html: `<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur ce <a href="${resetPasswordUrl}">lien</a>.</p>`
    };

    return transporter.sendMail(mailOptions);
}

// Endpoint pour la demande de réinitialisation de mot de passe
router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;

    try {
        // Vérifier si l'email existe dans la base de données
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            // Envoyer une réponse neutre pour éviter de donner des indices aux attaquants
            return res.status(200).json({ message: "Si votre adresse e-mail est correcte, nous avons envoyé un e-mail pour réinitialiser votre mot de passe." });
        }

        // Générer un jeton de réinitialisation de mot de passe
        const resetToken = uuidv4();

        // Définir la date d'expiration du token
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);

        // Stocker le jeton de réinitialisation de mot de passe dans la base de données
        await pool.query(
            'INSERT INTO forgotpassword (id, email, token, expiration, used) VALUES ($1, $2, $3, $4, $5)',
            [uuidv4(), email, resetToken, expirationDate, false]
        );

        // Envoyer l'e-mail avec le lien de réinitialisation de mot de passe
        await sendResetEmail(email, resetToken);
        res.status(200).json({ message: "Si votre adresse e-mail est correcte, nous avons envoyé un e-mail pour réinitialiser votre mot de passe." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

module.exports = router;
