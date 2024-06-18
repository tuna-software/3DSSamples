var tuna;


const displayFormattedJSON = (response) => {
    const formattedJSON = JSON.stringify(response, null, 4);
    const preElement = document.createElement('pre');
    preElement.textContent = formattedJSON;
    document.body.appendChild(preElement);
};

checkoutCallback = response => {
    console.log(response);
    displayFormattedJSON(response);
    if(response?.tokenData?.authenticationInformation){
        let {accessToken, deviceDataCollectionUrl} = response.tokenData.authenticationInformation;

        tuna.create3DSDataCollectionFrame({accessToken, deviceDataCollectionUrl}, success => {
            if(success){
                $("#defaultFormRoot").hide();
                $("#challengeDiv").show();
            }
        });

    }
}

generateDefaultForm = async _ => {
    const sessionID = $("#sessionid").val();
    tuna = Tuna(sessionID);
    $("#root").hide();
    tuna.forgeDefaultForm("#defaultFormRoot",
        {
            checkoutCallback,
        }
    );
}

submitChallenge = _ => {
    
    var url = $('#challengeDiv #url').val();
    var token = $('#challengeDiv #token').val();
    var paRequest = $('#challengeDiv #paRequest').val();

    var threeDSInfo = {
        url,
        token,
        paRequest
    };

    console.log("Opening 3DS modal");
    tuna.open3dsModal(threeDSInfo, 0, "paymentKey", response => {
        console.log("3DS modal pool will fail due mocked data. Response: ", response);
    });
}