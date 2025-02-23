from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from .validators import validate_image
from .utils import remove_file_from_s3
from storages.backends.s3boto3 import S3Boto3Storage

class User(AbstractUser):
    SUPER_ADMIN = 'super_admin'
    ADMIN = 'admin'
    EMPLOYEE = 'employee'

    ROLE_CHOICES = [
        (SUPER_ADMIN, 'Super Admin'),
        (ADMIN, 'Admin'),
        (EMPLOYEE, 'Employee'),
    ]

    role = models.CharField(
        max_length=15, 
        choices=ROLE_CHOICES, 
        null=True,  # ✅ Allows NULL in the database
        blank=True  # ✅ Allows empty values when creating a user
    )
    cellphone_no = models.CharField(max_length=15, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    philhealth_no = models.CharField(max_length=20, unique=True, null=True, blank=True)
    pag_ibig_no = models.CharField(max_length=20, unique=True, null=True, blank=True)
    sss_no = models.CharField(max_length=20, unique=True, null=True, blank=True)
    profile_image = models.ImageField(
        upload_to="user-media",
        validators=[
            validate_image,
            FileExtensionValidator(["jpg", "jpeg", "png", "webp"]),
        ],
        storage=S3Boto3Storage(),
        blank=True,
        null=True,
    )


    groups = models.ManyToManyField(
        'auth.Group', related_name='api_users', blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', related_name='api_users_permissions', blank=True
    )

    def delete(self, *args, **kwargs):
        """
        Override the delete method to ensure that when a User is deleted,
        their profile image is also removed from S3.
        """
        if self.profile_image:
            remove_file_from_s3(User, self, "profile_image", **kwargs)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        from api.models import Employee, Administrator

        # ✅ Only create Employee/Admin if role is explicitly set
        if self.role == self.EMPLOYEE:
            Employee.objects.get_or_create(user=self)

        if self.role == self.ADMIN:
            Administrator.objects.get_or_create(user=self)

        # ✅ Superusers automatically get "Super Admin" role
        if self.is_superuser and self.role != self.SUPER_ADMIN:
            self.role = self.SUPER_ADMIN
            super().save(*args, **kwargs)

    def get_role(self):
        return self.get_role_display() if self.role else "No Role Assigned"
    
    get_role.short_description = 'Role'

class Administrator(models.Model):
    admin_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name="administrator_profile"
    )
    salary_report = models.ForeignKey('SalaryReport', on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return f"Admin {self.admin_id}"

class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name="employee_profile"
    )
    trip = models.ForeignKey('Trip', on_delete=models.CASCADE, null=True, blank=True)
    salary = models.ForeignKey('Salary', on_delete=models.CASCADE, null=True, blank=True)
    employee_type = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        employee_count = Employee.objects.filter(employee_id__lte=self.employee_id).count()
        return f"Employee {employee_count}"

class Salary(models.Model):
    salary_id = models.AutoField(primary_key=True)
    trip = models.ForeignKey('Trip', on_delete=models.CASCADE)
    deductions = models.DecimalField(max_digits=10, decimal_places=2)
    bonuses = models.DecimalField(max_digits=10, decimal_places=2)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    multipliers = models.DecimalField(max_digits=5, decimal_places=2)
    overtime = models.DecimalField(max_digits=10, decimal_places=2)
    additionals = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"Salary {self.salary_id}"

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
    
    def __str__(self):
        return f"Trip {self.trip_id}"

class Vehicle(models.Model):
    vehicle_id = models.AutoField(primary_key=True)
    plate_number = models.CharField(
        max_length=10,
        unique=True,
        null=True,  # ✅ Temporarily allow null values
        blank=True  # ✅ Allow empty values in forms
    )
    vehicle_type = models.CharField(max_length=50)
    def __str__(self):
        return f"{self.vehicle_id} - {self.plate_number} - {self.vehicle_type}"

class SalaryReport(models.Model):
    salary_report_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True)
    salary = models.ForeignKey(Salary, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return f"SalaryReport {self.salary_report_id}"
