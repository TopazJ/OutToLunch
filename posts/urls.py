from django.urls import path

from posts import views

urlpatterns = [
    path('<int:page>/', views.index, name='index'),
    path('<str:establishment_id>/<int:page>/', views.establishment_posts, name='establishment_posts'),
    path('user/<str:user_id>/<int:page>/', views.user_posts, name='user_posts'),
    path('search/<str:search_params>/<int:page>/', views.search, name='search'),
    path('create/', views.create, name='create'),
    path('delete/', views.delete, name='delete'),
    path('update/', views.update, name='update'),
    path('vote/', views.vote, name='vote'),
    path('<str:post_id>/', views.post_details, name='post_details'),
]
