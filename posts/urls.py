from django.urls import path

from posts import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create/', views.create_post, name='create'),
    path('delete/', views.delete_post, name='delete'),
    path('update/', views.update_post, name='update'),
]
