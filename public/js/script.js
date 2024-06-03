const cart = [];


function addToCart(button) {
    image_src = button.getAttribute('data-image');
    item_name = button.getAttribute('data-name');
    item_price = button.getAttribute('data-price');
    var count = 0;

    cart.forEach(item => {
        if (item.name == item_name)
            count++;
    });

    if (count == 0) {
        Swal.fire({
            icon: 'success',
            title: '感謝購買',
            text: '已加入購物車',
        })

        const counter = document.getElementById('counter');
        counter.textContent = parseInt(counter.textContent) + 1;

        const itemDiv = document.createElement('div');
        cart.push({ src: image_src, name: item_name, price: item_price, quantity: 0 });
        itemDiv.classList.add('cart-item');

        itemDiv.innerHTML = `
            <div class="item-cancel" onclick="cancelItem(this, '${item_name}')">
                <img src="images/cancel.png">
            </div>
            <div class="cart-images" style="padding: 0px;">
                <img src=${image_src}>
            </div>
            <div class="item-name" data-name="${item_name}">
                ${item_name} $${item_price}
            </div>
            <div>$<span class="item-price">0</span></div>
            <div class="cart-quantity">
                <button class="minus-btn">-</button>
                <span class="quantity">0</span>
                <button class="plus-btn">+</button>
            </div>
        `;

        document.getElementById('sidebar-content').appendChild(itemDiv);

        const add_btn = itemDiv.querySelector('.plus-btn');
        const minus_btn = itemDiv.querySelector('.minus-btn');
        const quantity = itemDiv.querySelector('.quantity');

        add_btn.addEventListener('click', () => {

            const itemBox = itemDiv.querySelector('.item-name');
            const item_name = itemBox.getAttribute('data-name');
            const priceBox = itemDiv.querySelector('.item-price');
            var item_price = 0;

            quantity.textContent = parseInt(quantity.textContent) + 1;

            updateCart(item_name, parseInt(quantity.textContent));
            updateTotal();

            cart.forEach(item => {
                if (item.name == item_name) {
                    item_price = item.price;
                }
            })
            priceBox.textContent = item_price * parseInt(quantity.textContent);

        })

        minus_btn.addEventListener('click', () => {

            if (parseInt(quantity.textContent) > 0) {
                const itemBox = itemDiv.querySelector('.item-name');
                const item_name = itemBox.getAttribute('data-name');
                const priceBox = itemDiv.querySelector('.item-price');

                quantity.textContent = parseInt(quantity.textContent) - 1;

                updateCart(item_name, parseInt(quantity.textContent));
                updateTotal();

                cart.forEach(item => {
                    if (item.name == item_name) {
                        item_price = item.price;
                    }
                })
                priceBox.textContent = item_price * parseInt(quantity.textContent);
            }
        })
    }
    else {
        Swal.fire({
            icon: 'warning',
            title: '抱歉',
            text: '商品重複',
        })
    }
}

function updateCart(item_name, quantity) {
    cart.forEach(item => {
        if (item.name == item_name)
            item.quantity = quantity;
    })
}

function updateTotal() {
    const total_price = document.getElementById('total-price');
    var total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    })
    total_price.textContent = total;
    console.log(cart);
}

function openNav() {
    document.getElementById("sidebar").style.width = '600px';
    document.getElementById("shopping-cart-icon").style.visibility = 'hidden';
    document.getElementById("counter").style.visibility = 'hidden';
    document.querySelector('.sidebar-bottom').style.visibility = 'visible';
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("shopping-cart-icon").style.visibility = 'visible';
    document.getElementById("counter").style.visibility = 'visible';
    document.querySelector('.sidebar-bottom').style.visibility = 'hidden';
}

// 跳至登入頁面
function login() {
    window.location.href = 'LoginPage.ejs';
}

function toCheckout() {
    const total_price = document.getElementById('total-price').textContent;
    if (parseInt(total_price) == 0) {
        Swal.fire({
            icon: 'warning',
            title: '抱歉',
            text: '商品重複',
        })
    }
    else {
        fetch('/CheckoutPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: cart, totalPrice: total_price })
        })
            .then(response => response.json())
            .then(result => {
                // console.log('Success:', result);
                console.log(result.receivedData);
                window.location.href = '/CheckoutPage';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function cancelItem(div, name) {

    const counter = document.getElementById('counter');
    counter.textContent = parseInt(counter.textContent) - 1;

    const total_price = document.getElementById('total-price');
    var price;
    // console.log(cart);

    document.getElementById('sidebar-content').removeChild(div.parentNode);

    cart.forEach(item => {
        if (item.name == name) {
            price = item.quantity * item.price;
            cart.pop(item);
        }
    })

    total_price.textContent = parseInt(total_price.textContent) - price;
    // console.log(cart);
}

function toggleMenu() {
    var menu = document.getElementById('menuItems');
    menu.classList.toggle('show');
}

function toItemPage(div) {
    var name = div.querySelector('h3').textContent;
    var dis = div.querySelector('p').textContent;
    var price = div.querySelector('h4').textContent;
    var img = div.querySelector('img').src.slice(22);
    fetch('/ProductPage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, dis: dis, price: price, img: img })
    })
        .then(response => response.json())
        .then(result => {
            // console.log('Success:', result);
            console.log(result.receivedData);
            window.location.href = '/ProductPage';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}