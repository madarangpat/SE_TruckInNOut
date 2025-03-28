from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from .validators import validate_image
from .utils import remove_file_from_s3
from storages.backends.s3boto3 import S3Boto3Storage
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator

class SalaryConfiguration(models.Model):
    sss = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    philhealth = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    pag_ibig = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return "Global Salary Configuration"

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
        null=True, 
        blank=True  
    )   
    EMPLOYEE_TYPE_CHOICES = [
        ("Driver", "Driver"),
        ("Helper", "Helper"),
        ("Staff", "Staff"),
        ("Not Applicable", "Not Applicable"),
    ]
    employee_type = models.CharField(
        max_length=50,
        choices=EMPLOYEE_TYPE_CHOICES,
        null=True, 
        blank=True,
    )  
    cellphone_no = models.CharField(max_length=15, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    philhealth_no = models.CharField(max_length=20, unique=True, null=True, blank=True)
    pag_ibig_no = models.CharField(max_length=20, unique=True, null=True, blank=True)
    sss_no = models.CharField(max_length=20, unique=True, null=True, blank=True)
    license_no = models.CharField(max_length=20, unique=True, null=True, blank=True)  
    
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

class PasswordReset(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

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
    salary = models.ForeignKey('Salary', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        employee_count = Employee.objects.filter(employee_id__lte=self.employee_id).count()
        return f"{self.user.username} ({employee_count})"

class Salary(models.Model):
    salary_id = models.AutoField(primary_key=True)
    trip = models.ForeignKey('Trip', on_delete=models.CASCADE)
    deductions = models.DecimalField(max_digits=10, decimal_places=2)
    bonuses = models.DecimalField(max_digits=10, decimal_places=2)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    multipliers = models.DecimalField(max_digits=10, decimal_places=2)
    overtime = models.DecimalField(max_digits=10, decimal_places=2)
    additionals = models.DecimalField(max_digits=10, decimal_places=2)
    vale = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cash_advance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cash_bond = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    others = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    sss_loan = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    pagibig_loan = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def __str__(self):
        return f"Salary {self.salary_id}"

class Trip(models.Model):
    REGION_CHOICES = [
        ("Region I", "Region I – Ilocos Region"),
        ("Region II", "Region II – Cagayan Valley"),
        ("Region III", "Region III – Central Luzon"),
        ("Region IV‑A", "Region IV‑A – CALABARZON"),
        ("MIMAROPA", "MIMAROPA Region"),
        ("Region V", "Region V – Bicol Region"),
        ("Region VI", "Region VI – Western Visayas"),
        ("Region VII", "Region VII – Central Visayas"),
        ("Region VIII", "Region VIII – Eastern Visayas"),
        ("Region IX", "Region IX – Zamboanga Peninsula"),
        ("Region X", "Region X – Northern Mindanao"),
        ("Region XI", "Region XI – Davao Region"),
        ("Region XII", "Region XII – SOCCSKSARGEN"),
        ("Region XIII", "Region XIII – Caraga"),
        ("NCR", "NCR – National Capital Region"),
        ("CAR", "CAR – Cordillera Administrative Region"),
        ("BARMM", "BARMM – Bangsamoro Autonomous Region in Muslim Mindanao"),
        ("NIR", "NIR – Negros Island Region"),
    ]
    
    ASSIGNMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
        ("reassigned", "Reassigned"),
    ]
    
    trip_id = models.AutoField(primary_key=True)
    vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE)
    employee = models.ForeignKey('Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='trips')
    helper = models.ForeignKey('Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='helper_trips')
    
    assignment_status = models.CharField(
        max_length=20,
        choices=ASSIGNMENT_STATUS_CHOICES,
        default="pending"
    )
    
    # Structureed Destination Fields
    street_number = models.CharField(max_length=50, null=True, blank=True)
    street_name = models.CharField(max_length=255, null=True, blank=True)
    barangay = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    postal_code = models.CharField(max_length=10, null=True, blank=True)
    province = models.CharField(max_length=255, null=True, blank=True)
    region = models.CharField(
        max_length=50,
        choices=REGION_CHOICES,
        blank=True,
        null=True
    )
    country = models.CharField(max_length=255, default="Philippines", editable=False)
    distance_traveled = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    multiplier = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    num_of_drops = models.IntegerField(null=True, blank=True)
    curr_drops = models.IntegerField(null=True, blank=True)
    client_info = models.CharField(max_length=255, null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    user_latitude = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    user_longitude = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    destination_latitude = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    destination_longitude = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Trip {self.trip_id}"
    
    def get_full_destination(self):
        parts = [
            self.street_number,
            self.street_name,
            self.barangay,
            self.city,
            self.province,
            self.region,
            self.country,
        ]
        return ', '.join([part for part in parts if part])
    get_full_destination.short_description = 'Destination'

class Vehicle(models.Model):
    vehicle_id = models.AutoField(primary_key=True)
    plate_number = models.CharField(
        max_length=10,
        unique=True,
        null=True,  # ✅ Temporarily allow null values
        blank=True  # ✅ Allow empty values in forms
    )
    vehicle_type = models.CharField(max_length=50)
    is_company_owned = models.BooleanField(default=False)
    def __str__(self):
        ownership = "Company" if self.is_company_owned else "Subcon"
        return f"{self.vehicle_id} - {self.plate_number} - {self.vehicle_type} ({ownership})"

class SalaryReport(models.Model):
    salary_report_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True)
    salary = models.ForeignKey(Salary, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return f"SalaryReport {self.salary_report_id}"
    
User = get_user_model()