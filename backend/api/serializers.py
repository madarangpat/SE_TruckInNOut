from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Administrator, Employee, Salary, Trip, Vehicle, SalaryConfiguration
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()  # Add custom field for profile image if needed

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role", "cellphone_no", 
                  "philhealth_no", "pag_ibig_no", "sss_no", "license_no", "profile_image"]

    def get_profile_image(self, obj):
        if obj.profile_image:
            return obj.profile_image.url  # Assumes profile_image is an ImageField
        return "/tinoicon.png"  # Default fallback image

class SalaryConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryConfiguration
        fields = ['id','sss', 'philhealth', 'pag_ibig', 'pagibig_contribution']  # Include the fields you want to expose

    def to_representation(self, instance):
        """
        Customize the representation of the Salary Configuration object.
        """
        representation = super().to_representation(instance)
        return {
            'id': instance.id,
            'sss': instance.sss,
            'philhealth': instance.philhealth,
            'pag_ibig': instance.pag_ibig
        }
    
class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = [
            'salary_id', 'trip', 'bonuses',
            'bale', 'cash_advance', 'cash_bond', 'charges', 'others',
            'sss_loan', 'pagibig_loan'
        ]
    
# new ones==================
class NestedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'profile_image', 'employee_type']

class NestedEmployeeSerializer(serializers.ModelSerializer):
    user = NestedUserSerializer()

    class Meta:
        model = Employee
        fields = ['employee_id', 'user']

# ✅ Vehicle Serializer (Updated)
class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['vehicle_id', 'plate_number', 'vehicle_type', "is_company_owned"]
        read_only_fields = ['vehicle_id']  # Prevents user from modifying vehicle_id      

    def validate_plate_number(self, value):
        """Ensure plate number is uppercase and without extra spaces."""
        return value.strip().upper()  # Normalize input to prevent duplicate variations
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['is_company_owned'] = instance.is_company_owned
        return representation

class TripSerializer(serializers.ModelSerializer):
    employee = NestedEmployeeSerializer()
    vehicle = VehicleSerializer()
    
    class Meta:
        model = Trip
        fields = [
            'trip_id', 'vehicle', 'employee', 'helper', 'helper2', 
            'addresses', 'clients', 'distances', 'user_lat', 'user_lng', 
            'dest_lat', 'dest_lng', 'completed', 'multiplier', 'base_salary',
            'additionals', 'num_of_drops', 'start_date', 'end_date', 'is_in_progress',
        ]

class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = {
            'username': self.user.username,
            'role': self.user.role,
            'profile_image': self.user.profile_image.url if self.user.profile_image else None,
            'employee_type': self.user.employee_type,
        }
        return data

class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.RegexField(
        regex=r'.{6,}$',
        write_only=True,
        error_messages={'invalid': 'Password must be at least 6 characters long'}
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

# ✅ User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'password', 'username', 
            'first_name', 'last_name', 'role', 
            'cellphone_no', 'email', 'philhealth_no', 'pag_ibig_no', 
            'sss_no', 'license_no', 'profile_image', 'employee_type',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def create(self, validated_data):
        # Hash the password before saving
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)

# ✅ Administrator Serializer
class AdministratorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Administrator
        fields = ['admin_id', 'user']

# ✅ Employee Serializer
class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Employee
        fields = ['employee_id', 'user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        employee = Employee.objects.create(user=user, **validated_data)
        employee.save()
        return employee
