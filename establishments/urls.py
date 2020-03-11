from django.urls import path

from establishments import views

urlpatterns = [
    path('', views.index, name='index'),
    #path('create/', views.create_establishment, name='create'),
    #path('delete/', views.delete_establishment, name='delete'),
    #path('update/', views.update_establishment, name='update'),
]
