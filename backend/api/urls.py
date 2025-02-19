from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import (
    UserListView, EmployeeListView, EmployeeDetailView,
    AdministratorListView, AdministratorDetailView,
    SalaryListView, SalaryDetailView,
    TripListView, TripDetailView,
    VehicleListView, VehicleDetailView,
    SalaryReportListView, SalaryReportDetailView, generate_pdf
)

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),

    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('employees/<int:pk>/', EmployeeDetailView.as_view(), name='employee-detail'),

    path('admins/', AdministratorListView.as_view(), name='admin-list'),
    path('admins/<int:pk>/', AdministratorDetailView.as_view(), name='admin-detail'),

    path('salaries/', SalaryListView.as_view(), name='salary-list'),
    path('salaries/<int:pk>/', SalaryDetailView.as_view(), name='salary-detail'),

    path('trips/', TripListView.as_view(), name='trip-list'),
    path('trips/<int:pk>/', TripDetailView.as_view(), name='trip-detail'),

    path('vehicles/', VehicleListView.as_view(), name='vehicle-list'),
    path('vehicles/<int:pk>/', VehicleDetailView.as_view(), name='vehicle-detail'),

    path('salary-reports/', SalaryReportListView.as_view(), name='salary-report-list'),
    path('salary-reports/<int:pk>/', SalaryReportDetailView.as_view(), name='salary-report-detail'),

    # JWT Authentication Routes
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path("logout/", TokenBlacklistView.as_view(), name="logout"),
    
    #Generate PDF
    path("generate-pdf/", generate_pdf, name="generate_pdf"),
]
