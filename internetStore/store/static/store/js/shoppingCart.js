function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.innerText = message;
  notification.className = `notification ${type}`;

  document.body.appendChild(notification);

  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
    document.body.removeChild(notification);
  }, 3000);
};

function showMessageOfEmptyShoppingCart() {
  const divOfCartItems = document.getElementById('divOfCartItems');
  const itemsElement = document.querySelectorAll('.divOfCartItem, .divOfCartItemDark');

  if (itemsElement.length === 0) {
    const divForTextAboutCartItem = document.createElement('div');
    divForTextAboutCartItem.id = 'divForTextAboutCartItem';

    const text = document.createElement('h2');
    text.innerText = 'У вас нет добавленных товаров';
    divForTextAboutCartItem.appendChild(text);

    divOfCartItems.appendChild(divForTextAboutCartItem);
  }
}

function deleteDataFromOrderList(itemId, priceOfCartItem){
  const totalPriceText = document.getElementById('totalPrice');
  let totalPrice = Number(totalPriceText.innerHTML.replace(/[^0-9]/g, ''));

  const cartItemsList = document.getElementById('cartItemsList');
  const existingItem = cartItemsList.querySelector(`[data-itemid='${itemId}']`);

  totalPrice -= priceOfCartItem;
  cartItemsList.removeChild(existingItem);

  totalPriceText.innerHTML = `Общая цена: ${totalPrice}₽`;
}


function extractItemDataAndAddItToOrder(element) {
  const itemId = element.dataset.itemid;
  const itemName = element.querySelector('.nameOfCartItem, .nameOfCartItemDark').innerText;
  const itemQuantity = parseInt(element.querySelector('.quantityDisplay').innerText);
  const itemPrice = parseFloat(element.querySelector('.itemPrice').innerText);

  const totalPriceText = document.getElementById('totalPrice');
  let totalPrice = Number(totalPriceText.innerHTML.replace(/[^0-9]/g, ''));

  const cartItemsList = document.getElementById('cartItemsList');
  const existingItem = cartItemsList.querySelector(`[data-itemid='${itemId}']`);

  if (existingItem) {
    totalPrice -= itemPrice;
    cartItemsList.removeChild(existingItem);

  } else {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-itemid', itemId);
    listItem.innerText = itemName + '   . . . . . . . .   ' + itemQuantity;

    cartItemsList.appendChild(listItem);
    totalPrice += itemPrice;
  }

  totalPriceText.innerHTML = `Общая цена: ${totalPrice}₽`;
}


function itemSelection(element, event){
  const clickedButton = event.target.closest('.btnChangeQuantity, .btnChangeQuantityDark, .btnRemoveItem, .btnRemoveItemDark, .nameOfCartItem, .nameOfCartItemDark');
    if (clickedButton) {
      return;
    }

  extractItemDataAndAddItToOrder(element);

  const classNameItem = element.className
  if (classNameItem === 'divOfCartItem' || classNameItem === "divOfCartItem selectedItem" || classNameItem === "selectedItem divOfCartItem") {
    element.classList.toggle('selectedItem');
  } else if (classNameItem === 'divOfCartItemDark' || classNameItem === "divOfCartItemDark selectedItemDark" || classNameItem === "selectedItemDark divOfCartItemDark") {
    element.classList.toggle('selectedItemDark');
  }
}


const quantityButtons = document.querySelectorAll('.btnChangeQuantity, .btnChangeQuantityDark');
const removeButtons = document.querySelectorAll('.btnRemoveItem, .btnRemoveItemDark');

quantityButtons.forEach(button => {
    button.addEventListener('click', function () {
        const action = this.dataset.action;
        const itemId = this.dataset.itemid;
        updateQuantity(itemId, action);
    });
});

removeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const itemId = this.dataset.itemid;
      removeItem(itemId);
    });
});


function updateQuantity(itemId, action) {
  const url = `cart/${itemId}/${action}/`;
  const quantityDisplay = document.querySelector(`.quantityDisplay[data-itemid="${itemId}"]`);
  const itemPrice = document.querySelector(`.itemPrice[data-itemid="${itemId}"]`);

  const totalPriceElement = document.getElementById('totalPrice');
  let totalPrice = Number(totalPriceElement.innerText.replace(/[^0-9]/g, ''));

  fetch(url, {
    method: 'GET',
    headers: {
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    if (data.success) {
      quantityDisplay.innerHTML = data.newQuantity;
      itemPrice.innerHTML = data.newPrice + '  ₽';

      const existingItem = cartItemsList.querySelector(`[data-itemid='${itemId}']`);
      if (existingItem){
        if (action === 'add') {
          totalPrice += Number(data.priceBeforeAdd)
        } else if (action === 'remove') {

          if (data.newQuantity >= 1 && data.cartiItemRemove != 0){
            totalPrice -= Number(data.priceBeforeRemove)
          }
        }
        
        existingItem.innerHTML = data.CartItemName + '   . . . . . . . .   ' + data.newQuantity;
        totalPriceElement.innerHTML = `Общая цена: ${totalPrice}₽`;
      }
      
    } else {
      if (action === 'remove') {
        showNotification(data.message || 'ошибка при уменьшение количества товара', 'error');
      } else if (action === 'add') {
        showNotification(data.message || 'ошибка при добавление количества товара', 'error');
      }
    }
  })
  .catch(error => {
    if (action === 'remove') {
      showNotification(data.message || 'ошибка при уменьшение количества товара', 'error');
    } else if (action === 'add') {
      showNotification(data.message || 'ошибка при добавление количества товара', 'error');
    }
  });
}


function removeItem(itemId) {
  const url = `cart/remove/${itemId}`;
  const itemElement = document.querySelector(`.divOfCartItem[data-itemid="${itemId}"], .divOfCartItemDark[data-itemid="${itemId}"]`);

  const priceItem =  document.querySelector(`.itemPrice[data-itemid="${itemId}"]`).innerHTML;
  const priceFloat = parseFloat(priceItem.replace(',', '.'));
  const priceInteger = Math.floor(priceFloat);

  fetch(url, {
    method: 'GET',
    headers: {
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    if (data.success) {
      if (itemElement) {
        itemElement.remove();

        const classNameItem = itemElement.className
        if (classNameItem === "divOfCartItem selectedItem" || classNameItem === "selectedItem divOfCartItem" || classNameItem === "divOfCartItemDark selectedItemDark" || classNameItem === "selectedItemDark divOfCartItemDark") {
          deleteDataFromOrderList(itemId, priceInteger);
        }

        const divOfCartItem = document.querySelector('.divOfCartItem, .divOfCartItemDark');
        if (divOfCartItem === null) {
          const infoAboutSelectedCartItems = document.querySelector('.infoAboutSelectedCartItems, .infoAboutSelectedCartItemsDark');
          infoAboutSelectedCartItems.remove();
        }

        showMessageOfEmptyShoppingCart()
      }
    } else {
      showNotification(data.message || 'Ошибка при удалении товара', 'error');
    }
  })
}


const infoAboutSelectedCartItems= document.querySelector('.infoAboutSelectedCartItems, .infoAboutSelectedCartItemsDark')

if (infoAboutSelectedCartItems) {
  infoAboutSelectedCartItems.addEventListener('click', function(){

    const selectedItems = [];
    const cartItemsList = document.getElementById('cartItemsList').children;
  
    for (let item of cartItemsList) {
        const itemId = item.getAttribute('data-itemid');
        const quantityDisplay = document.querySelector(`span.quantityDisplay[data-itemid='${itemId}']`);
        const itemQuantity = parseInt(quantityDisplay.innerText);
        const itemName = item.innerText;
        const dotIndex = itemName.indexOf('.');
        const cleanedName = dotIndex !== -1 ? itemName.slice(0, dotIndex).trim() : itemName.trim()
        
        selectedItems.push({ id: itemId, quantity: itemQuantity, product: cleanedName});
    }
  
    const totalPriceText = document.getElementById('totalPrice').innerText;
    const totalPrice = parseFloat(totalPriceText.replace(/[^0-9.]/g, ''));
    
    fetch('/shoppingCart/createOrder/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({
        items: selectedItems,
        totalPrice: totalPrice
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showNotification(data.message, 'success')

        const infoAboutSelectedCartItems = document.querySelectorAll('.selectedItem, .selectedItemDark');
        infoAboutSelectedCartItems.forEach(item => {
          item.remove();
        });

        const divOfCartItem = document.querySelector('.divOfCartItem, .divOfCartItemDark');
        if (divOfCartItem === null) {
          const infoAboutSelectedCartItems = document.querySelector('.infoAboutSelectedCartItems, .infoAboutSelectedCartItemsDark');
          infoAboutSelectedCartItems.remove();
        }
        
        showMessageOfEmptyShoppingCart()
      } else {
        showNotification(data.message, 'error')
      }
    })
  })
}