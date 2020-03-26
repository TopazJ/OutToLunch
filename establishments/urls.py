from django.urls import path

from establishments import views


app_name = 'establishments'

urlpatterns = [
    path('', views.index, name='index'),
    path('create/', views.create, name='create'),
    path('update/', views.update, name='update'),
    path('search/', views.search, name='search'),
    path('flag/', views.flag, name='search')
]
