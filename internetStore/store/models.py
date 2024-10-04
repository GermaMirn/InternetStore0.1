from django.db import models
from django.contrib.auth.models import User
from accounts.models import Profile
import os
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver


class Category(models.Model):
  name = models.CharField(max_length=100)

  def __str__(self):
    return self.name
  
  class Meta:
    verbose_name = "Категория"
    verbose_name_plural = "Категории"


class Product(models.Model):
  name = models.CharField(max_length=255)
  description = models.TextField()
  price = models.DecimalField(max_digits=10, decimal_places=2)
  categories = models.ManyToManyField(Category, related_name='products')
  mainImage = models.ImageField(upload_to='products/', null=True, blank=True)
  hearts = models.IntegerField(default=0)
  fastViews = models.IntegerField(default=0)
  detailViews = models.IntegerField(default=0)

  def __str__(self):
    return self.name
  
  class Meta:
    verbose_name = "Продукт"
    verbose_name_plural = "Продукты"


class ProductImage(models.Model):
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='productImages')
  image = models.ImageField(upload_to='products/')

  def __str__(self):
    return f"Изображения для {self.product.name}"
  
  class Meta:
    verbose_name = "Изображение"
    verbose_name_plural = "Изображения"

@receiver(post_delete, sender=Product)
def autoProductDeleteFileOnDelete(sender, instance, **kwargs):
  if instance.images:
    if os.path.isfile(instance.images.path):
      os.remove(instance.images.path)

  for productImage in instance.productImages.all():
    if os.path.isfile(productImage.image.path):
      os.remove(productImage.image.path)

@receiver(post_delete, sender=ProductImage)
def autoProductImageDeleteOnDelete(sender, instance, **kwargs):
  if os.path.isfile(instance.image.path):
    os.remove(instance.image.path)


class ProductHeart(models.Model):
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_hearts')
  user = models.ForeignKey(Profile, on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"Лайк от {self.user.user.username} для продукта {self.product.name}"

  class Meta:
    unique_together = ('product', 'user')
    verbose_name = "Лайк под продуктом"
    verbose_name_plural = "Лайки под продуктами"


@receiver(post_save, sender=ProductHeart)
def increaseProductHearts(sender, instance, **kwargs):
  instance.product.hearts += 1
  instance.product.save()

@receiver(post_delete, sender=ProductHeart)
def decreaseProductHearts(sender, instance, **kwargs):
  instance.product.hearts -= 1
  instance.product.save()


class Review(models.Model):
  user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='reviews')
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
  text = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  images = models.ImageField(upload_to='reviews/', null=True, blank=True)
  hearts = models.IntegerField(default=0)

  def __str__(self):
    return f"Отзыв от {self.user.fullname} для {self.product.name}"
  
  class Meta:
    verbose_name = "Отзыв"
    verbose_name_plural = "Отзовы"


class ReviewHeart(models.Model):
  review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='reviewHearts')
  user = models.ForeignKey(Profile, on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    unique_together = ('review', 'user')

    verbose_name = "Лайк"
    verbose_name_plural = "Лайки для отзыва"


@receiver(post_save, sender=ReviewHeart)
def increaseReviewHearts(sender, instance, **kwargs):
    instance.review.hearts += 1
    instance.review.save()

@receiver(post_delete, sender=ReviewHeart)
def decreaseReviewHearts(sender, instance, **kwargs):
    instance.review.hearts -= 1
    instance.review.save()


class ReviewImage(models.Model):
  review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='reviewImages')
  image = models.ImageField(upload_to='reviews/')
  
  def __str__(self):
    return f"Изображение для отзыва {self.review.id}"
  
  class Meta:
    verbose_name = "Изображение для отзыва"
    verbose_name_plural = "Изображения для отзывов"

@receiver(post_delete, sender=Review)
def autoReviewDeleteFileOnDelete(sender, instance, **kwargs):
    if instance.images:
      if os.path.isfile(instance.images.path):
        os.remove(instance.images.path)

    for reviewImage in instance.reviewImages.all():
      if os.path.isfile(reviewImage.image.path):
        os.remove(reviewImage.image.path)

@receiver(post_delete, sender=ReviewImage)
def autoReviewImageDeleteOnDelete(sender, instance, **kwargs):
  if os.path.isfile(instance.image.path):
    os.remove(instance.image.path)


class Comment(models.Model):
  review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='comments')
  user = models.ForeignKey(Profile, on_delete=models.CASCADE)
  text = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  images = models.ImageField(upload_to='comments/', null=True, blank=True)
  hearts = models.IntegerField(default=0)

  def __str__(self):
    return f"Комментарий от {self.user.user.username} для отзыва {self.review.id}"
  
  class Meta:
    verbose_name = "Комментарий"
    verbose_name_plural = "Комментарии"


class CommentHeart(models.Model):
  comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='commentHearts')
  user = models.ForeignKey(Profile, on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"Комментарий от {self.user.user.username} для комментария {self.comment.id}"

  class Meta:
    unique_together = ('comment', 'user')

    verbose_name = "Лайки для комментариев"
    verbose_name_plural = "Лайк для комментария"


@receiver(post_save, sender=CommentHeart)
def increaseCommentHearts(sender, instance, **kwargs):
    instance.comment.hearts += 1
    instance.comment.save()

@receiver(post_delete, sender=CommentHeart)
def decreaseCommentHearts(sender, instance, **kwargs):
    instance.comment.hearts -= 1
    instance.comment.save()


class CommentImage(models.Model):
  comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='commentImages')
  image = models.ImageField(upload_to='comments/')

  def __str__(self):
    return f"Изображение для комментария {self.comment.id}"
  
  class Meta:
    verbose_name = "Изображение для комментария"
    verbose_name_plural = "Изображения для комментариев"

@receiver(post_delete, sender=Comment)
def autoCommentDeleteFileOnDelete(sender, instance, **kwargs):
  if instance.images:
    if os.path.isfile(instance.images.path):
      os.remove(instance.images.path)

  for commentImage in instance.commentImages.all():
    if os.path.isfile(commentImage.image.path):
      os.remove(commentImage.image.path)

@receiver(post_delete, sender=CommentImage)
def autoCommentImageDeleteOnDelete(sender, instance, **kwargs):
  if os.path.isfile(instance.image.path):
    os.remove(instance.image.path)


class Cart(models.Model):
  user = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name="cart")
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"Корзина пользователя {self.user.fullname}"
  
  class Meta:
    verbose_name = "Корзина"
    verbose_name_plural = "Корзины"


class CartItem(models.Model):
  cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
  product = models.ForeignKey(Product, on_delete=models.CASCADE)
  quantity = models.PositiveIntegerField(default=1)
  price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

  def save(self, *args, **kwargs):
    if not self.id:
      self.price = self.product.price

    if self.quantity >= 1:
      self.price = self.product.price * self.quantity
    super().save(*args, **kwargs)

  def __str__(self):
    return f"{self.quantity} x {self.product.name} в корзине"

  class Meta:
    verbose_name = "Элемент корзины"
    verbose_name_plural = "Элементы корзины"


class Order(models.Model):
  user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='orders')
  created_at = models.DateTimeField(auto_now_add=True)
  totalPrice = models.DecimalField(max_digits=10, decimal_places=2, default=0)
  isDelivered = models.BooleanField(default=False)

  def __str__(self):
    return f'Заказ пользователя: {self.id}. ФИО: {self.user.fullname}'
  
  class Meta:
    verbose_name = "Заказ"
    verbose_name_plural = "Заказы"


class OrderItem(models.Model):
  order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
  product = models.ForeignKey(Product, on_delete=models.CASCADE)
  quantity = models.PositiveIntegerField(default=1)
  price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

  def __str__(self) -> str:
    return f"Продукт: {self.product} заказа {self.order.id}"

  def save(self, *args, **kwargs):
    if not self.id:
      self.price = self.product.price
    
    if self.quantity >= 1:
      self.price = self.product.price * self.quantity
    super().save(*args, **kwargs)

  class Meta:
    verbose_name = "Элемент заказа"
    verbose_name_plural = "Элементы заказа"