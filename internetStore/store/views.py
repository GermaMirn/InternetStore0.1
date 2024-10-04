from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.views.decorators.http import require_http_methods
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from accounts.models import Profile
from .models import Category, Product, ProductHeart, Review, Comment, ReviewHeart, CommentHeart, ReviewImage, CommentImage, Cart, CartItem, Order, OrderItem
from django.core.paginator import Paginator
from django.db.models import Count
import json


def mainPage(request):
  error = request.session.pop('error', None)

  popularProducts = Product.objects.annotate(hearts_count=Count('product_hearts')).order_by('-hearts_count')[:5]
  
  if error:
    return render(
      request,
      'store/templates/main.html',
      context={
        'user': request.user,
        'error': error,
        'popularProducts': popularProducts,
      }
    )

  return render(
    request,
    'store/templates/main.html',
    context={
      'user': request.user,
      'popularProducts': popularProducts,
    }
  )


def searchPage(request):
  pageNumber = int(request.GET.get("page", 1))
  allProduct = Product.objects.all().order_by("name")

  tags = request.GET.get("tags")
  if tags:
    tagList = tags.split(',')
    allProduct = allProduct.filter(categories__name__in=tagList).distinct()
  
  searchField = request.GET.get("searchInput")
  if searchField:
    allProduct = allProduct.filter(name__icontains=searchField)

  product_paginator = Paginator(allProduct, 6)

  try:
    page = product_paginator.page(pageNumber)
  except:
    page = product_paginator.page(1)

  if request.user.is_authenticated:
    try:
      profile = request.user.profile
      userHearts = ProductHeart.objects.filter(user=profile).values_list('product_id', flat=True)
    except:
      userHearts = []
  else:
    userHearts = []

  productsData = []
  for product in page.object_list:
    categories = list(product.categories.values_list('name', flat=True))
    mainImageUrl = product.mainImage.url if product.mainImage else None
    imagesURL = [image.image.url for image in product.productImages.all()] if product.productImages.exists() else []

    isHearted = product.id in userHearts

    # if tag:
    #   if tag not in categories:
    #     categories = tag

    productsData.append({
      'id': product.id,
      'name': product.name,
      'description': product.description,
      'price': str(product.price),
      'categories': categories,
      'imagesURL': imagesURL,
      'mainImageUrl': mainImageUrl,
      'hearts': product.hearts,
      'isHearted': 'true' if isHearted else 'false',
    })

  return render(
    request,
    "store/templates/searchPage.html",
    context={
      "page": page,
      'current_page': page.number,
      'total_pages': product_paginator.num_pages,
      'products': productsData,
      'currentTags': tagList if tags else [],
      'searchInput': searchField,
    }
  )


@login_required
@require_http_methods(["POST", "DELETE"])
def heart(request):
  data = json.loads(request.body)
  product_id = data.get('productID')
  product = Product.objects.get(id=product_id)
  try:
    profile = Profile.objects.get(user=request.user)
  except:
    return JsonResponse({'error': 'Профиль не найден'}, status=404)

  if request.method == 'POST':
    heart = ProductHeart.objects.get_or_create(product=product, user=profile)

    return JsonResponse({'hearts': product.hearts})
  
  elif request.method == 'DELETE':
    try:
      heart = ProductHeart.objects.get(product=product, user=profile)
      heart.delete()
        
      return JsonResponse({'hearts': product.hearts})
    except ProductHeart.DoesNotExist:
      return JsonResponse({'error': 'Лайк не найден'}, status=404)


def productDetail(request, id):
  product = get_object_or_404(Product, id=id)

  product.detailViews += 1
  product.save()

  imagesURL = [image.image.url for image in product.productImages.all()] if product.productImages.exists() else []  

  isHearted = False
  if request.user.is_authenticated:
    try:
      profile = request.user.profile
      isHearted = ProductHeart.objects.filter(user=profile, product=product).exists()
    except Profile.DoesNotExist:
      pass

  reviews = product.reviews.all().prefetch_related('comments')

  likedReview = []
  likedComment = []
  if request.user.is_authenticated:
    likedReview = ReviewHeart.objects.filter(user=profile).values_list('review_id', flat=True)
    likedComment = CommentHeart.objects.filter(user=profile).values_list('comment_id', flat=True)

  return render(
    request,
    'store/templates/productDetail.html',
    context={
      'product': product,
      'imagesURL': imagesURL,
      'isHearted': 'true' if isHearted else 'false',
      'reviews': reviews,
      'likedReview': likedReview,
      'likedComment': likedComment,
    }
  )


def addFastViews(request, product_id):
  product = get_object_or_404(Product, id=product_id)

  product.fastViews += 1
  product.save()

  return JsonResponse({'success': True})


def addReview(request, product_id):
  if request.method == 'POST':
    product = get_object_or_404(Product, id=product_id)
    reviewText = request.POST.get('review')

    if reviewText:
      review = Review.objects.create(
        product=product,
        user=request.user.profile,
        text=reviewText
      )

      if 'image' in request.FILES:
        images = request.FILES.getlist('image')
        imagesURL = []
        for img in images:
          reviewImg = ReviewImage.objects.create(
            review=review,
            image=img
          )
          imagesURL.append(reviewImg.image.url)

        responseData = {
          'status': 'success',
          'review': {
            'id': review.id,
            'created_at': review.created_at.strftime("%Y-%m-%d %H:%M"),
            'user': {
              'id': review.user.user.id,
              'username': review.user.user.username
            },
            'text': review.text,
            'images': imagesURL,
          }
        }
      else:
        responseData = {
          'status': 'success',
          'review': {
            'id': review.id,
            'created_at': review.created_at.strftime("%Y-%m-%d %H:%M"),
            'user': {
              'id': review.user.user.id,
              'username': review.user.user.username
            },
            'text': review.text,
            'images': [],
          }
        }

      return JsonResponse({'responseData': responseData})

  return JsonResponse({'status': 'error'}, status=400)


@login_required
@require_http_methods(["POST", "DELETE"])
def addReviewHeart(request, review_id):
  try:
    review = Review.objects.get(id=review_id)
    profile = Profile.objects.get(user=request.user)
  except Review.DoesNotExist:
    return JsonResponse({'error': 'Отзыв не найден'}, status=404)
  except Profile.DoesNotExist:
    return JsonResponse({'error': 'Профиль не найден'}, status=404)

  if request.method == 'POST':
    heart, created = ReviewHeart.objects.get_or_create(review=review, user=profile)

    return JsonResponse({'success': True, 'hearts': review.hearts, 'isHearted': created})

  elif request.method == 'DELETE':
    try:
      heart = ReviewHeart.objects.get(review=review, user=profile)
      heart.delete()

      review = Review.objects.get(id=review_id) 
      
      return JsonResponse({'success': True, 'hearts': review.hearts})
    except ReviewHeart.DoesNotExist:
      return JsonResponse({'error': 'Лайк не найден'}, status=404)

  return JsonResponse({'success': False})
  

def addComment(request, review_id):
  if request.method == 'POST':
    review = get_object_or_404(Review, id=review_id)
    comment_text = request.POST.get('comment')

    if comment_text:
      comment = Comment.objects.create(
        review=review,
        user=request.user.profile,
        text=comment_text
      )

      if 'image' in request.FILES:
        images = request.FILES.getlist('image')
        imagesURL = []
        for img in images:
          commentImg = CommentImage.objects.create(
            comment=comment,
            image=img
          )
          imagesURL.append(commentImg.image.url)
        
        responseData = {
          'status': 'success',
          'comment': {
            'id': comment.id,
            'created_at': comment.created_at.strftime("%Y-%m-%d %H:%M"),
            'user': {
              'id': comment.user.user.id,
              'username': comment.user.user.username
            },
            'text': comment.text,
            'images': imagesURL,
          },
          'review': {
            'id': review_id,
          }
        }

      else:
        responseData = {
          'status': 'success',
          'comment': {
            'id': comment.id,
            'created_at': comment.created_at.strftime("%Y-%m-%d %H:%M"),
            'user': {
              'id': comment.user.user.id,
              'username': comment.user.user.username
            },
            'text': comment.text,
            'images': [],
          },
          'review': {
            'id': review_id,
          }
        }
      
      return JsonResponse({'responseData': responseData})

  return JsonResponse({'status': 'error'}, status=400)


@login_required
@require_http_methods(["POST", "DELETE"])
def addCommentHeart(request, comment_id):
  try:
    comment = Comment.objects.get(id=comment_id)
    profile = Profile.objects.get(user=request.user)
  except Comment.DoesNotExist:
    return JsonResponse({'error': 'Комментарий не найден'}, status=404)
  except Profile.DoesNotExist:
    return JsonResponse({'error': 'Профиль не найден'}, status=404)

  if request.method == 'POST':
    heart, created = CommentHeart.objects.get_or_create(comment=comment, user=profile)
    
    return JsonResponse({'success': True, 'hearts': comment.hearts, 'isHearted': created})

  elif request.method == 'DELETE':
    try:
      heart = CommentHeart.objects.get(comment=comment, user=profile)
      heart.delete()

      comment = Comment.objects.get(id=comment_id)
      
      return JsonResponse({'success': True, 'hearts': comment.hearts})
    except CommentHeart.DoesNotExist:
      return JsonResponse({'error': 'Лайк не найден'}, status=404)

  return JsonResponse({'success': False})
      

def shoppingCart(request):
  if not request.user.is_authenticated:
    request.session['error'] = 'Нужно войти в аккаунт'
    return redirect('mainPage')

  cart, created = Cart.objects.get_or_create(user=request.user.profile)
  cartItems = CartItem.objects.filter(cart=cart)

  return render(
    request,
    'store/templates/shoppingCart.html',
    context={
      'cartItems': cartItems,
    }
  )


def addToCart(request, product_id):
    if not request.user.is_authenticated:
      return JsonResponse({'success': False, 'message': 'Нужно войти в аккаунт'})

    product = get_object_or_404(Product, id=product_id)

    try:
      cart, created = Cart.objects.get_or_create(user=request.user.profile)

      cartItem, created = CartItem.objects.get_or_create(cart=cart, product=product)

      if created:
        cartItem.quantity = 1
        cartItem.save()
        return JsonResponse({'success': True, 'message': 'Товар добавлен в корзину.'})
      else:
        return JsonResponse({'success': False, 'message': 'Товар уже был добавлен в корзину.'})

    except Exception as e:
      return JsonResponse({'success': False, 'message': 'Не удалось добавить товар.'})


def removeFromCart(request, item_id):
  if not request.user.is_authenticated:
    return JsonResponse({'success': False, 'message': 'Нужно войти в аккаунт'})

  try:
    cartItem = get_object_or_404(CartItem, id=item_id)
    cartItem.delete()

    return JsonResponse({'success': True})
  except:
    return JsonResponse({'success': False, 'message': 'Не удолось удалить продукт'})


def addOneCountOfCartProduct(request, cartItem_id):
  if not request.user.is_authenticated:
    return JsonResponse({'success': False, 'message': 'Нужно войти в аккаунт'})
  
  try:
    cartItem = CartItem.objects.get(id=cartItem_id)
    priceBeforeAdd = cartItem.price
    cartItem.quantity += 1
    cartItem.save()
    return JsonResponse({'success': True, 'CartItemName': cartItem.product.name, 'newQuantity': cartItem.quantity, 'newPrice': cartItem.price, 'priceBeforeAdd': cartItem.price - priceBeforeAdd})
  
  except CartItem.DoesNotExist:
    return JsonResponse({'success': False, 'message': 'Товар не найден в корзине'})
    

def deleteOneCountOfCartProduct(request, cartItem_id):
  if not request.user.is_authenticated:
    return JsonResponse({'success': False, 'message': 'Нужно войти в аккаунт'})
  
  try:
    cartItem = CartItem.objects.get(id=cartItem_id)
    if cartItem.quantity > 1:
      priceBeforeRemove = cartItem.price
      cartItem.quantity -= 1
      cartItem.save()
      return JsonResponse({'success': True, 'CartItemName': cartItem.product.name, 'newQuantity': cartItem.quantity, 'newPrice': cartItem.price, 'priceBeforeRemove': priceBeforeRemove - cartItem.price})
    
    elif cartItem.quantity == 1:
      return JsonResponse({'success': True, 'CartItemName': cartItem.product.name, 'newQuantity': 1, 'newPrice': cartItem.price, 'cartiItemRemove': 0})
    
  except CartItem.DoesNotExist:
    return JsonResponse({'success': False, 'message': 'Товар не найден в корзине'})


def logoutUser(request):
    logout(request)
    return redirect('mainPage')


def createOrder(request):
  if request.method == 'POST':
    data = json.loads(request.body)
    items = data.get('items')
    totalPrice = data.get('totalPrice')

    if not request.user.is_authenticated:
      return JsonResponse({'success': False, 'message': 'Нужно войти в аккаунт'})
    
    order = Order.objects.create(
      user=request.user.profile,
      totalPrice=totalPrice,
    )

    for item in items:
      cart_item_id = item['id']
      quantity = item['quantity']

      try:
          cart_item = CartItem.objects.get(id=cart_item_id)

          OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            quantity=quantity,
            price=cart_item.price,
          )

          cart_item.delete()

      except CartItem.DoesNotExist:
        return JsonResponse({'success': False, 'message': f'Элемент корзины {item["product"]} не найден.'})

    return JsonResponse({'success': True, 'message': 'Заказ успешно создан'})

  return JsonResponse({'success': False, 'message': 'Неверный метод запроса'})