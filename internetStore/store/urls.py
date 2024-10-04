from django.urls import path, re_path
from .views import searchPage, mainPage, logoutUser, shoppingCart, addFastViews, heart, productDetail, addReview, addReviewHeart, addComment, addCommentHeart, addToCart, removeFromCart, addOneCountOfCartProduct, deleteOneCountOfCartProduct, createOrder
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    re_path(r'^searchPage/?$', searchPage, name='searchPage'),
    path('addFastViews/<int:product_id>/', addFastViews, name='addFastViews'),
    path('searchPage/tag=<str:tag>/', searchPage, name='searchPageWithTag'),
    path('heart/', heart, name='heart'),
    path('searchPage/product/<int:id>/', productDetail, name='productDetail'),
    path('searchPage/<int:product_id>/addReview/', addReview, name='addReview'),
    path('searchPage/<int:review_id>/addReviewHeart/', addReviewHeart, name='addReviewHeart'),
    path('searchPage/<int:review_id>/addComment/', addComment, name='addComment'),
    path('searchPage/<int:comment_id>/addCommentHeart/', addCommentHeart, name='addCommentHeart'),
    re_path(r'^welcome/?$', mainPage, name='mainPage'),
    re_path(r'^logout/?$', logoutUser, name='logout'),
    re_path(r'^shoppingCart/?$', shoppingCart, name='shoppingCart'),
    path('cart/add/<int:product_id>/', addToCart, name='addToCart'),
    path('cart/remove/<int:item_id>/', removeFromCart, name='removeFromCart'),
    path('cart/<int:cartItem_id>/add/', addOneCountOfCartProduct, name='addOneCountOfCartProduct'),
    path('cart/<int:cartItem_id>/remove/', deleteOneCountOfCartProduct, name='deleteOneCountOfCartProduct'),
    path('shoppingCart/createOrder/', createOrder, name='createOrder'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)