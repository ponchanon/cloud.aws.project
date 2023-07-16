//API END POINT
//https://ponchanon.github.io/shopping.cart/server
endPoint = `http://localhost:3000/`;
//endPoint = `http://54.157.104.36:3000/`;


window.onload = function () {
  let accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) {
    document.getElementById("welcomeToStoreMsg").style.display = "none";
    document.getElementById("loginForm").style.display = "none";
    let username = sessionStorage.getItem("accessToken").split("-")[1];
    document.getElementById("welcomeMsg").innerHTML = "Welcome, ".concat(
      username
    );
    fetchProducts();
    fetchCarts();
    logoutForm();
  } else {
    loginForm();
    logoutForm();
  }
};

function loginForm() {
  document.getElementById("main-content").style.display = "none";
  document.getElementById("page-header").style.display = "none";
  document.getElementById("welcomeToStoreMsg").style.display = "block";
  document.getElementById("loginBtn").onclick = async function (event) {
    event.preventDefault();
    const response = await fetch(endPoint + "users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("user", data.user);
      let username = data.accessToken.split("-")[1];
      document.getElementById("welcomeMsg").innerHTML = "Welcome, ".concat(
        username
      );
      document.getElementById("welcomeToStoreMsg").style.display = "none";
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("main-content").style.display = "block";
      document.getElementById("page-header").style.display = "block";
      window.location.reload();
    } else {
      alert(data.error);
    }
  };
}

function logoutForm() {
  document.getElementById("logoutBtn").onclick = async function (event) {
    event.preventDefault();
    sessionStorage.clear();
    document.getElementById("loginForm").style.display = "block";
    window.location.reload();
    loginForm();
  };
}

async function fetchProducts() {
  fetch(endPoint + "products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then((products) => {
      let html = `<tr>
            <th>Name</th>
            <th>Price</th>
            <th>Image</th>
            <th>Stock</th>
            <th>Actions</th>
        </tr>`;

      products.forEach((prod) => {
        html += `
                <tr id=${prod.id}>
                    <td class="row-data">${prod.name}</td>
                    <td class="row-data">${prod.price}</td>
                    <td><img class="product-image" src=${prod.image} alt='icon'></td>
                    <td class="row-data">${prod.stock}</td>
                    <td class="row-data">
                        <button id="btnAc${prod.id}" class="btn btn-info cart-button" onclick="addToCartBtn()">Add To Cart</button>
                    </td>
                </tr>
            `;
      });
      document.getElementById("products").innerHTML = html;
    });
}

async function fetchCarts() {
  const response = await fetch(endPoint + "cart/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });

  const responseData = await response.json();
  if (response.ok) {
    if (responseData.length > 0) {
      cartsTable(responseData);
    } else {
      document.getElementById(
        "cart"
      ).innerHTML = `There is no item in your shopping cart!`;
      document.getElementById("placeOrder").innerHTML = ``;
    }
  } else {
    alert(responseData.error);
  }
}

async function createCart(cartElem) {
  const response = await fetch(endPoint + "cart", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({
      productId: cartElem.productId,
      productName: cartElem.productName,
      price: cartElem.price,
      quantity: 1,
    }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    alert(responseData.error);
  } else {
    if (responseData.length > 0) cartsTable(responseData);
    else {
      document.getElementById(
        "cart"
      ).innerHTML = `There is no item in your shopping cart!`;
      document.getElementById("placeOrder").innerHTML = ``;
    }
  }
}

async function addToCart(cartElem) {
  const response = await fetch(endPoint + "cart", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({
      productId: cartElem.productId,
      productName: cartElem.productName,
      price: cartElem.price,
      quantity: 1,
    }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    alert(responseData.error);
  } else {
    if (responseData.length > 0) cartsTable(responseData);
    else {
      document.getElementById(
        "cart"
      ).innerHTML = `There is no item in your shopping cart!`;
      document.getElementById("placeOrder").innerHTML = ``;
    }
  }
}

async function updateCart(cartElem) {
  const response = await fetch(
    endPoint + `cart/update/${cartElem.id}`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ quantity: cartElem.quantity }),
    }
  );

  const responseData = await response.json();
  if (!response.ok) {
    alert(responseData.error);
  } else {
    if (responseData.length > 0) cartsTable(responseData);
    else {
      document.getElementById(
        "cart"
      ).innerHTML = `There is no item in your shopping cart!`;
      document.getElementById("placeOrder").innerHTML = ``;
    }
  }
}

async function deleteCart() {
  const response = await fetch(endPoint + "cart/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });

  const responseData = await response.json();
  if (response.ok) {
    document.getElementById(
      "cart"
    ).innerHTML = `There is no item in your shopping cart!`;
    document.getElementById("placeOrder").innerHTML = ``;
  } else {
    alert(responseData.error);
  }
}

async function placeOrderCart() {
  const response = await fetch(endPoint + "cart/placeOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });

  const responseData = await response.json();
  if (response.ok) {
    alert(responseData.message);
    document.getElementById(
      "cart"
    ).innerHTML = `There is no item in your shopping cart!`;
    document.getElementById("placeOrder").innerHTML = ``;
    fetchProducts();
  } else {
    alert(responseData.error);
  }
}

async function addToCartBtn() {
  let rowId = event.target.parentNode.parentNode.id;
  let data = document.getElementById(rowId).querySelectorAll(".row-data");
  const cartElem = {
    productId: rowId,
    productName: data[0].innerHTML,
    price: parseInt(data[1].innerHTML),
  };
  if (document.getElementById("cart").rows.length == 0) {
    const responseData = await createCart(cartElem);
  } else {
    let found = false;
    var rows = [].slice.call(document.getElementById("cart").rows);
    rows.forEach((row) => {
      if (row.dataset.id == rowId) {
        cartElem.id = row.id.split("-")[1];
        cartElem.quantity = 1;
        found = true;
      }
    });
    if (found) {
      const responseData = await updateCart(cartElem);
    } else {
      const responseData = await addToCart(cartElem);
    }
  }
}

async function onClickDecrease() {
  let cartId = event.target.parentNode.parentNode.parentNode.id.split("-")[1];
  const cartElem = { id: cartId, quantity: -1 };

  const responseData = await updateCart(cartElem);
}

async function onClickIncrease() {
  let cartId = event.target.parentNode.parentNode.parentNode.id.split("-")[1];
  const cartElem = { id: cartId, quantity: 1 };

  const responseData = await updateCart(cartElem);
}

function cartsTable(carts) {
  let total = 0;
  let html = `<tr>
        <th>Name</th>
        <th>Price</th>
        <th>Total</th>
        <th>Quantity</th>
        </tr>`;
  carts.forEach((cart) => {
    html += `
        <tr id=cart-${cart.id} data-id=${cart.productId}>
            <td>${cart.productName}</td>
            <td>${cart.price}</td>
            <td>${cart.total}</td>
            <td>
                <div class="quantity text-center">
                    <button type="button" class="btn btn-outline-danger" onClick="onClickDecrease()">-</button>
                    <p class="quantity-field px-3 mt-3">${cart.quantity}</p>
                    <button type="button" class="btn btn-outline-success" onClick="onClickIncrease()">+</button>
                </div>
            </td>
        </tr>`;

    total += parseInt(cart.total);
  });
  html += `<tr><td id="total" colspan="4" class="table-last-row"> Total: ${total} </td></tr>`;
  document.getElementById("cart").innerHTML = html;

  document.getElementById(
    "placeOrder"
  ).innerHTML = `<button type="button" class="btn btn-outline-primary" onclick=placeOrderCart()> Place Order</button>`;
}
