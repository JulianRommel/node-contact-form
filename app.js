const express = require('express')
const app = express()
const port = 8080
const cors = require('cors')
var bodyParser = require('body-parser')

// CORS
app.use(cors({
    origin: 'https://www.fewo-steinenberg.de'
}))

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) 

// Mailjet variables
const mailjet = require ('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

// POST requests
app.post('/', (req, res) => {

    // Variablen
    let name = escape(req.body.name)
    let mail = escape(req.body.mail)
    let von = escape(req.body.von)
    let bis = escape(req.body.bis)
    let text = escape(req.body.text)

    function escape(s) {
        if(s){
            return s.replace(
                /[^0-9A-Za-z,.?!]/g,
                c => "&#" + c.charCodeAt(0) + ";"
            );
        }else{
            return ' - '
        }
    }

    // Mail senden via MailJet
    const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
        "Messages":[
            {
                "From": {
                        "Email": "no-reply@rommel.solutions",
                        "Name": "Rommel Bot"
                },
                "To": [
                        {
                                "Email": "info@fewo-steinenberg.de",
                                "Name": "FeWo Steinenberg"
                        }
                ],
                "Subject": "Buchungsanfrage",
                "TextPart": `Es gibt eine neue Buchungsanfrage!\n\nName: ${name}\nMail: ${mail}\nVon: ${von}  Bis: ${bis}\n\nNachricht: ${text}`,
                "HTMLPart": `
                <h1>Es gibt eine neue Buchungsanfrage!</h1></br></br>
                <div style="margin-bottom: 0.5rem; font-size: 1.5rem;">
                    <b>Name:</b> ${name}
                </div>
                </br>
                <div style="margin-bottom: 0.5rem; font-size: 1.5rem;">
                    <b>Mail:</b> ${mail}
                </div>
                </br>
                <div style="margin-bottom: 0.5rem; font-size: 1.5rem;">
                    <b>Von:</b> ${von}  <b>Bis:</b> ${bis}
                </div>
                </br></br>
                <div style="margin-bottom: 0.5rem; font-size: 1.5rem;">
                    <b>Nachricht:</b>
                </div>
                <p style="font-size: 1.1rem">
                    ${text}
                </p>`,
            }
        ]
    })
    request
    .then((result) => {
        // console.log(result.body)
    })
    .catch((err) => {
        // console.log(err.statusCode)
        res.sendStatus(err.statusCode)
    })

        res.sendStatus(200)
})

// Create server
app.listen(port)