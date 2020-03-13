from django.urls import path

from comments import views

urlpatterns = [
    path('', views.index, name='index'),
    #path('create/', views.create_comment, name='create'),
    #path('delete/', views.delete_comment, name='delete'),
    #path('update/', views.update_comment, name='update'),
]
