from django.urls import path

from posts import views

urlpatterns = [
    path('<int:page>/', views.index, name='index'),
    path('<str:establishment_id>/<int:page>/', views.establishment_posts, name='establishment_posts'),
    path('create/', views.create, name='create'),
    path('delete/', views.delete, name='delete'),
    path('update/', views.update, name='update'),
]
