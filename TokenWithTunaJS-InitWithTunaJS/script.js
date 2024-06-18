var tuna;

const displayFormattedJSON = (response) => {
    const formattedJSON = JSON.stringify(response, null, 4);
    const preElement = document.createElement('pre');
    preElement.textContent = formattedJSON;
    document.body.appendChild(preElement);
};

checkoutAndPayCallback = response => {
    console.log(response);
    displayFormattedJSON(response);
}

generateDefaultForm = async _ => {
    const sessionID = $("#sessionid").val();
    const totalPaymentAmount = parseFloat($("#value").val());
    const paymentMethodType = $("#paymentType").val();

    tuna = Tuna(sessionID);
    $("#root").hide();
    tuna.forgeDefaultForm("#defaultFormRoot",
        {
            checkoutAndPayConfig: {totalPaymentAmount, paymentMethodAmount: totalPaymentAmount, callbackFunction: checkoutAndPayCallback, paymentMethodType}
        }
    );
}