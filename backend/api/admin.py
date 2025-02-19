from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Administrator, Employee, Salary, Trip, Vehicle, SalaryReport

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'display_role', 'is_staff', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_superuser')

    def display_role(self, obj):
        return obj.get_role_display()
    display_role.short_description = 'Role'  # Set column name in the admin panel

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'cellphone_no', 'philhealth_no', 'pag_ibig_no', 'sss_no')}),
        ('Permissions', {'fields': ('role', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'is_staff', 'is_superuser'),
        }),
    )

    search_fields = ('username', 'email')
    ordering = ('username',)

admin.site.register(User, CustomUserAdmin)
admin.site.register(Administrator)
admin.site.register(Employee)
admin.site.register(Salary)
admin.site.register(Trip)
admin.site.register(Vehicle)
admin.site.register(SalaryReport)
