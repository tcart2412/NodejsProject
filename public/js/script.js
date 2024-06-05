// 跳至登入頁面
function login() {
    window.location.href = 'LoginPage.ejs';
}


function toggleMenu() {
    var menu = document.getElementById('menuItems');
    menu.classList.toggle('show');
}

function toItemPage(div) {
    var name = div.querySelector('h3').textContent;
    // var dis = div.querySelector('p').textContent;
    var price = div.querySelector('h4').textContent;
    var img = div.querySelector('img').src.slice(22);
    fetch('/ProductPage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, price: price, img: img })
    })
        .then(response => response.json())
        .then(result => {
            // console.log('Success:', result);
            // console.log(result.receivedData);
            window.location.href = '/ProductPage';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// var cart = [];

function addToShoppingCart(button, event) {
    event.stopPropagation();
    image_src = button.getAttribute('data-image');
    item_name = button.getAttribute('data-name');
    item_price = button.getAttribute('data-price');

    var count = 0;

    var cart = JSON.parse(localStorage.getItem('shoppingCart'));

    cart.forEach(item => {
        if (item.name == item_name)
            count++;
    });

    if (count == 0) {

        cart.push({ src: image_src, name: item_name, price: item_price});

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
                // console.log('Success:', result);
                // console.log(result.receivedData);
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
    // console.log(cart)
    console.log(cart)
}


function initCart() {
    if (!localStorage.getItem('shoppingCart')) {
        console.log('Shopping Cart Initialized !');
        localStorage.setItem('shoppingCart', JSON.stringify([]));
    }
}

window.onload = initCart;
