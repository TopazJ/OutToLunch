from django.urls import path

from comments import views

urlpatterns = [
    path('count/<str:post_id>/', views.comment_count, name='count'),
    path('create/', views.create, name='create'),
    path('delete/', views.delete, name='delete'),
    path('update/', views.update, name='update'),
    path('<str:post_id>/<int:page>/', views.index, name='index'),
]
