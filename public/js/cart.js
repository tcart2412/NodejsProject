var cart = []
document.querySelectorAll('.plus-btn').forEach(button => {
    button.addEventListener('click', function () {
        let quantityCell = this.closest('.cart-quantity').querySelector('.quantity');
        let nameCell = this.closest('.cart-quantity').closest('.product-content').querySelector('.cart-name');
        let priceCell = this.closest('.cart-quantity').closest('.product-content').querySelector('.cart-price');
        let itemPriceCell = this.closest('.cart-quantity').closest('.product-content').querySelector('.item-price');
        let imageCell = this.closest('.cart-quantity').closest('.product-content').querySelector('.cart-image').querySelector('img');

        var price = parseInt(priceCell.textContent.slice(4));
        var image_src = imageCell.src.slice(22);

        quantityCell.textContent = parseInt(quantityCell.textContent) + 1;
        var quantity = parseInt(quantityCell.textContent);
        var isExist = false;
        cart.forEach(item => {
            if (item.name == nameCell.textContent) {
                item.price = quantity * price
                item.quantity = quantity;
                isExist = true
            }
        })
        if (isExist == false) {
            cart.push({ name: nameCell.textContent, price: quantity * price, quantity: quantity, src: image_src, unit_price: price});
            isExist = true;
        }
        itemPriceCell.textContent = quantity * price;
        updateTotal();
        console.log(cart);
    })
})

document.querySelectorAll('.minus-btn').forEach(button => {
    button.addEventListener('click', function () {
        let quantityCell = this.closest('.cart-quantity').querySelector('.quantity');
        let nameCell = this.closest('.cart-quantity').closest('.product-content').querySelector('.cart-name');
        let priceCell = this.closest('.cart-quantity').closest('.product-content').querySelector('.cart-price');
        let itemPriceCell = this.closest('.cart-quantity').closest('.product-content').querySelector('.item-price');

        var price = parseInt(priceCell.textContent.slice(4));
        if (parseInt(quantityCell.textContent) > 0) {
            quantityCell.textContent = parseInt(quantityCell.textContent) - 1;
            var quantity = parseInt(quantityCell.textContent);
            var isExist = false;
            cart.forEach(item => {
                if (item.name == nameCell.textContent) {
                    item.price = quantity * price
                    item.quantity = quantity;
                    isExist = true
                }
            })
            if (isExist == false) {
                cart.push({ name: nameCell.textContent, price: quantity * price, quantity: quantity });
                isExist = true;
            }
            itemPriceCell.textContent = quantity * price;
            updateTotal();
            console.log(cart);
        }
    })
})

document.querySelectorAll('.cart-cancel').forEach(button => {

    button.addEventListener('click', function () {
        let nameCell = this.closest('.product-content').querySelector('.cart-name');
        var itemName = nameCell.textContent
        fetch('/removeFromCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: itemName })
        })
            .then(response => response.json())
            .then(result => {

                var cart = JSON.parse(localStorage.getItem('shoppingCart'));
                // total_cart = cart;
                cart.forEach(item => {
                    if (item.name == itemName) {
                        // price = item.quantity * item.price;
                        cart.pop(item);
                        localStorage.setItem('shoppingCart', JSON.stringify(cart));
                    }
                })
                location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    })

})

function updateTotal() {
    const total_price = document.getElementById('total-price');
    var total = 0;
    cart.forEach(item => {
        total += item.price;
    })
    total_price.textContent = total;
}


function toFinalCheckout() {
    const total_price = document.getElementById('total-price').textContent;
    if (parseInt(total_price) > 0) {
        var subCart = cart.filter(item=>item.quantity !== 0);
        fetch('/CheckoutPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: subCart, totalPrice: total_price })
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
