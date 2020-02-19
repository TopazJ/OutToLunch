from django.urls import path

from establishments import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create/', views.create_establishment, name='create establishment'),

]
