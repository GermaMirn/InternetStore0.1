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
}


function renderProducts(products) {
  const areaProducts = document.getElementById('areaProducts');
  areaProducts.innerHTML = '';

  products.forEach(product => {
    const divForProduct = document.createElement('div');
    divForProduct.classList.add('divForProduct');

    const imgOfProduct = document.createElement('img');
    imgOfProduct.src = product.mainImageUrl;
    imgOfProduct.alt = product.name;
    imgOfProduct.classList.add('imgOfProduct');
  
    const name = document.createElement('p');
    name.classList.add('descriptionOfProduct');
    name.textContent = product.name;
  
    divForProduct.appendChild(imgOfProduct);
    divForProduct.appendChild(name);
    areaProducts.appendChild(divForProduct);
  
    imgOfProduct.addEventListener('click', () => {
      fetch(`/addFastViews/${product.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // console.log(`просмотр был добавлен`);
        }
      })

      const infoDiv = document.createElement('div');
      if (document.body.classList.value === "lightTheme") {
        infoDiv.classList.add('infoDiv');
      } else {
        infoDiv.classList.add('infoDivDark');
      }
  
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      if (document.body.classList.value === "lightTheme") {
        closeButton.classList.add('closeButton');
      } else {
        closeButton.classList.add('closeButtonDark');
      }
      closeButton.addEventListener('click', () => {
        areaProducts.removeChild(infoDiv);
      });

      const divImg = document.createElement('div');
      divImg.className = 'imgContainer';

      const divLeftArrow = document.createElement('div');
      divLeftArrow.id = 'divLeftArrowProductDetail';
      divLeftArrow.className = 'arrowContainer';
      const spanArrowLeft = document.createElement('span');
      spanArrowLeft.className = 'arrowProductDetail'
      spanArrowLeft.innerHTML = '&#8249;';
      divLeftArrow.appendChild(spanArrowLeft);

      const divDownImag = document.createElement('div');
      const imgDetail = document.createElement('img');
      imgDetail.src = product.mainImageUrl;
      imgDetail.alt = product.description;
      imgDetail.className = 'productDetailImg';
      divDownImag.appendChild(imgDetail);

      const divRightArrow = document.createElement('div');
      divRightArrow.id = 'divRightArrowForFastInfo';
      divRightArrow.className = 'arrowContainer';
      const spanArrowRight = document.createElement('span');
      spanArrowRight.className = 'arrowProductDetail';
      spanArrowRight.innerHTML = '&#8250;';
      divRightArrow.appendChild(spanArrowRight);

      if (document.body.classList.value === "lightTheme") {
          imgDetail.className = 'imgDetail';
      } else {
          imgDetail.className = 'imgDetailDark';
      }

      const allImages = [product.mainImageUrl, ...product.images];
      let currentIndex = 0;

      const updateImage = () => {
          imgDetail.src = allImages[currentIndex];
      };

      divLeftArrow.onclick = () => {
          currentIndex = (currentIndex > 0) ? currentIndex - 1 : allImages.length - 1;
          updateImage();
      };

      divRightArrow.onclick = () => {
          currentIndex = (currentIndex < allImages.length - 1) ? currentIndex + 1 : 0;
          updateImage();
      };

      divImg.appendChild(divLeftArrow);
      divImg.appendChild(divDownImag);
      divImg.appendChild(divRightArrow);

      imgDetail.addEventListener('click', () => {
        closeButton.style.display = 'none';

        const fullImg = document.createElement('img');
        fullImg.src = allImages[currentIndex];
        if (document.body.classList.value === "lightTheme") {
          fullImg.classList.add('fullImg');
        } else {
          fullImg.classList.add('fullImgDark');
        }
        
        const closeButtonForFullImg = document.createElement('button');
        closeButtonForFullImg.innerHTML = '&times;';
        if (document.body.classList.value === "lightTheme") {
          closeButtonForFullImg.classList.add('closeButtonForFullImg');
        } else {
          closeButtonForFullImg.classList.add('closeButtonForFullImgDark');
        }

        closeButtonForFullImg.addEventListener('click', () => {
          closeButton.style.display = 'block';

          document.body.removeChild(fullImg);
          document.body.removeChild(closeButtonForFullImg);
        });

        document.body.appendChild(fullImg);
        document.body.appendChild(closeButtonForFullImg);
      });

      const descContainer = document.createElement('div');
      if (document.body.classList.value === "lightTheme") {
        descContainer.classList.add('descContainer');
      } else {
        descContainer.classList.add('descContainerDark');
      }

      const nameOfProduct = document.createElement('p');
      nameOfProduct.textContent = product.name;
      descContainer.appendChild(nameOfProduct);

      const descriptionOfProduct = document.createElement('p');
      descriptionOfProduct.textContent = product.description;
      descContainer.appendChild(descriptionOfProduct);

      const priceOfProduct = document.createElement('p');
      priceOfProduct.textContent = product.price;
      descContainer.appendChild(priceOfProduct)

      const divForCategories = document.createElement('div');
      divForCategories.className = "divForCategories";
      product.categories.forEach((category) => {
        let categoryName = document.createElement('p');
        categoryName.textContent = category;
        if (document.body.classList.value === "lightTheme") {
          categoryName.className = "categoryName";
        } else {
          categoryName.className = "categoryNameDark";
        }

        categoryName.addEventListener('click', function() {
          const category = this.innerHTML;
          const previousTags = new URLSearchParams(window.location.search).get('tags');
          let newTags = previousTags ? previousTags.split(',') : [];
          if (!newTags.includes(category)) {
            newTags.push(category);
          }
          const params = new URLSearchParams();
          params.set('tags', newTags.join(','));
          if (searchInput.value) {
            params.set('searchInput', searchInput.value);
          }
          window.location.href = `/searchPage?${params.toString()}`;
        })

        divForCategories.appendChild(categoryName);
      })
      descContainer.appendChild(divForCategories);

      const lineOfSeparation = document.createElement('hr');
      descContainer.appendChild(lineOfSeparation);

      const divForBottomPanel = document.createElement('div');
      divForBottomPanel.id = 'divForBottomPanel';

      const divForHearts = document.createElement('div');
      divForHearts.id = "divForHearts";

      const divForShareAndMoreDetails = document.createElement('div');
      divForShareAndMoreDetails.id = "divForShareAndMoreDetails";

      const buttonFullInfo = document.createElement('button');
      buttonFullInfo.classList.add("buttonFullInfo");
      buttonFullInfo.textContent = "подробнее";
      buttonFullInfo.onclick = function() {
        var productId = product.id;
        window.location.replace(`http://127.0.0.1:8000/searchPage/product/${productId}/`);
      };

      const heart = document.createElement('img');
      heart.src = product.isHearted ? heartFullSrc : heartSrc;
      heart.alt = 'Heart icon'; 
      heart.id = "heart";

      const numberOfHearts = document.createElement('p');
      numberOfHearts.classList.add("numberOfHearts")
      numberOfHearts.textContent = product.hearts;

      heart.addEventListener('click', () => {
        const url = '/heart/';

        if (product.isHearted === true) {
          
          fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ productID: product.id })
          }).then(response => {
            if (response.ok) {
              if (product.hearts > 0) {
                product.hearts -= 1;
              }
              product.isHearted = false;
              heart.src = heartSrc;
              numberOfHearts.textContent = product.hearts;
            } else {
              showNotification('Ошибка при удалении лайка', 'error')
            }
          });
        } else {
          fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ productID: product.id })
          }).then(response => {
            if (response.ok) {
              product.hearts += 1;
              product.isHearted = true;
              heart.src = heartFullSrc;
              numberOfHearts.textContent = product.hearts;
            } else {
              showNotification('Ошибка при добавление лайка', 'error');
            }
          });
        }
      });

      divForBottomPanel.appendChild(divForHearts);
      divForBottomPanel.appendChild(divForShareAndMoreDetails);

      divForShareAndMoreDetails.append(buttonFullInfo)

      divForHearts.appendChild(heart);
      divForHearts.appendChild(numberOfHearts);

      descContainer.appendChild(divForBottomPanel);
  
      const contentContainer = document.createElement('div');
      if (document.body.classList.value === 'lightTheme') {
        contentContainer.classList.add('contentContainer');
      } else {
        contentContainer.classList.add('contentContainerDark');
      }
      
      contentContainer.appendChild(divImg);
      contentContainer.appendChild(descContainer);
  
      infoDiv.appendChild(closeButton);
      infoDiv.appendChild(contentContainer);
  
      const existingInfoDiv = document.querySelector('.infoDiv');
      if (existingInfoDiv) {
        areaProducts.removeChild(existingInfoDiv);
      }
  
      areaProducts.appendChild(infoDiv);
    });
  });
};

renderProducts(productsForPage);


const filter = document.getElementById('filter');
filter.addEventListener('click', function(){
  
});