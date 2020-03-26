from django.urls import path

from establishments import views


app_name = 'establishments'

urlpatterns = [
    path('', views.index, name='index'),
    path('create/', views.create, name='create'),
    path('delete/', views.delete, name='delete'),
    path('update/', views.update, name='update'),
    path('search/', views.update, name='search')
]
