import express from 'express';
import path from 'path';
import open from 'open';
import fetch from 'node-fetch';
import {
    getRandomInt,
    getRandomBoolean,
    getRandomDatePast,
    getRandomPhoneNumber,
    getRandomCNPJ,
    getRandomCompanyName,
    getRandomProductName,
    getRandomUserAgent,
    getRandomIP
} from './util.js';

const app = express();
const port = 3000;
const account = "---";
const appToken = "---";

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'));
});

app.post('/api/payment', async (req, res) => {

    const url = 'https://engine.tunagateway.com/api/Payment/Init';
    const headers = {
        'Content-Type': 'application/json',
        'x-tuna-account': account,
        'x-tuna-apptoken': appToken
    };

    const body = req.body;
    const initPayload = generateInitPayload(body.tokenSession, body.token, body.authenticationInformation);

    console.log("initPayload", JSON.stringify(initPayload));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(initPayload)
        });

        const data = await response.json();
        console.log("init response", JSON.stringify(data));
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar a requisição' });
    }
});


function generateInitPayload(tokenSession, cardToken, authenticationInformation) {
    const partnerUniqueID = `puid_${getRandomInt(1000, 999999999)}`;
    const data = {
        "TokenSession": tokenSession,
        "partneruniqueid": partnerUniqueID,
        "customer": {
            "id": `test_${getRandomInt(1000, 9999)}@example.com`,
            "name": getRandomCompanyName(),
            "email": `test_${getRandomInt(1000, 9999)}@example.com`,
            "document": getRandomCNPJ(),
            "documentType": "CNPJ",
            "dayssinceregistration": getRandomInt(1, 365),
            "data": {
                "phone": getRandomPhoneNumber(),
                "iscorporate": getRandomBoolean(),
                "tradename": getRandomCompanyName(),
                "corporatedocument": getRandomCNPJ(),
                "createddate": getRandomDatePast()
            }
        },
        "paymentItems": {
            "items": [
                {
                    "amount": 33,
                    "detailUniqueId": getRandomInt(1000, 9999),
                    "productDescription": getRandomProductName(),
                    "itemQuantity": 1
                }
            ]
        },
        "paymentdata": {
            "paymentmethods": [
                {
                    "partneruniqueid": partnerUniqueID,
                    "paymentmethodtype": "2",
                    "amount": 33,
                    "installments": 1,
                    "cardinfo": {
                        "token": cardToken,
                        "tokenprovider": "Tuna",
                        "billinginfo": {
                            "number": getRandomInt(10, 99),
                            "name": getRandomCompanyName(),
                            "phone": getRandomPhoneNumber(),
                            "taxedamount": 10,
                            "billedamount": 10
                        },
                        "savecard": false
                    },
                    "AuthenticationInformation": {
                        "Code": tokenSession,
                        "TransactionId": authenticationInformation.transactionId,
                        "ReferenceId": authenticationInformation.referenceId
                    }
                }
            ],
            "countrycode": "BR",
            "amount": 33,
            "currency": "BRL"
        },
        "frontdata": {
            "useragent": getRandomUserAgent(),
            "IpAddress": getRandomIP()
        },
        "istest": false,
        "isfromfrontend": false
    };

    return data;
}


app.listen(port, async () => {
    const response = await fetch('https://token.tunagateway.com/api/Token/NewSession', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-tuna-apptoken': appToken
        },
        body: JSON.stringify({
            "Customer": {
                "id": `test_${getRandomInt(1000, 9999)}@example.com`,
                "name": getRandomCompanyName(),
                "email": `test_${getRandomInt(1000, 9999)}@example.com`
            }
        })
    });

    const data = await response.json();

    console.log(`Server running at http://localhost:${port}`);
    await open(`http://localhost:${port}?sessionID=${data.sessionId}`);
});
