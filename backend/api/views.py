from datetime import datetime

from django.db.models.signals import post_delete
from django.dispatch import receiver
from rest_framework import generics
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User, Administrator, Employee, Salary, Trip, Vehicle, SalaryReport, PasswordReset, SalaryConfiguration
from .serializers import (
    UserSerializer, AdministratorSerializer, EmployeeSerializer,
    SalarySerializer, TripSerializer, VehicleSerializer, SalaryReportSerializer,
    LoginSerializer, ResetPasswordRequestSerializer, ResetPasswordSerializer, SalaryConfigurationSerializer, UserProfileSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.utils import timezone
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from io import BytesIO
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle

User = get_user_model()

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_employee_profile(request):
    """Update the currently logged-in user's profile"""
    user = request.user
    serializer = UserProfileSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile updated successfully!", "user": serializer.data})

    return Response(serializer.errors, status=400)


#==================================================================================================================================================================================
# ADD ACCOUNT FOR USER
class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        required_fields = ["username", "password", "email", "role"]

        # ✅ Check if required fields are present
        for field in required_fields:
            if field not in request.data or not request.data[field]:
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

        profile_image = request.FILES.get("profile_image")  # ✅ Capture the uploaded image

        # ✅ Create user
        try:
            user = User.objects.create_user(
                username=request.data["username"],
                password=request.data["password"],
                email=request.data["email"],
                role=request.data["role"],
                cellphone_no=request.data.get("cellphone_no", ""),
                philhealth_no=request.data.get("philhealth_no", ""),
                pag_ibig_no=request.data.get("pag_ibig_no", ""),
                sss_no=request.data.get("sss_no", ""),
                license_no=request.data.get("license_no", ""),
                profile_image=profile_image,  # ✅ Save image with user
            )
            return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
#==================================================================================================================================================================================
# ADD Vehicle
class RegisterVehicleView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        required_fields = ["plate_number", "vehicle_type"]

        # ✅ Check if required fields are present (excluding checkbox for now)
        for field in required_fields:
            if field not in request.data or not request.data[field]:
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Handle the checkbox field safely
        is_company_owned = request.data.get("is_company_owned", False)
        # Convert to boolean in case it's a string like "true"/"false"
        is_company_owned = str(is_company_owned).lower() in ["true", "1", "yes", "on"]

        try:
            vehicle = Vehicle.objects.create(
                plate_number=request.data["plate_number"],
                vehicle_type=request.data["vehicle_type"],
                is_company_owned=is_company_owned,
            )
            return Response({"message": "Vehicle created successfully."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
#==================================================================================================================================================================================
# ADD TRIP
class RegisterTripView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            vehicle = Vehicle.objects.get(pk=request.data["vehicle_id"])
            employee = Employee.objects.get(pk=request.data["employee_id"])
            helper = None
            if request.data.get("helper_id"):
                helper = Employee.objects.get(pk=request.data["helper_id"])

            trip = Trip.objects.create(
                vehicle=vehicle,
                employee=employee,
                helper=helper,
                street_number=request.data.get("street_number"),
                street_name=request.data.get("street_name"),
                barangay=request.data.get("barangay"),
                city=request.data.get("city"),
                province=request.data.get("province"),
                region=request.data.get("region"),
                distance_traveled=request.data.get("distance"),
                num_of_drops=request.data.get("numdrops"),
                curr_drops=request.data.get("curr_drops", 0),
                client_info=request.data.get("client_information"),
                start_date=request.data.get("start_date"),
                end_date=request.data.get("end_date"),
                user_latitude=request.data.get("user_latitude"),
                user_longitude=request.data.get("user_longitude"),
                destination_latitude=request.data.get("destination_latitude"),
                destination_longitude=request.data.get("destination_longitude"),
            )

            return Response({"message": "Trip created successfully."}, status=status.HTTP_201_CREATED)

        except Vehicle.DoesNotExist:
            return Response({"error": "Vehicle not found."}, status=status.HTTP_404_NOT_FOUND)
        except Employee.DoesNotExist:
            return Response({"error": "Employee or Helper not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#==================================================================================================================================================================================
# CUSTOM LOGIN VIEW (USES JWT AUTHENTICATION)
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

class SendPasswordLinkView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordRequestSerializer

    def send_password_reset_email(self, user_email, reset_token):
        reset_link = f"{settings.FRONTEND_DOMAIN}/forgot-password/{reset_token}"
        
        subject = "[PASSWORD RESET]"
        body = f"""
        Password Reset Link: {reset_link}
        """
   
        send_mail(
            subject,
            body,
            settings.EMAIL_HOST_USER,
            [user_email],
        )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        email = request.data['email']

        if not email:
            return Response({"error": "Email field is required."})

        user = get_object_or_404(User, email=email)

        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        reset = PasswordReset(email=email, token=token)
        reset.save()

        self.send_password_reset_email(user_email=email, reset_token=token)
        return Response({"message": "Password reset link has been sent to your email."}, status=status.HTTP_200_OK)

#==================================================================================================================================================================================
# RESET PASSWORD VIEW
class ResetPasswordView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = []

    def post(self, request, token):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        new_password = data['new_password']
        confirm_password = data['confirm_password']
        
        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=400)
        
        reset_obj = PasswordReset.objects.filter(token=token).first()
        
        if not reset_obj :
            return Response({'error':'Session has expired or is invalid.'}, status=400)
        
        user = User.objects.filter(email=reset_obj.email).first()
        
        if user:
            user.set_password(request.data['new_password'])
            user.save()
            
            reset_obj.delete()
            
            return Response({'success':'Password updated'})
        else: 
            return Response({'error':'No user found'}, status=404)

# Custom Permissions
class IsAdminUser(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'admin'

class IsEmployeeUser(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'employee'
   
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class EmployeeCreateView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]

#==================================================================================================================================================================================
# EMPLOYEE LIST ADMIN DASHBOARD
class EmployeeListView(generics.ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny] # Will change to IsAuthenticated once token problem is fixed

class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

# Administrator Views (Only Admins can manage Admins)
class AdministratorListView(generics.ListCreateAPIView):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer
    permission_classes = [IsAdminUser]

class AdministratorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer
    permission_classes = [IsAdminUser]

# Salary Views
class SalaryListView(generics.ListCreateAPIView):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    permission_classes = [IsAdminUser]

class SalaryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    permission_classes = [IsAdminUser]

# Trip Views
# class TripListView(generics.ListCreateAPIView):
#     queryset = Trip.objects.all()
#     serializer_class = TripSerializer
#     permission_classes = [IsAuthenticated]

class TripListView(generics.ListAPIView):
    serializer_class = TripSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Trip.objects.all()

class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

# Vehicle Views
class VehicleListView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [AllowAny]

class VehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    # permission_classes = [IsAuthenticated]

# Salary Report Views
class SalaryReportListView(generics.ListCreateAPIView):
    queryset = SalaryReport.objects.all()
    serializer_class = SalaryReportSerializer
    permission_classes = [IsAdminUser]

class SalaryReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalaryReport.objects.all()
    serializer_class = SalaryReportSerializer
    permission_classes = [IsAdminUser]
    
#==================================================================================================================================================================================
#PDF GENERATION
def generate_pdf(request):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=landscape(letter))
    width, height = landscape(letter)

    # Title
    title_text = "November 2024, 2nd Week"
    pdf.setFont("Helvetica-Bold", 16)

    # Calculate text width and center it
    text_width = pdf.stringWidth(title_text, "Helvetica-Bold", 16)
    x_position = (width - text_width) / 2  # Center horizontally

    pdf.drawString(x_position, height - 50, title_text)

    #Data for the Table
    trip_data = [
        ["Trips Completed"],
        ["TripID", "StartDate", "Base Salary", "Location", "Multiplier", "Additional Pay", "Final Salary"],
        [1, "03/12/2024", "₱ 690", "Cavite", "1.3", "₱ 250", "₱ 1,147"],
        [2, "04/12/2024", "₱ 760", "Laguna", "1.5", "₱ 500", "₱ 1,640"],
        [3, "06/12/2024", "₱ 690", "Marikina", "1.3", "₱ 250", "₱ 1,147"],
        [4, "07/12/2024", "₱ 690", "Bulacan", "1.3", "₱ 250", "₱ 1,147"]
    ]
        
    additional_data = [ 
        ["ADDITIONALS"],               
        ["Bonuses", "₱ 0"],
        ["Additional Pay", "₱ 1,250"]
    ]
    
    deduction_data = [
        ["DEDUCTIONS"],
        ["SSS (14%)", "₱ 0"],
        ["Pag-IBIG (2%)", "₱ 0"],
        ["PhilHealth (5%)", "₱ 260"],
        ["Vale", "₱ 300"],
        ["SSS Loan", "₱ 0"],
        ["Pag-IBIG Loan", "₱ 0"],
        ["Cash Advance", "₱ 0"],
        ["Cash Bond", "₱ 150"],
        ["Charges", "₱ 0"],
        ["Others", "₱ 100"]
    ]
    
    salary_summary = [
        ["TOTALS"],
        ["Accumulated Salary", "₱ 5,081"],
        ["Additionals", "₱ 1,250"],
        ["Deductions", "- ₱ 810"],
        ["Current Salary", "₱ 5,521"]
    ]
    
     # Function to draw table
    def draw_table(data, x, y):
        table = Table(data, colWidths=[100] * len(data[0]), repeatRows=1)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ]))
        table.wrapOn(pdf, width, height)
        table.drawOn(pdf, x, y)
        
    # Draw tables
    draw_table(trip_data, 50, height - 180)
    draw_table(additional_data, 50, height - 250)
    draw_table(deduction_data, 260, height - 394)
    draw_table(salary_summary, 470, height - 285)
    
    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="salary_report.pdf"'
    return response

#==================================================================================================================================================================================
#ADMIN SETTINGS EMPLOYEE DATA
class UserListView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ Requires Authentication

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
#==================================================================================================================================================================================
#CREATE NEW TRIP DROPDOWN
def get_vehicles(request):
    vehicles = list(Vehicle.objects.values("vehicle_id", "plate_number", "vehicle_type"))
    return JsonResponse(vehicles, safe=False)

def get_employees(request):
    employees = list(Employee.objects.values(
        "employee_id", 
        "user__username", 
        "employee_type"
        ))
    return JsonResponse(employees, safe=False)

#==================================================================================================================================================================================
#SETTINGS EMPLOYEE DATA
User = get_user_model()

def get_users(request):
    users = User.objects.all().values(
        'username', 'email', 'cellphone_no', 'philhealth_no',
        'pag_ibig_no', 'sss_no', 'license_no', 'profile_image', 'is_staff', 'is_superuser'
    )

    users_list = [
        {
            **user,
            'role': 'Super Admin' if user['is_superuser'] else 'Admin' if user['is_staff'] else 'Employee',
            'profile_image': request.build_absolute_uri(user['profile_image']) if user['profile_image'] else None
        }
        for user in users
    ]

    return JsonResponse({'users': users_list})

#==================================================================================================================================================================================
#SETTINGS SALARY CONFIGURATION
class SalaryConfigurationListView(generics.ListAPIView):
    queryset = SalaryConfiguration.objects.all()
    serializer_class = SalaryConfigurationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

# ✅ List and Create Salary Configuration
class SalaryConfigurationListCreateView(generics.ListCreateAPIView):
    queryset = SalaryConfiguration.objects.all()
    serializer_class = SalaryConfigurationSerializer
    permission_classes = [AllowAny]  # Ensure that the user is authenticated

    def perform_create(self, serializer):
        """
        You can override the `perform_create` method if you need to customize 
        the creation logic, such as associating the user with the salary configuration.
        """
        # You can add logic to associate the user with the salary configuration if needed
        serializer.save()


# ✅ Retrieve, Update, and Delete Salary Configuration
class SalaryConfigurationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalaryConfiguration.objects.all()
    serializer_class = SalaryConfigurationSerializer
    permission_classes = [AllowAny]  # Ensure that the user is authenticated

#==================================================================================================================================================================================
#SETTINGS DELETE ACCOUNT
@csrf_exempt
def delete_user(request, user_id):
    if request.method == "DELETE":
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return JsonResponse({"message": "User deleted successfully!"}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    return JsonResponse({"error": "Invalid request"}, status=400)
    
#==================================================================================================================================================================================
#EMPLOYEE OWN VIEW PROFILE  
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_employee_profile(request):
    """Return the logged-in user's profile details"""
    user = request.user  # Gets the currently authenticated user
    serializer = UserProfileSerializer(user)
    return Response(serializer.data)

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        try:
            return User.objects.get(id=self.request.user.id)
        except User.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

#==================================================================================================================================================================================
#USER UPDATE
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(User, pk=self.request.user.pk)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save()

# Reset password link validation
class ValidateResetPasswordTokenView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response(
                {"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        reset_obj = PasswordReset.objects.filter(token=token).first()
        current_time = timezone.now()
        token_created_date: datetime = reset_obj.created_at
        password_timeout_duration = 3600  # 1 hour in seconds
        is_expired = (
            abs(current_time - token_created_date)
        ).total_seconds() > password_timeout_duration

        if is_expired or not reset_obj:
            return Response(
                {"error": "Token has expired or is invalid."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"message": "Token is valid."}, status=status.HTTP_200_OK)
