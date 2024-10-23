const express = require("express");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const app = express();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
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
        console.log(generatePassKey(person.flatId))
        transporter.sendMail(
            {
                from: "bakaredavid007@gmail",
                to: person.email,
                subject: "Daily Code",
                text: `The Estate code for today [${new Date().getDate()}] is: ${generatePassKey(person.flatId)}`
            }, (error) => {
                if (error) {
                    console.log(error.message);
                }
                else{
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

for (let i = 0; i < 91; i++){
    console.log(generatePassKey(i + ""));
}
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})