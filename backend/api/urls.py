from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import (
    LoginView, UserListView, EmployeeListView, EmployeeDetailView,
    AdministratorListView, AdministratorDetailView,
    SalaryListView, SalaryDetailView,
    TripListView, TripDetailView, TripDetailAPIView,
    VehicleListView, 
    RegisterUserView, RegisterVehicleView, RegisterTripView, get_recent_trips, employee_trip_salaries, update_salary_deductions, delete_vehicle_by_plate,
    SendPasswordLinkView, ResetPasswordView, get_employees, update_salary_configuration, get_all_salary_configurations, calculate_totals,
    EmployeeCreateView, delete_user_by_username, UserProfileView, update_employee_profile, priority_queue_view, get_completed_trips_salaries,
    ValidateResetPasswordTokenView, get_ongoing_trips, generate_gross_payroll_pdf, generate_salary_breakdown_pdf, update_user_profile, TotalViewSet, trips_by_date_range
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
    path('users/profile/update/<int:user_id>/', update_user_profile, name='user-profile-update-view'),

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

    # Trip Checking
    path('trips/by-trip-id/<int:trip_id>/', TripDetailAPIView.as_view(), name='trip-by-tripid'),
    
    # JWT Authentication Routes
    path('login/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path("logout/", TokenBlacklistView.as_view(), name="logout"),
    
    #Generate PDF
    path('employee-trip-salaries/', employee_trip_salaries),
    path('generate_gross_payroll_pdf/', generate_gross_payroll_pdf, name='generate_gross_payroll_pdf'),
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
    path('delete-user-by-username/<str:username>/', delete_user_by_username, name='delete-user-by-username'),
    path('update-salary-deductions/', update_salary_deductions, name='update_salary_deductions'),
    
    #PRIORITY QUEUE
    path('priority-queue/', priority_queue_view),
    
    # Delete Vehicles
    path("delete-vehicle-by-plate/<str:plate_number>/", delete_vehicle_by_plate, name="delete-vehicle-by-plate"),

    # Totals
    path('totals/', TotalViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('totals/<int:pk>/', TotalViewSet.as_view({'get': 'retrieve', 'put': 'update'})),
    path('calculate_totals/', calculate_totals, name='calculate-totals'),

    path('completed-trips-salaries/', get_completed_trips_salaries),
    
    path('trips-by-date-range/', trips_by_date_range, name='trips_by_date_range'),

]
