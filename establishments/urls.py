from django.urls import path

from establishments import views


app_name = 'establishments'

urlpatterns = [
    path('<int:page>/', views.index, name='most_recent'),
    path('create/', views.create, name='create'),
    path('update/', views.update, name='update'),
    path('delete/', views.delete, name='delete'),
    path('search/<str:search_params>/', views.search, name='search'),
    path('flag/', views.flag, name='flag')
]
