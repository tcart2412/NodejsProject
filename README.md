### HTML / CSS / JS / Node.js / MySQL
1. 購物清單之新增 / 移除商品單項 v
2. 商品結帳 ( 計算總消費金額 ) v
3. 註冊/登入會員帳號 ( 不可重複 ) v
4. 商家後台商品項目新增 / 移除 v

[Node.js 下載網站連結](https://nodejs.org/en/?source=post_page-----317beefdf182--------------------------------)

### 安裝套件
```js
// 在終端機輸入
npm init
npm install express
npm install body-parser
npm install multer
npm install mysql
npm install nodemon
```

### 啟動專案
```
nodemon server.js
```

### 商品首頁功能
1. 呈現所有商品項目及賣家資訊 
2. 使用者可將欲購買的商品加入購物車 
3. 頁尾處輸入手機號碼即可收到簡訊的即時優惠通知 
4. 商品被加至購物車後可選擇數量以及移除商品，最後計算出總金額
<img src="./asset/HomePage.png" width="600" height="300"/>
<img src="./asset/HomePage_footer.png" width="600" height="300"/>
<img src="./asset/ShoppingCart.png" width="600" height="300"/>


###