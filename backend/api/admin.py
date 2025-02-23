from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Administrator, Employee, Salary, Trip, Vehicle, SalaryReport

# ✅ Custom User Admin
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'display_role', 'is_staff', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_superuser')

    def display_role(self, obj):
        return obj.get_role_display()
    display_role.short_description = 'Role'  # Set column name in the admin panel

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'cellphone_no', 'philhealth_no', 'pag_ibig_no', 'sss_no', 'profile_image')}),
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
    list_display = ('trip_id', 'vehicle', 'destination', 'start_date', 'end_date')
    search_fields = ('destination', 'vehicle__plate_number')

# ✅ Register Models in Admin
admin.site.register(User, CustomUserAdmin)
admin.site.register(Administrator)
admin.site.register(Employee)
admin.site.register(Salary)
admin.site.register(Trip, TripAdmin)  # Register with the custom TripAdmin
admin.site.register(Vehicle, VehicleAdmin)  # Register with the custom VehicleAdmin
admin.site.register(SalaryReport, SalaryReportAdmin)  # Register with the custom SalaryReportAdmin
