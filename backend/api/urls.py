from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import (
    LoginView, UserListView, EmployeeListView, EmployeeDetailView,
    AdministratorListView, AdministratorDetailView,
    SalaryListView, SalaryDetailView,
    TripListView, TripDetailView,
    VehicleListView, VehicleDetailView,
    RegisterUserView, RegisterVehicleView, RegisterTripView, get_recent_trips, employee_trip_salaries, update_salary_deductions,
    SendPasswordLinkView, ResetPasswordView, get_vehicles, get_employees, get_users, update_salary_configuration, get_all_salary_configurations,
    EmployeeCreateView, delete_user, get_employee_profile, UserProfileView, update_employee_profile, UserUpdateView, priority_queue_view,
    ValidateResetPasswordTokenView, get_ongoing_trips, generate_gross_payroll_pdf, generate_salary_breakdown_pdf, update_user_profile
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
    path("update_user/<int:user_id>/", update_user_profile, name="update_user_profile"),

    path('employees/create/', EmployeeCreateView.as_view(), name='employee-create'),
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('employees/<int:pk>/', EmployeeDetailView.as_view(), name='employee-detail'),
    path("employee/update-profile/", update_employee_profile, name="update-profile"),

    path('admins/', AdministratorListView.as_view(), name='admin-list'),
    path('admins/<int:pk>/', AdministratorDetailView.as_view(), name='admin-detail'),

    path('salaries/', SalaryListView.as_view(), name='salary-list'),
    path('salaries/<int:pk>/', SalaryDetailView.as_view(), name='salary-detail'),

    #Trip Assignment
    path("trips/recent/", get_recent_trips, name="get-recent-trips"),
    path("trips/ongoing/", get_ongoing_trips, name="get-ongoing-trips"),
    path('trips/', TripListView.as_view(), name='trip-list'),
    path('trips/<int:pk>/', TripDetailView.as_view(), name='trip-detail'),

    # JWT Authentication Routes
    path('login/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path("logout/", TokenBlacklistView.as_view(), name="logout"),
    
    #Generate PDF
    path('employee-trip-salaries/', employee_trip_salaries),
    
    # path("generate-pdf/", generate_pdf, name="generate_pdf"),
    path("generate-pdf/gross-payroll/", generate_gross_payroll_pdf, name="generate_gross_payroll_pdf"),
    path("generate-pdf/salary-breakdown/", generate_salary_breakdown_pdf, name="generate_salary_breakdown_pdf"),
    
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
    path('salary-configurations/<int:configId>/', update_salary_configuration, name='salary-configuration-update'),
    path('salary-configurations/', get_all_salary_configurations, name='salary-configuration-list'),  # For listing all salary configs
    
    #Delete User
    path('delete-user/<int:user_id>/', delete_user, name='delete-user'), 
    path('update-salary-deductions/', update_salary_deductions, name='update_salary_deductions'),
    
    #Priority Queue
    path('priority-queue/', priority_queue_view),
]
