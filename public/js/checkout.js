function sendOrder() {
    Swal.fire({
        icon: 'success',
        title: '感謝購買',
        text: '已送出訂單',
    }).then(function () {
        var fakeData = "";
        fetch('/deleteAllCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: fakeData })
        })
            .then(response => response.json())
            .then(result => {
                // console.log('Success:', result);
                localStorage.removeItem('shoppingCart');
                // console.log(result.receivedData);
                // window.location.href = '/CheckoutPage';
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    })
}