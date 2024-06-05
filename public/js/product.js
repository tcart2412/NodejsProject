function addToCart(btn) {

    let nameCell = btn.parentElement.parentElement.querySelector('.product-name');
    let priceCell = btn.parentElement.parentElement.querySelector('.product-price');
    let imageCell = btn.parentElement.parentElement.parentElement.querySelector('.product-img').querySelector('img')

    var item_name = nameCell.textContent;
    var image_src = imageCell.src.slice(22);
    var item_price = parseInt(priceCell.textContent.slice(4));

    var cart = JSON.parse(localStorage.getItem('shoppingCart'));

    var count = 0
    cart.forEach(item => {
        if (item.name == item_name)
            count++;
    });

    if (count == 0) {

        cart.push({ src: image_src, name: item_name, price: item_price });

        localStorage.setItem('shoppingCart', JSON.stringify(cart));

        fetch('/ShoppingCartPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: item_name, img: image_src, price: item_price })
        })
            .then(response => response.json())
            .then(result => {
                Swal.fire({
                    icon: 'success',
                    title: '感謝購買',
                    text: '已加入購物車',
                })
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        Swal.fire({
            icon: 'warning',
            title: '抱歉',
            text: '商品重複',
        })
    }

}

function directCheckout(btn) {

    let nameCell = btn.parentElement.parentElement.querySelector('.product-name');
    let priceCell = btn.parentElement.parentElement.querySelector('.product-price');
    let quantityCell = btn.parentElement.parentElement.querySelector('.quantity');
    let imageCell = btn.parentElement.parentElement.parentElement.querySelector('.product-img').querySelector('img')

    var item_name = nameCell.textContent;
    var quantity = parseInt(quantityCell.textContent);
    var image_src = imageCell.src.slice(22);
    var item_price = parseInt(priceCell.textContent.slice(4));
    var total_price = item_price * quantity;
    if (quantity > 0) {
        fetch('/CheckoutPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: [{ name: item_name, quantity: quantity, src: image_src, unit_price: item_price }], totalPrice: total_price })
        })
            .then(response => response.json())
            .then(result => {
                window.location.href = '/CheckoutPage';
            })
            .catch(error => {
                console.error('Error:', error);
            });

    } else {
        Swal.fire({
            icon: 'warning',
            title: '買單失敗',
            text: '請選擇商品數量',
        })
    }
}

function addNum(btn) {
    let quantityCell = btn.parentElement.querySelector('.quantity');
    quantityCell.textContent = parseInt(quantityCell.textContent) + 1;
}

function minusNum(btn) {
    let quantityCell = btn.parentElement.querySelector('.quantity');
    if (parseInt(quantityCell.textContent) > 0)
        quantityCell.textContent = parseInt(quantityCell.textContent) - 1;
}



