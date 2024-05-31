function sendOrder() {
    const total_price = document.getElementById('total-price');
    if (parseInt(total_price.textContent) > 0) {
        Swal.fire({
            icon: 'success',
            title: '感謝購買',
            text: '已送出訂單',
        }).then(function () {
            window.location.href = '/';
        })
    } else {
        Swal.fire({
            icon: 'warning',
            title: '提交失敗',
            text: '請選擇商品數量',
        }).then(function () {
            window.location.href = '/';
        })
    }

}