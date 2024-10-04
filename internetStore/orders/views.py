from django.shortcuts import render, redirect
from store.models import Order

def getPageOfOrders(request):
  if not request.user.is_authenticated:
    request.session['error'] = 'Нужно войти в аккаунт'
    return redirect('mainPage')
  
  orders = Order.objects.filter(user=request.user.profile)

  return render(
    request,
    'orders/templates/orders.html',
    context={
      'orders': orders,
    }
  )