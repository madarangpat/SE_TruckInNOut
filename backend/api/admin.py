from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Administrator, Employee, Salary, Trip, Vehicle, SalaryConfiguration

# ✅ Custom User Admin
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'display_role', 'employee_type', 'is_staff', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_superuser')

    def display_role(self, obj):
        return obj.get_role_display() if obj.role else "No Role Assigned"
    display_role.short_description = 'Role'

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'first_name', 'last_name', 'cellphone_no', 'philhealth_no', 'pag_ibig_no', 'sss_no', 'license_no', 'profile_image', 'employee_type')}),  # ✅ Added 'license_no'
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

# ✅ Salary Admin
class SalaryAdmin(admin.ModelAdmin):
    list_display = ('salary_id', 'trip', 'base_salary', 'bonuses', 'additionals', 'vale', 'cash_advance', 'cash_bond', 'charges', 'others', 'sss_loan', 'pagibig_loan')
    search_fields = ('salary_id', 'trip__vehicle__plate_number')  # Adjust this if needed
    list_filter = ('trip',)

# ✅ Administrator Admin
class AdministratorAdmin(admin.ModelAdmin):
    list_display = ('admin_id', 'user')
    search_fields = ('user__username',)

# ✅ Employee Admin
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'user', 'get_employee_type', 'salary')
    search_fields = ('user__username', 'user__employee_type')
    list_filter = ('user__employee_type',)
    
    def get_employee_type(self, obj):
        return obj.user.employee_type  # Fetch employee_type from the associated user
    get_employee_type.short_description = 'Employee Type'

# ✅ Vehicle Admin - Now Displays Plate Number
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('vehicle_id', 'plate_number', 'vehicle_type')
    search_fields = ('plate_number',)
    list_filter = ('vehicle_type',)

# ✅ Trip Admin - Shows Important Trip Info
class TripAdmin(admin.ModelAdmin):
    list_display = ('trip_id', 'vehicle', 'employee', 'helper', 'helper2', 'num_of_drops', 'start_date', 'end_date')
    list_filter = ('vehicle', 'employee', 'helper', 'helper2')
    search_fields = ('vehicle__plate_number', 'employee__user__username', 'helper__user__username', 'helper2__user__username')

    # Optional: You can display the addresses and other lists if needed
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
      
# ✅ SalaryConfiguration Admin
class SalaryConfigurationAdmin(admin.ModelAdmin):
    list_display = ('id', 'sss', 'philhealth', 'pag_ibig')  # Assuming you have these fields
    search_fields = ('sss', 'philhealth', 'pag_ibig')  # Allow searching by these fields
    list_filter = ('sss', 'philhealth', 'pag_ibig')
    
# ✅ Register Models in Admin
admin.site.register(User, CustomUserAdmin)
admin.site.register(Administrator, AdministratorAdmin)  # ✅ Added custom admin
admin.site.register(Employee, EmployeeAdmin)  # ✅ Added custom admin
admin.site.register(Salary)
admin.site.register(Trip, TripAdmin)  # ✅ Register with the custom TripAdmin
admin.site.register(Vehicle, VehicleAdmin)  # ✅ Register with the custom VehicleAdmin
admin.site.register(SalaryConfiguration)
