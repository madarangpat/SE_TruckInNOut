from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Administrator, Employee, Salary, Trip, Vehicle, SalaryConfiguration, Total, EmployeeLocation

#=============================================================================================================================================================================================================
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'display_role', 'employee_type', 'is_staff', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_superuser')

    def display_role(self, obj):
        return obj.get_role_display() if obj.role else "No Role Assigned"
    display_role.short_description = 'Role'

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'first_name', 'last_name', 'cellphone_no', 'philhealth_no', 'pag_ibig_no', 'sss_no', 'license_no', 'profile_image', 'employee_type')}),
        ('Permissions', {'fields': ('role', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'profile_image', 'is_staff', 'is_superuser'),
        }),
    )

    search_fields = ('username', 'email')
    ordering = ('username',)
    
#=============================================================================================================================================================================================================
class SalaryAdmin(admin.ModelAdmin):
    list_display = ('salary_id', 'trip', 'base_salary', 'bonuses', 'additionals', 'vale', 'cash_advance', 'cash_bond', 'charges', 'others', 'sss_loan', 'pagibig_loan')
    search_fields = ('salary_id', 'trip__vehicle__plate_number')
    list_filter = ('trip',)

#=============================================================================================================================================================================================================
class AdministratorAdmin(admin.ModelAdmin):
    list_display = ('admin_id', 'user')
    search_fields = ('user__username',)

#=============================================================================================================================================================================================================
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'user', 'get_employee_type', 'salary', 'payment_status')
    search_fields = ('user__username', 'user__employee_type')
    list_filter = ('user__employee_type',)
    
    def get_employee_type(self, obj):
        return obj.user.employee_type
    get_employee_type.short_description = 'Employee Type'

#=============================================================================================================================================================================================================
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('vehicle_id', 'plate_number', 'vehicle_type', 'subcon_name')
    search_fields = ('plate_number',)
    list_filter = ('vehicle_type',)

#=============================================================================================================================================================================================================
class TripAdmin(admin.ModelAdmin):
    list_display = (
        'trip_id', 'vehicle', 'employee', 'helper', 'helper2',  'driver_base_salary', 'helper_base_salary', 'additionals',
        'num_of_drops',  'user_lat', 'user_lng', 'start_date', 'end_date', 'trip_description', 'trip_origin'
    )
    list_filter = ('vehicle', 'employee', 'helper', 'helper2')
    search_fields = (
        'vehicle__plate_number', 'employee__user__username', 'helper__user__username', 
        'helper2__user__username'
    )

    def get_addresses(self, obj):
        return ", ".join(obj.addresses)
    get_addresses.short_description = "Addresses"
    
    def get_clients(self, obj):
        return ", ".join(obj.clients)
    get_clients.short_description = "Clients"

    def get_user_lat(self, obj):
        return ", ".join(map(str, obj.user_lat))
    get_user_lat.short_description = "User Latitudes"

    def get_user_lng(self, obj):
        return ", ".join(map(str, obj.user_lng))
    get_user_lng.short_description = "User Longitudes"

    def get_dest_lat(self, obj):
        return ", ".join(map(str, obj.dest_lat))
    get_dest_lat.short_description = "Destination Latitudes"

    def get_dest_lng(self, obj):
        return ", ".join(map(str, obj.dest_lng))
    get_dest_lng.short_description = "Destination Longitudes"

    def get_completed(self, obj):
        return ", ".join(map(str, obj.completed))
    get_completed.short_description = "Completion Status"
    
    def get_base_salary(self, obj):
        return obj.base_salary
    get_base_salary.short_description = "Base Salary"

    def get_additionals(self, obj):
        return obj.additionals
    get_additionals.short_description = "Additionals"
  
#=============================================================================================================================================================================================================    
class SalaryConfigurationAdmin(admin.ModelAdmin):
    list_display = ('id', 'sss', 'philhealth', 'pag_ibig')
    search_fields = ('sss', 'philhealth', 'pag_ibig')
    list_filter = ('sss', 'philhealth', 'pag_ibig')
    
#=============================================================================================================================================================================================================  
class TotalAdmin(admin.ModelAdmin):
    list_display = (
        'totals_id',
        'start_date',
        'end_date',
        'total_base_salary',
        'total_additionals',
        'total_bonuses',
        'total_charges',
        'total_bale',
        'total_cash_advance',
        'total_bond',
        'total_sss',
        'total_sss_loan',
        'total_philhealth',
        'total_pagibig',
        'total_pagibig_loan',
        'total_others',
        'overall_total',
        'created_date',
    )
    search_fields = ('totals_id', 'start_date', 'end_date')
    list_filter = ('start_date', 'end_date','created_date')
    
#=============================================================================================================================================================================================================
class EmployeeLocationAdmin(admin.ModelAdmin):
    list_display = ('employee', 'latitude', 'longitude', 'updated_at')
    search_fields = ('employee__user__username',)
    list_filter = ('updated_at',)
#=============================================================================================================================================================================================================
class EmployeeLocationAdmin(admin.ModelAdmin):
    list_display = ('employee', 'latitude', 'longitude', 'updated_at', 'timestamp')
    search_fields = ('employee__user__username',)
    list_filter = ('updated_at',)
    

admin.site.register(User, CustomUserAdmin)
admin.site.register(Administrator, AdministratorAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Salary)
admin.site.register(Trip, TripAdmin)
admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(SalaryConfiguration)
admin.site.register(Total, TotalAdmin)
admin.site.register(EmployeeLocation, EmployeeLocationAdmin)