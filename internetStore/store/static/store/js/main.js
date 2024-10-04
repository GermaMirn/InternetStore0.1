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


if (backAnswer) {
  showNotification(backAnswer, 'error');
};





const testimonials = document.querySelector('.carousel');
const items = testimonials.getElementsByClassName('item');
let currentIndex = 0;

function updateImages() {
    const mainImage = document.getElementById('mainImage');
    const prevImage = document.getElementById('prevImage');
    const nextImage = document.getElementById('nextImage');
    const nameOfProduct = document.getElementById('nameOfProduct');

    mainImage.src = images[currentIndex];
    nameOfProduct.innerHTML = productName[currentIndex];
    prevImage.src = images[(currentIndex - 1 + images.length) % images.length];
    nextImage.src = images[(currentIndex + 1) % images.length];
}

// Изменения для перехода
function nextItem() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImages();
}

function prevItem() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImages();
}

document.getElementById('nextBtn').addEventListener('click', nextItem);
document.getElementById('prevBtn').addEventListener('click', prevItem);

updateImages();

setInterval(nextItem, 8500);