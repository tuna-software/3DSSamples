const validateFields = () => {
    let isValid = true;

    const sessionID = document.getElementById('sessionID').value;
    const cardHolderName = document.getElementById('cardHolderName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const validity = document.getElementById('validity').value;
    const cvv = document.getElementById('cvv').value;

    if (!sessionID || !cardHolderName || !cardNumber || !validity || !cvv) {
        alert('Por favor, preencha todos os campos.');
        isValid = false;
    }

    const currentDate = new Date();
    const [month, year] = validity.split('/').map(Number);
    const cardDate = new Date(`20${year}`, month - 1);

    if (cardDate < currentDate) {
        alert('A validade do cartão deve ser posterior à data atual.');
        isValid = false;
    }

    return isValid;
};

const displayFormattedJSON = (response) => {
    const formattedJSON = JSON.stringify(response, null, 4);

    const preElement = document.createElement('pre');
    preElement.textContent = formattedJSON;

    const container = document.createElement('div');
    container.id = 'jsonContainer';
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.backgroundColor = '#f5f5f5';
    container.style.border = '1px solid #ccc';
    container.style.padding = '10px';
    container.style.zIndex = 1000;
    container.style.maxHeight = '90%';
    container.style.overflowY = 'auto';
    container.style.width = '400px';

    container.appendChild(preElement);
    document.body.appendChild(container);
};

const submitForm = async () => {
    const sessionID = document.getElementById('sessionID').value;
    const cardHolderName = document.getElementById('cardHolderName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const validity = document.getElementById('validity').value;
    const cvv = document.getElementById('cvv').value;

    const [expirationMonth, expirationYear] = validity.split('/').map(Number);

    const payload = {
        sessionId: sessionID,
        card: {
            cardHolderName,
            cardNumber,
            expirationMonth,
            expirationYear: 2000 + expirationYear,
            cvv,
            singleUse: false
        },
        authenticationInformation: { code: sessionID },
        addToNetworkToken: true
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(payload)
    };

    try {
        const response = await (await fetch('https://token.tunagateway.com/api/Token/Generate', options)).json();
        console.log(response);
        displayFormattedJSON(response);
        alert('Formulário enviado com sucesso!');
        handleGenerateResponse(response);
    } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
        alert('Erro ao enviar o formulário. Por favor, tente novamente.');
    }
};

const handleGenerateResponse = response => {
    if (response.code == 1 && response.authenticationInformation) {
        var { deviceDataCollectionUrl, accessToken } = response.authenticationInformation;

        injectDataCollectionFrame(deviceDataCollectionUrl, accessToken, async _ => {
            alert('Coleta de dados 3DS finalizada com sucesso!');

            document.getElementById('creditCard-form-container').style.display = 'none';

            alert('Chamando backend');

            document.getElementById('waiting-screen').style.display = 'block';

            response.tokenSession = document.getElementById('sessionID').value;

            const paymentResponse = await (await fetch("/api/payment", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(response)
            })).json();

            console.log(paymentResponse);

            const threeDSInfo = paymentResponse.methods[0].threeDSInfo;
            document.getElementById('waiting-screen').style.display = 'none';
            open3DSChallenge(threeDSInfo);
        });
    }
}

const open3DSChallenge = ({ url, token, paRequest }) => {
    let frameWidth, frameHeight = "100%";

    let paReq = JSON.parse(atob(paRequest));

    switch (paReq.challengeWindowSize) {
        case "01":
            frameWidth = "250";
            frameHeight = "400";
            break;
        case "02":
            frameWidth = "390";
            frameHeight = "400";
            break;
        case "03":
            frameWidth = "500";
            frameHeight = "600";
            break;
        case "04":
            frameWidth = "600";
            frameHeight = "400";
            break;
        default:
            frameWidth = "100%";
            frameHeight = "100%";
            break;
    }

    const container = document.createElement('div');
    container.innerHTML = `
        <iframe name="step-up-iframe" height="${frameHeight}" width="${frameWidth}" frameborder="0"></iframe>
                <form id="step-up-form" target="step-up-iframe" method="POST" action=${url}>
                    <input type="hidden" name="JWT" value="${token}" />
                </form>
    `;

    document.body.appendChild(container);

    const form = document.querySelector("#step-up-form");
    if (form) form.submit();
};

const injectDataCollectionFrame = (deviceDataCollectionUrl, accessToken, dataCollectionReadyCallback) => {
    const container = document.createElement('div');
    container.innerHTML = `
        <iframe name="ddc-iframe" height="1" width="1" style="display: none;"></iframe>
        <form id="cardinal_collection_form" target="ddc-iframe" method="POST" action="${deviceDataCollectionUrl}">
            <input type="hidden" name="JWT" value="${accessToken}" />
        </form>
    `;

    document.body.appendChild(container);

    const form = document.querySelector('#cardinal_collection_form');
    if (form) form.submit();

    window.addEventListener('message', function (event) {
        if (event.origin === new URL(deviceDataCollectionUrl).origin) {
            const data = JSON.parse(event.data);
            if (data.Status === true) {
                console.log('Data collection ready');
                dataCollectionReadyCallback();
            }
        }
    }, false);
};

const handleSubmit = (event) => {
    event.preventDefault();

    if (validateFields()) {
        submitForm();
    }
};

window.onload = () => {
    const queryString = window.location.search;
    const query = queryString.substring(1);
    const pairs = query.split("&");
    let sessionId = null;

    for (const pair of pairs) {
        const [key, value] = pair.split("=");
        if (decodeURIComponent(key) === 'sessionID') {
            sessionId = value+"==";
            break;
        }
    }

    if (sessionId) {
        const sessionIDElement = document.getElementById('sessionID');
        if (sessionIDElement) {
            sessionIDElement.value = sessionId;
        }
    }
};
