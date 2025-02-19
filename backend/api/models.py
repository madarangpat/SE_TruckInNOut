from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    SUPER_ADMIN = 'super_admin'
    ADMIN = 'admin'
    EMPLOYEE = 'employee'

    ROLE_CHOICES = [
        (SUPER_ADMIN, 'Super Admin'),
        (ADMIN, 'Admin'),
        (EMPLOYEE, 'Employee'),
    ]

    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default=EMPLOYEE)
    cellphone_no = models.CharField(max_length=15, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    philhealth_no = models.CharField(max_length=20, unique=True, null=True, blank=True)
    pag_ibig_no = models.CharField(max_length=20, unique=True, null=True, blank=True)
    sss_no = models.CharField(max_length=20, unique=True, null=True, blank=True)

    groups = models.ManyToManyField(
        'auth.Group', related_name='api_users', blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', related_name='api_users_permissions', blank=True
    )

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Save the User first

        # Import models inside save() to avoid circular import issues
        from api.models import Employee, Administrator

        # Automatically create an Employee record if role is "Employee"
        if self.role == self.EMPLOYEE:
            Employee.objects.get_or_create(user=self)

        # Automatically create an Administrator record if role is "Admin"
        if self.role == self.ADMIN:
            Administrator.objects.get_or_create(user=self)

        # Ensure superusers are always "Super Admin"
        if self.is_superuser and self.role != self.SUPER_ADMIN:
            self.role = self.SUPER_ADMIN
            super().save(*args, **kwargs)

    def get_role(self):
        return self.get_role_display()
    
    get_role.short_description = 'Role'

# ✅ Administrator Model (Automatically created when a user with role "Admin" is added)
class Administrator(models.Model):
    admin_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,  # Automatically delete Administrator when User is deleted
        related_name="administrator_profile"
    )
    salary_report = models.ForeignKey('SalaryReport', on_delete=models.CASCADE, null=True, blank=True)

# ✅ Employee Model (Automatically created when a user with role "Employee" is added)
class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,  # Automatically delete Employee when User is deleted
        related_name="employee_profile"
    )
    trip = models.ForeignKey('Trip', on_delete=models.CASCADE, null=True, blank=True)
    salary = models.ForeignKey('Salary', on_delete=models.CASCADE, null=True, blank=True)
    employee_type = models.CharField(max_length=50, null=True, blank=True)

# ✅ Salary Model
class Salary(models.Model):
    salary_id = models.AutoField(primary_key=True)
    trip = models.ForeignKey('Trip', on_delete=models.CASCADE)
    deductions = models.DecimalField(max_digits=10, decimal_places=2)
    bonuses = models.DecimalField(max_digits=10, decimal_places=2)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    multipliers = models.DecimalField(max_digits=5, decimal_places=2)
    overtime = models.DecimalField(max_digits=10, decimal_places=2)
    additionals = models.DecimalField(max_digits=10, decimal_places=2)

# ✅ Trip Model
class Trip(models.Model):
    trip_id = models.AutoField(primary_key=True)
    vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE)
    destination = models.CharField(max_length=255)
    distance_traveled = models.DecimalField(max_digits=10, decimal_places=2)
    num_of_drops = models.IntegerField()
    curr_drops = models.IntegerField()
    client_info = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

# ✅ Vehicle Model
class Vehicle(models.Model):
    vehicle_id = models.AutoField(primary_key=True)
    vehicle_type = models.CharField(max_length=50)

# ✅ Salary Report Model
class SalaryReport(models.Model):
    salary_report_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True)
    salary = models.ForeignKey(Salary, on_delete=models.CASCADE, null=True, blank=True)
