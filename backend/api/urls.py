from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import (
    LoginView, UserListView, EmployeeListView, EmployeeDetailView,
    AdministratorListView, AdministratorDetailView,
    SalaryListView, SalaryDetailView,
    TripListView, TripDetailView,
    VehicleListView, VehicleDetailView,
    SalaryReportListView, SalaryReportDetailView, generate_pdf, RegisterUserView, RegisterVehicleView, RegisterTripView, decline_trip, get_assigned_trip, get_recent_trips,
    SendPasswordLinkView, ResetPasswordView, get_vehicles, get_employees, get_users, SalaryConfigurationListCreateView, SalaryConfigurationRetrieveUpdateDestroyView,
    EmployeeCreateView, delete_user, get_employee_profile, UserProfileView, update_employee_profile, UserUpdateView,
    ValidateResetPasswordTokenView, accept_trip, get_ongoing_trips, SalaryConfigurationGlobalView,
)
from django.contrib.auth.views import (
    PasswordResetView,
    PasswordResetConfirmView,
    PasswordResetCompleteView,
    PasswordResetDoneView,
)


urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/profile/', UserProfileView.as_view(), name='user-profile-view'),
    path('users/profile/update/', UserUpdateView.as_view(), name='user-profile-update-view'),

    path('employees/create/', EmployeeCreateView.as_view(), name='employee-create'),
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('employees/<int:pk>/', EmployeeDetailView.as_view(), name='employee-detail'),
    path("employee/update-profile/", update_employee_profile, name="update-profile"),

    path('admins/', AdministratorListView.as_view(), name='admin-list'),
    path('admins/<int:pk>/', AdministratorDetailView.as_view(), name='admin-detail'),

    path('salaries/', SalaryListView.as_view(), name='salary-list'),
    path('salaries/<int:pk>/', SalaryDetailView.as_view(), name='salary-detail'),

    path('trips/', TripListView.as_view(), name='trip-list'),
    path('trips/<int:pk>/', TripDetailView.as_view(), name='trip-detail'),

    path('salary-reports/', SalaryReportListView.as_view(), name='salary-report-list'),
    path('salary-reports/<int:pk>/', SalaryReportDetailView.as_view(), name='salary-report-detail'),

    # JWT Authentication Routes
    path('login/', LoginView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path("logout/", TokenBlacklistView.as_view(), name="logout"),
    
    #Generate PDF
    path("generate-pdf/", generate_pdf, name="generate_pdf"),
    
    #Add Account
    path('register/', RegisterUserView.as_view(), name='register'),
    
    #Add Vehicle
    path('register-vehicle/', RegisterVehicleView.as_view(), name='create_vehicle'),
    
    #Add Trip
    path('register-trip/', RegisterTripView.as_view(), name='create_trip'),
    
    #Password Reset
    path("password-reset/", SendPasswordLinkView.as_view(), name="password_reset"),
    path("password-reset-confirm/<str:token>/", ResetPasswordView.as_view(), name="password_reset_confirm"),
    path(
        "password-reset/validate/",
        ValidateResetPasswordTokenView.as_view(),
        name="password-reset-validate/",
    ),

    #CREATE NEW TRIP GET VEHICLES
    path('vehicles/', VehicleListView.as_view(), name='vehicle_list'),
    
    #CREATE NEW TRIP GET EMPLOYEES
    path('employees/', get_employees, name='get_employees'),
    
    # SalaryConfiguration API Routes
    path('salary-configurations/', SalaryConfigurationListCreateView.as_view(), name='salary-configuration-list-create'),
    path('salary-configurations/<int:pk>/', SalaryConfigurationRetrieveUpdateDestroyView.as_view(), name='salary-configuration-detail'),
    path('salary-configurations/global/', SalaryConfigurationGlobalView.as_view(), name='salary-configuration-global'),
    
    #Delete User
    path('delete-user/<int:user_id>/', delete_user, name='delete-user'),
    
    #Trip Assignment
    path('trips/<int:trip_id>/decline/', decline_trip, name='decline-trip'),
    
    path("trips/assigned/", get_assigned_trip, name="get-assigned-trip"),
    path("trips/recent/", get_recent_trips, name="get-recent-trips"),
    path('trips/<int:trip_id>/accept/', accept_trip, name='accept-trip'),
    path("trips/ongoing/", get_ongoing_trips, name="get-ongoing-trips"),


]
