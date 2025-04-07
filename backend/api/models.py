from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from .validators import validate_image
from .utils import remove_file_from_s3
from storages.backends.s3boto3 import S3Boto3Storage

class SalaryConfiguration(models.Model):
    salconfig_id = models.AutoField(primary_key=True)  # <- unique identifier
    trip = models.ForeignKey('Trip', on_delete=models.CASCADE, null=True)
    sss_percentage = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    philhealth_percentage = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    pagibig_percentage = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    pagibig_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"SalConfig #{self.salconfig_id} "

#==============================================================================================================================================
# USER MODEL
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
    
#==============================================================================================================================================
# PASSWORD RESET MODEL
class PasswordReset(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
#==============================================================================================================================================
# ADMIN MODEL
class Administrator(models.Model):
    admin_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name="administrator_profile"
    )
    def __str__(self):
        return f"Admin {self.admin_id}"

#==============================================================================================================================================
# EMPLOYEE MODEL
class Employee(models.Model):   
    employee_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name="employee_profile"
    )
    salary = models.ForeignKey('Salary', on_delete=models.CASCADE, null=True, blank=True)
    completed_trip_count = models.PositiveIntegerField(default=0)
    payment_status = models.BooleanField(default=False)

    def __str__(self):
        employee_count = Employee.objects.filter(employee_id__lte=self.employee_id).count()
        return f"{self.user.username} ({employee_count})"

#==============================================================================================================================================
# SALARY MODEL
class Salary(models.Model):
    salary_id = models.AutoField(primary_key=True)
    trip = models.ForeignKey('Trip', on_delete=models.CASCADE)   
    bonuses = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    #Monthly Deductions
    sss_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    sss_loan = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    philhealth_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    pagibig_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    pagibig_loan = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    #Weekly Deductions
    bale = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cash_advance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cash_bond = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    others = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    adjusted_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
     
    def __str__(self):
        return f"Salary {self.salary_id}"

#==============================================================================================================================================
# TRIP MODEL
class Trip(models.Model):   
    trip_id = models.AutoField(primary_key=True)
    vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE)
    employee = models.ForeignKey('Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='trips')
    helper = models.ForeignKey('Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='helper_trips')
    helper2 = models.ForeignKey('Employee', on_delete=models.SET_NULL, null=True, blank=True, related_name='helper2_trips')
    
    user_lat = models.DecimalField(max_digits=12, decimal_places=6, null=True, blank=True)
    user_lng = models.DecimalField(max_digits=12, decimal_places=6, null=True, blank=True)
    
    addresses = models.JSONField(default=list, blank=True)
    clients = models.JSONField(default=list, blank=True)
    distances = models.JSONField(default=list, blank=True)
    dest_lat = models.JSONField(default=list, blank=True)
    dest_lng = models.JSONField(default=list, blank=True)
    completed = models.JSONField(default=list, blank=True)
    
    multiplier = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    base_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    additionals = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    num_of_drops = models.IntegerField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)  
    
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Trip {self.trip_id}"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        was_completed = None

        if not is_new:
            previous = Trip.objects.get(pk=self.pk)
            was_completed = previous.is_completed
        else:
            was_completed = False

        super().save(*args, **kwargs)

        if is_new:
            if self.employee:
                from api.models import Salary, SalaryConfiguration
                
                Salary.objects.create(trip=self)
                
                # Auto-create SalaryConfiguration if not exists for employee
                SalaryConfiguration.objects.create(trip=self)

        if not was_completed and self.is_completed:
            for emp in [self.employee, self.helper, self.helper2]:
                if emp and emp.user.employee_type in ["Driver", "Helper"]:
                    emp.completed_trip_count += 1
                    emp.save()
            
#======================================================================================================================================
# VEHICLE MODEL
class Vehicle(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ("2 Ton Truck", "2 Ton Truck"),
        ("4 Ton Truck", "4 Ton Truck"),
        ("6 Ton Truck", "6 Ton Truck"),
    ]
    
    vehicle_id = models.AutoField(primary_key=True)
    plate_number = models.CharField(
        max_length=10,
        unique=True,
        null=True,
        blank=True 
    )
    vehicle_type = models.CharField(max_length=50, choices=VEHICLE_TYPE_CHOICES)
    is_company_owned = models.BooleanField(default=False)
    subcon_name = models.CharField(max_length=50, null=True, blank=True)
    def __str__(self):
        ownership = "Company" if self.is_company_owned else "Subcon"
        return f"{self.vehicle_id} - {self.plate_number} - {self.vehicle_type} ({ownership})"
    
#======================================================================================================================================
# TOTALS MODEL
class Total(models.Model):
    totals_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE, null=True, blank=True)
    salary = models.ForeignKey('Salary', on_delete=models.CASCADE, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    total_bale = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_cash_advance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_bond = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_sss = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_sss_loan = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_philhealth = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_pagibig = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_pagibig_loan = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_others = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_bonuses = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_base_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_additionals = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    overall_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_date = models.DateField(auto_now_add=True, null=True)


    def __str__(self):
        return f"Totals #{self.totals_id}"
    
#======================================================================================================================================
# EMPLOYEE TRACKING MODEL
class EmployeeLocation(models.Model):
    employee = models.OneToOneField("api.Employee", on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee.user.username}- {self.latitude}, {self.longitude}"  