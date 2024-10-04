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

function addCommentAndRemoveNoComments(reviewId) {
  const noCommentsElement = document.querySelector(`p.noComments[nocommentsreviewid="${reviewId}"]`);
  if (noCommentsElement) {
    noCommentsElement.remove();
  };
};


const heartProductDetail = document.getElementById('heartProductDetail');
const heartsCoutnProductDetail = document.getElementById('heartsCoutnProductDetail');
const numberOfHearts = document.getElementById('heartsCountProductDetail');
heartProductDetail.src = product.isHearted ? heartFullSrc : heartSrc;

heartProductDetail.addEventListener('click', () => {
  const url = '/heart/';

  if (product.isHearted) {
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
        heartProductDetail.src = heartSrc;
        heartsCoutnProductDetail.textContent = product.hearts;
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
        heartProductDetail.src = heartFullSrc;
        heartsCoutnProductDetail.textContent = product.hearts;
      } else {
        showNotification('Ошибка при добавление лайка', 'error')
      }
    });
  }
});


const arrowContainer = document.querySelectorAll('.arrowContainer');
const productDetailImg = document.querySelector('.productDetailImg');
const divLeftArrowProductDetail = document.getElementById('divLeftArrowProductDetail');
const divRightArrowProductDetail = document.getElementById('divRightArrowProductDetail');
const allImages = [product.mainImageUrl, ...product.images];
let currentIndex = 0;

const updateImage = () => {
  productDetailImg.src = allImages[currentIndex];
};

divLeftArrowProductDetail.onclick = () => {
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : allImages.length - 1;
  updateImage();
};

divRightArrowProductDetail.onclick = () => {
  currentIndex = (currentIndex < allImages.length - 1) ? currentIndex + 1 : 0;
  updateImage();
};

productDetailImg.addEventListener('click', function() {
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
    document.body.removeChild(fullImg);
    document.body.removeChild(closeButtonForFullImg);
  });

  document.body.appendChild(fullImg);
  document.body.appendChild(closeButtonForFullImg);
});


function handleLikeClick(event) {
  const icon = event.currentTarget;
  const reviewId = icon.getAttribute('dataReviewID');
  const commentId = icon.getAttribute('dataCommentID');
  
  const endpoint = reviewId ? `/searchPage/${reviewId}/addReviewHeart/` : `/searchPage/${commentId}/addCommentHeart/`;
  const method = icon.classList.contains('hearted') ? 'DELETE' : 'POST';

  fetch(endpoint, {
    method: method,
    headers: {
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const heartsElement = icon.previousElementSibling;
      heartsElement.textContent = data.hearts;

      if (method === 'POST') {
        icon.src = data.isHearted ? commentHeartFullSrc : commentHeartSrc;

        if (data.isHearted) {
          icon.classList.add('hearted');
        }

      } else {
        icon.src = commentHeartSrc;
        icon.classList.remove('hearted');
      }
    } else {
      showNotification('Ошибка при добавление лайка', 'error')
    }
  })
}

function attachHeartClickHandlers(){
  let reviewLikeIcons = document.querySelectorAll('.heartsCommentsImg[dataReviewID]');
  reviewLikeIcons.forEach(icon => {
    icon.removeEventListener('click', handleLikeClick);
    icon.addEventListener('click', handleLikeClick);
  });

  let commentLikeIcons = document.querySelectorAll('.heartsCommentsImg[dataCommentID]');
  commentLikeIcons.forEach(icon => {
    icon.removeEventListener('click', handleLikeClick);
    icon.addEventListener('click', handleLikeClick);
  });
};
attachHeartClickHandlers()

const addReview = document.getElementById('addReview');
if (addReview){
  addReview.addEventListener('click', function(event) {
    event.preventDefault();
  
    const form = document.getElementById('reviewFormAdd');
    const formData = new FormData(form);
    const reviewUrl = form.action;
  
    fetch(reviewUrl, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken,
        }
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.responseData && data.responseData.status === 'success') {
          addReviewToPage(data.responseData.review);
          form.reset();
        } else {
          console.error('Ошибка при добавлении отзыва:', data);
        }
    })
    .catch(error => console.error('Ошибка:', error));
  });
}


function addReviewToPage(review) {
  const noReviews = document.getElementById('noReviews');
  if (noReviews){
    noReviews.remove();
  }

  const reviewsContainer = document.getElementById('divForReviews');

  const reviewDiv = document.createElement('div');
  reviewDiv.className = 'review';

  const headOfCommentDiv = document.createElement('div');
  headOfCommentDiv.className = 'headOfComment';

  const reviewDateEm = document.createElement('em');
  reviewDateEm.className = 'reviewDate';
  reviewDateEm.textContent = review.created_at;

  const reviewUserStrong = document.createElement('strong');
  reviewUserStrong.className = 'reviewUser';
  reviewUserStrong.textContent = review.user.username;

  const heartsCommentsStrong = document.createElement('strong');
  heartsCommentsStrong.className = 'heartsComments';
  heartsCommentsStrong.textContent = '0';

  const heartsCommentsImg = document.createElement('img');
  heartsCommentsImg.src = commentHeartSrc;
  heartsCommentsImg.alt = "Heart";
  heartsCommentsImg.className = "heartsCommentsImg";
  heartsCommentsImg.setAttribute('dataReviewId', review.id);

  headOfCommentDiv.appendChild(reviewDateEm);
  headOfCommentDiv.appendChild(reviewUserStrong);
  headOfCommentDiv.appendChild(document.createTextNode(': '));
  headOfCommentDiv.appendChild(heartsCommentsStrong);
  headOfCommentDiv.appendChild(heartsCommentsImg);

  const br = document.createElement('br');
  for (let i =0; i != 2; i++){
    headOfCommentDiv.appendChild(br.cloneNode());
  }

  const divForCommentImagesAndTexts = document.createElement('div');
  divForCommentImagesAndTexts.className = 'divForCommentImagesAndTexts';

  const commentImagesDiv = document.createElement('div');
  commentImagesDiv.className = 'commentImages';

  const imagesURL = review.images;
  if (imagesURL && imagesURL.length > 0) {
    imagesURL.forEach(imageUrl => {
      const commentImage = document.createElement('img');
      commentImage.src = imageUrl;
      commentImage.alt = "Image for comment";
      commentImage.className = "commentImage";
      commentImagesDiv.appendChild(commentImage);
    });
  }

  const reviewTextSpan = document.createElement('span');
  reviewTextSpan.className = 'reviewText';
  reviewTextSpan.textContent = review.text;

  divForCommentImagesAndTexts.appendChild(commentImagesDiv);
  divForCommentImagesAndTexts.appendChild(reviewTextSpan);

  const commentsDiv = document.createElement('div');
  commentsDiv.className = 'comments';
  commentsDiv.setAttribute('commentsreview', review.id);
  
  const noCommentsParagraph = document.createElement('p');
  noCommentsParagraph.className = 'noComments';
  noCommentsParagraph.setAttribute('nocommentsreviewid', review.id);
  noCommentsParagraph.textContent = "Нет комментариев.";


  const commentForm = document.createElement('form');
  commentForm.method = "POST";
  commentForm.action = `/searchPage/${review.id}/addComment/`;
  commentForm.className = "commentForm";
  commentForm.enctype = "multipart/form-data";

  const csrfTokenInput = document.createElement('input');
  csrfTokenInput.type = 'hidden';
  csrfTokenInput.name = 'csrfmiddlewaretoken';
  csrfTokenInput.value = csrfToken;

  const commentTextarea = document.createElement('textarea');
  commentTextarea.name = 'comment';
  commentTextarea.required = true;
  commentTextarea.placeholder = 'Напишите комментарий...';
  commentTextarea.className = 'commentTextarea';

  const inputFile = document.createElement('input');
  inputFile.type = 'file';
  inputFile.name = 'image';
  inputFile.accept = 'image/*';
  inputFile.multiple = true;

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'addCommentButton addComments';
  submitButton.id = 'addComment';
  submitButton.textContent = 'Добавить комментарий';

  commentsDiv.appendChild(noCommentsParagraph);
  commentsDiv.appendChild(commentForm);

  commentForm.appendChild(csrfTokenInput);
  commentForm.appendChild(commentTextarea);
  commentForm.appendChild(inputFile);
  commentForm.appendChild(submitButton);

  reviewDiv.appendChild(headOfCommentDiv);
  reviewDiv.appendChild(divForCommentImagesAndTexts);
  reviewDiv.appendChild(commentsDiv);

  reviewsContainer.prepend(reviewDiv);

  attachHeartClickHandlers();
  getAddCommentsButtons();
}


function getAddCommentsButtons() {
  const addCommentsButtons = document.querySelectorAll('.addComments');
  addCommentsButtons.forEach(button => {
      button.removeEventListener('click', handleCommentSubmit);
      button.addEventListener('click', handleCommentSubmit);
  });
};

function handleCommentSubmit(event) {
  event.preventDefault();
  const form = this.closest('.commentForm');
  const formData = new FormData(form);
  const reviewUrl = form.action;
  
  fetch(reviewUrl, {
      method: 'POST',
      body: formData,
      headers: {
          'X-CSRFToken': csrfToken,
      }
  })
  .then(response => response.json())
  .then(data => {
      if (data.responseData && data.responseData.status === 'success') {
          addCommentToPage(data.responseData.comment, data.responseData.review.id);
          form.reset();
      }
  });
}
getAddCommentsButtons();


function addCommentToPage(comment, review){
  const commentsContainer = document.querySelector(`div.comments[commentsreview="${review}"]`);

  const newCommentDiv = document.createElement('div');
  newCommentDiv.className = 'comment';

  const headOfCommentDiv = document.createElement('div');
  headOfCommentDiv.className = 'headOfComment';

  const commentDate = document.createElement('em');
  commentDate.className = 'commentDate';
  commentDate.textContent = comment.created_at;
  headOfCommentDiv.appendChild(commentDate);

  const commentUser = document.createElement('strong');
  commentUser.className = 'commentUser';
  commentUser.textContent = comment.user.username;
  headOfCommentDiv.appendChild(commentUser);
  headOfCommentDiv.appendChild(document.createTextNode(': '));

  const heartsSpan = document.createElement('span');
  heartsSpan.className = 'heartsComments';
  heartsSpan.textContent = '0';
  headOfCommentDiv.appendChild(heartsSpan);

  const heartImg = document.createElement('img');
  heartImg.src = commentHeartSrc;
  heartImg.alt = 'Heart';
  heartImg.className = 'heartsCommentsImg';
  heartImg.setAttribute('dataCommentID', comment.id);
  headOfCommentDiv.appendChild(heartImg);

  const br = document.createElement('br');
  for (let i =0; i != 2; i++){
    headOfCommentDiv.appendChild(br.cloneNode());
  };

  newCommentDiv.appendChild(headOfCommentDiv);

  const divForCommentImagesAndTexts = document.createElement('div');
  divForCommentImagesAndTexts.className = 'divForCommentImagesAndTexts';

  const commentImagesDiv = document.createElement('div');
  commentImagesDiv.className = 'commentImages';

  comment.images.forEach(img => {
    const imgElement = document.createElement('img');
    imgElement.src = img;
    imgElement.alt = 'Image for comment';
    imgElement.className = 'commentImage';
    commentImagesDiv.appendChild(imgElement);
  });

  divForCommentImagesAndTexts.appendChild(commentImagesDiv);

  const commentTextSpan = document.createElement('span');
  commentTextSpan.className = 'commentText';
  commentTextSpan.textContent = comment.text;
  divForCommentImagesAndTexts.appendChild(commentTextSpan);

  newCommentDiv.appendChild(divForCommentImagesAndTexts);
  commentsContainer.prepend(newCommentDiv);

  attachHeartClickHandlers();
  addCommentAndRemoveNoComments(review);
}


const addButtonProductToShoppingCart = document.getElementById('addButtonProductToShoppingCart');
addButtonProductToShoppingCart.addEventListener('click', function(e){
  const productId = this.getAttribute('dataProductID');
  
  fetch(`/cart/add/${productId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showNotification(data.message, 'success')
    } else {
      showNotification(data.message, 'error')
    }
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });
})