from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Administrator, Employee, Salary, Trip, Vehicle, SalaryReport, SalaryConfiguration

# ✅ Custom User Admin
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'display_role', 'is_staff', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_superuser')

    def display_role(self, obj):
        return obj.get_role_display() if obj.role else "No Role Assigned"
    display_role.short_description = 'Role'

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'first_name', 'last_name', 'cellphone_no', 'philhealth_no', 'pag_ibig_no', 'sss_no', 'license_no', 'profile_image')}),  # ✅ Added 'license_no'
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


# ✅ Administrator Admin
class AdministratorAdmin(admin.ModelAdmin):
    list_display = ('admin_id', 'user', 'salary_report')
    search_fields = ('user__username',)

# ✅ Employee Admin
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'user', 'employee_type', 'salary')
    search_fields = ('user__username', 'employee_type')
    list_filter = ('employee_type',)

# ✅ Vehicle Admin - Now Displays Plate Number
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('vehicle_id', 'plate_number', 'vehicle_type')
    search_fields = ('plate_number',)
    list_filter = ('vehicle_type',)

# ✅ Salary Report Admin - To Easily Manage Reports
class SalaryReportAdmin(admin.ModelAdmin):
    list_display = ('salary_report_id', 'employee', 'salary')
    search_fields = ('employee__user__username',)

# ✅ Trip Admin - Shows Important Trip Info
class TripAdmin(admin.ModelAdmin):
    list_display = ('trip_id', 'vehicle', 'get_full_destination', 'assignment_status', 'start_date', 'end_date')
    search_fields = ('vehicle__plate_number', 'street_name', 'barangay', 'city', 'province')   
    list_filter = ('assignment_status',)
    
# ✅ Register Models in Admin
admin.site.register(User, CustomUserAdmin)
admin.site.register(Administrator, AdministratorAdmin)  # ✅ Added custom admin
admin.site.register(Employee, EmployeeAdmin)  # ✅ Added custom admin
admin.site.register(Salary)
admin.site.register(Trip, TripAdmin)  # ✅ Register with the custom TripAdmin
admin.site.register(Vehicle, VehicleAdmin)  # ✅ Register with the custom VehicleAdmin
admin.site.register(SalaryReport, SalaryReportAdmin)  # ✅ Register with the custom SalaryReportAdmin
admin.site.register(SalaryConfiguration)
