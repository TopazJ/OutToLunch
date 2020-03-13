from django.urls import path

from establishments import views


app_name = 'establishments'

urlpatterns = [
    path('', views.index, name='index'),
    path('getone/', views.get_one_establishment, name = 'something'),
    #path('create/', views.create_establishment, name='create'),
    #path('delete/', views.delete_establishment, name='delete'),
    #path('update/', views.update_establishment, name='update'),
]
