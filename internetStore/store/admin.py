from django.contrib import admin
from .models import Category, Product, ProductHeart, ProductImage, Review, ReviewHeart, ReviewImage, Comment, CommentHeart, CommentImage, Cart, CartItem, Order, OrderItem


class CategoryAdmin(admin.ModelAdmin):
  list_display = (
    "name",
  )

  ordering = ("name", )


class ProductAdmin(admin.ModelAdmin):
  list_display = (
    "name",
    "description",
    "price",
    "get_categories",
    "mainImage",
    "hearts",
  )

  ordering = ("name", )

  def get_categories(self, obj):
    return ", ".join([category.name for category in obj.categories.all()])
    
  get_categories.short_description = 'Categories'


class ProductHeartAdmin(admin.ModelAdmin):
  list_display = (
    "product",
    "user",
    "created_at"
  )

  ordering = ("created_at", )


class ProductImageAdmin(admin.ModelAdmin):
  list_display = (
    "product",
    "image",
  )

  ordering = ("product", )


class ReviewAdmin(admin.ModelAdmin):
  list_display = (
    "user",
    "product",
    "text",
    "created_at",
    "hearts"
  )

  ordering = ("product", )


class ReviewHeartAdmin(admin.ModelAdmin):
  list_display = (
    "review",
    "user",
    "created_at"
  )

  ordering = ("created_at", )


class ReviewImageAdmin(admin.ModelAdmin):
  list_display = (
    "review",
    "image",
  )

  ordering = ("review", )


class CommentAdmin(admin.ModelAdmin):
  list_display = (
    "review",
    "user",
    "text",
    "created_at",
    "hearts"
  )

  ordering = ("created_at", )


class CommentHeartAdmin(admin.ModelAdmin):
  list_display = (
    "comment",
    "user",
    "created_at",
  )

  ordering = ("created_at", )


class CommentImageAdmin(admin.ModelAdmin):
  list_display = (
    "comment",
    "image"
  )


class CartAdmin(admin.ModelAdmin):
  list_display = (
    "user",
    "created_at"
  )

  ordering = ("created_at", )


class CartItemAdmin(admin.ModelAdmin):
  list_display = (
    "cart",
    "product",
    "quantity"
  )

  ordering = ("cart", )


class OrderAdmin(admin.ModelAdmin):
  list_display = (
    "user",
    "created_at",
    "totalPrice"
  )

  ordering = ("created_at", )


class OrderItemAdmin(admin.ModelAdmin):
  list_display = (
    "order",
    "product",
    "quantity",
    "price"
  )

  ordering = ("order", )


admin.site.register(Category, CategoryAdmin)


admin.site.register(Product, ProductAdmin)
admin.site.register(ProductHeart, ProductHeartAdmin)
admin.site.register(ProductImage, ProductImageAdmin)


admin.site.register(Review, ReviewAdmin)
admin.site.register(ReviewHeart, ReviewHeartAdmin)
admin.site.register(ReviewImage, ReviewImageAdmin)


admin.site.register(Comment, CommentAdmin)
admin.site.register(CommentHeart, CommentHeartAdmin)
admin.site.register(CommentImage, CommentImageAdmin)


admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem, CartItemAdmin)


admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)