const express = require("express");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "bakaredavid007@gmail.com",
        pass: process.env.EMAIL_PASSWORD
    }
})
const PORT = process.env.PORT || 3000;
cron.schedule(process.env.CRON_FREQUENCY, () => {
    const people = [
        { email: "bakaredavid007@gmail.com", flatId: "90" },
    ]
    people.forEach((person) => {
        transporter.sendMail(
            {
                from: "bakaredavid007@gmail.com",
                to: person.email,
                subject: `Security Invitation Code ${new Date().toISOString(1).slice(0,10)}`,
                text: `Passkey: ${generatePassKey(person.flatId)}\nFlat ID: ${person.flatId}`
            }, (error) => {
                if (error) {
                    console.log(error.message);
                }
                else {
                    console.log("Email sent to: " + person.email);
                }
            })
    })

})

function generatePassKey(flatId) {
    const dateExtract = new Date().toISOString(1).slice(0, 10).replaceAll("-", "");
    const passkey = dateExtract + flatId;
    const passkeyArray = []
    for (let i = 0; i < passkey.length; i++) {
        passkeyArray.push(String.fromCharCode((passkey.charCodeAt(i) + 2)))
    }
    return shuffleString(passkeyArray.join(""))
}

function shuffleString(str) {
    const length = str.length;
    const indices = Array.from({ length }, (_, i) => i);
    for (let i = 0; i < length; i++) {
        const newIndex = (i + 2) % length;
        [indices[i], indices[newIndex]] = [indices[newIndex], indices[i]];
    }
    return indices.map(index => str[index]).join('');
}

app.get("/", (req, res) => {
    res.json({ status: "UP", statusCode: 200 })
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})