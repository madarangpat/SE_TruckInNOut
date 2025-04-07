import time
from collections import defaultdict
from datetime import datetime, timedelta
from django.utils.dateformat import DateFormat
from datetime import date
from rest_framework import generics
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User, Administrator, Employee, Salary, Trip, Vehicle, PasswordReset, SalaryConfiguration, Total
from .serializers import (
    UserSerializer, AdministratorSerializer, EmployeeSerializer,
    SalarySerializer, TripSerializer, VehicleSerializer, TotalSerializer,
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
from rest_framework.generics import RetrieveAPIView 
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from rest_framework import viewsets
from django.utils.dateparse import parse_datetime
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from decimal import Decimal
import json
from datetime import datetime
from django.db.models import Sum
from rest_framework.decorators import api_view
from django.utils.timezone import make_aware
from django.db.models import Q
from api.models import Employee, EmployeeLocation
from django.db import OperationalError
from decimal import Decimal
from reportlab.platypus import KeepTogether, PageBreak

User = get_user_model()

#==================================================================================================================================================================================
@api_view(['GET'])
def get_all_salary_configurations(request):
    """
    Fetch all salary configurations.
    """
    salary_configs = SalaryConfiguration.objects.all()  # Retrieve all salary configurations
    serializer = SalaryConfigurationSerializer(salary_configs, many=True)
    return Response(serializer.data)

#==================================================================================================================================================================================
@csrf_exempt
def update_salary_configurations(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body)

        username = data.get("username")
        start_date = parse_datetime(data.get("start_date"))
        end_date = parse_datetime(data.get("end_date"))

        sss_percentage = Decimal(data.get("sss_percentage", 0))
        philhealth_percentage = Decimal(data.get("philhealth_percentage", 0))
        pagibig_percentage = Decimal(data.get("pagibig_percentage", 0))
        pagibig_contribution = Decimal(data.get("pagibig_contribution", 0))
        bonuses = Decimal(data.get("bonuses", 0))

        if not username or not start_date or not end_date:
            return JsonResponse({"error": "Missing required data"}, status=400)

        trips = Trip.objects.filter(
            employee__user__username=username,
            is_completed=True,
            end_date__range=[start_date, end_date]
        )

        updated_configs = 0
        updated_salaries = 0

        for trip in trips:
            adjusted_salary = trip.base_salary * trip.multiplier
            
            # Update SalaryConfig
            config = SalaryConfiguration.objects.filter(trip=trip).first()
            if config:
                config.sss_percentage = sss_percentage
                config.philhealth_percentage = philhealth_percentage
                config.pagibig_percentage = pagibig_percentage
                config.pagibig_contribution = pagibig_contribution
                config.save()
                updated_configs += 1

            # Update Salary
            salary = Salary.objects.filter(trip=trip).first()
            if salary:
                salary.bonuses = bonuses
                salary.adjusted_salary = adjusted_salary
                salary.sss_contribution = adjusted_salary * sss_percentage
                salary.philhealth_contribution = adjusted_salary * philhealth_percentage
                salary.pagibig_contribution = pagibig_contribution
                salary.sss_loan = 0  # or use a string like "Pending"
                salary.pagibig_loan = 0  # or use "Pending"
                salary.save()
                updated_salaries += 1

        return JsonResponse({
            "message": f"✅ Updated {updated_configs} SalaryConfigs and {updated_salaries} Salary bonuses."
        }, status=200)

    except Exception as e:
        print(f"[ERROR] {e}")
        return JsonResponse({"error": "Server error while updating salary configurations."}, status=500)
    
#==================================================================================================================================================================================
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@csrf_exempt
def update_user_profile(request, user_id):
    if request.method == "PATCH":
        try:
            user = User.objects.get(id=user_id)

            data = json.loads(request.body)
            user.email = data.get("email", user.email)
            user.cellphone_no = data.get("cellphone_no", user.cellphone_no)
            user.save()

            return JsonResponse({
                "message": "User updated successfully",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "cellphone_no": user.cellphone_no,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "profile_image": user.profile_image.url if user.profile_image else None,
                }
            })
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

    return JsonResponse({"error": "Invalid request method"}, status=400)
#==================================================================================================================================================================================
# [Function]
@api_view(["PATCH"])
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
                employee_type=request.data.get("employee_type"),  # Corrected
                first_name=request.data.get("firstName", ""),  # Use default value if not provided
                last_name=request.data.get("lastName", ""),  # Use default value if not provided
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
        is_company_owned = request.data.get("is_company_owned", False)
        is_company_owned = str(is_company_owned).lower() in ["true", "1", "yes", "on"]

        # Required fields for all vehicles
        required_fields = ["plate_number", "vehicle_type"]

        # Only require subcon_name if NOT company-owned
        if not is_company_owned:
            required_fields.append("subcon_name")

        # Validation
        for field in required_fields:
            if field not in request.data or not request.data[field].strip():
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            vehicle = Vehicle.objects.create(
                plate_number=request.data["plate_number"],
                vehicle_type=request.data["vehicle_type"],
                is_company_owned=is_company_owned,
                subcon_name=request.data.get("subcon_name", None)
            )
            return Response({"message": "Vehicle created successfully."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)    
#==================================================================================================================================================================================
# CUSTOM LOGIN VIEW (USES JWT AUTHENTICATION)
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

#==================================================================================================================================================================================
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
        
#==================================================================================================================================================================================
# Custom Permissions
class IsAdminUser(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'admin'

#==================================================================================================================================================================================
class IsEmployeeUser(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'employee'

#==================================================================================================================================================================================   
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

#==================================================================================================================================================================================
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

#==================================================================================================================================================================================
class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

#==================================================================================================================================================================================
# Administrator Views (Only Admins can manage Admins)
class AdministratorListView(generics.ListCreateAPIView):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer
    permission_classes = [IsAdminUser]

#==================================================================================================================================================================================
class AdministratorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer
    permission_classes = [IsAdminUser]

#==================================================================================================================================================================================
# Salary Views
class SalaryListView(generics.ListCreateAPIView):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    permission_classes = [IsAdminUser]

#==================================================================================================================================================================================
class SalaryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    permission_classes = [IsAdminUser]

#==================================================================================================================================================================================
class TripListView(generics.ListAPIView):
    serializer_class = TripSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Trip.objects.all()

#==================================================================================================================================================================================
class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        was_in_progress = instance.is_in_progress

        response = super().update(request, *args, **kwargs)
        instance.refresh_from_db()

        print(f"Trip {instance.trip_id} status: was_in_progress={was_in_progress}, now={instance.is_in_progress}")

        if was_in_progress and not instance.is_in_progress:
            print("✅ Trip was just completed — computing salary now.")
            self.compute_and_store_deductions(instance)
        else:
            print("⚠️ Trip is already completed. No salary computation triggered.")

        return response
    
    def compute_and_store_deductions(self, trip):
        from .models import Salary, SalaryConfiguration

        config = SalaryConfiguration.objects.last()
        if not config:
            print("⚠️ No Salary Configuration found.")
            return

        base = trip.base_salary or 0
        multiplier = trip.multiplier or 1
        adjusted = base * multiplier

        Salary.objects.update_or_create(
            trip=trip,
            defaults={
                "additionals": trip.additionals or 0,
                "bonuses": 0,  # Optional: Update via a separate endpoint if needed
                "sss_contribution": adjusted * config.sss,
                "philhealth_contribution": adjusted * config.philhealth,
                "pagibig_contribution": adjusted * config.pag_ibig,
                "sss_loan": 0,
                "pagibig_loan": 0,
                "bale": 0,
                "cash_advance": 0,
                "cash_bond": 0,
                "charges": 0,
                "others": 0,
            }
        )
        print(f"✅ Salary record created/updated for Trip ID {trip.trip_id}")
            
#==================================================================================================================================================================================
# Vehicle Views
class VehicleListView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [AllowAny]

#==================================================================================================================================================================================
class VehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    # permission_classes = [IsAuthenticated]
    
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
        'id', 'username', 'email', 'cellphone_no', 'philhealth_no',
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
#SETTINGS DELETE ACCOUNT
@csrf_exempt
def delete_user_by_username(request, username):
    if request.method == "DELETE":
        try:
            user = User.objects.get(username=username)
            user.delete()
            return JsonResponse({"message": f"User '{username}' deleted successfully!"}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    return JsonResponse({"error": "Invalid request"}, status=400)
    
#==================================================================================================================================================================================
#EMPLOYEE OWN VIEW PROFILE  
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_employee_profile(request):
    try:
        employee = Employee.objects.get(user=request.user)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee not found"}, status=404)

#==================================================================================================================================================================================
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

#==================================================================================================================================================================================
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
  
# =====================================================================================================
# GET trips that are accepted but not yet completed (Ongoing Trips)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_ongoing_trips(request):
    try:
        employee = request.user.employee_profile
        
        # Using Q for filtering
        trips = Trip.objects.filter(
            employee=employee
        ).filter(
            is_completed=False
        ).order_by("-start_date")

        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

    except Employee.DoesNotExist:
        return Response({"error": "No employee profile found."}, status=400)

# =====================================================================================================
class TripDetailAPIView (RetrieveAPIView):
    queryset = Trip.objects.all()
    serializer_class =TripSerializer
    lookup_field = "trip_id"
    permission_classes = [AllowAny]
# =====================================================================================================
# GET trips that are accepted or completed
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_recent_trips(request):
    try:
        employee = request.user.employee_profile
        trips = Trip.objects.filter(
            employee=employee,
            is_completed=True
        ).order_by("-start_date")

        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)
    except Employee.DoesNotExist:
        return Response({"error": "No employee profile found."}, status=400)

# =====================================================================================================
#Get Unassigned Trips
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_unassigned_trips(request):
    if request.user.role != "admin":
        return Response({"error": "Only admins can view this."}, status=403)

    trips = Trip.objects.filter(employee__isnull=True).order_by("-start_date")
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)

# =====================================================================================================
@api_view(['GET'])
@permission_classes([AllowAny])
def employee_trip_salaries(request):
    username = request.GET.get("employee")
    start = parse_datetime(request.GET.get("start_date"))
    end = parse_datetime(request.GET.get("end_date"))

    if not all([username, start, end]):
        return Response({"error": "Missing parameters"}, status=400)

    trips = Trip.objects.filter(
        employee__user__username=username, 
        end_date__range=(start, end),
        is_completed=True
    )
    data = []

    for trip in trips:
        salary = Salary.objects.filter(trip=trip).first()
        data.append({
            "trip": TripSerializer(trip).data,
            "salary": SalarySerializer(salary).data if salary else None
        })

    return Response(data)
# =====================================================================================================
# Update salary deductions
@api_view(['POST'])
@permission_classes([AllowAny])
def update_salary_deductions(request):
    print("✅ update_salary_deductions endpoint was hit")
    print("Incoming data:", request.data)

    data = request.data
    username = data.get('username')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    try:
        start = datetime.fromisoformat(start_date).date()
        end = datetime.fromisoformat(end_date).date()
        
        user = User.objects.get(username=username)
        employee = Employee.objects.get(user=user)
        config = SalaryConfiguration.objects.first()

        trips = Trip.objects.filter(
            employee=employee,
            end_date__range=[start, end],
            is_completed=True
        )

        for trip in trips:
            adjusted_salary = Decimal(str(trip.base_salary * trip.multiplier))
            sss_contribution = adjusted_salary * config.sss
            philhealth_contribution = adjusted_salary * config.philhealth
            pagibig_contribution = adjusted_salary * config.pag_ibig
            pagibig_loan = config.pagibig_contribution
            sss_loan = 0  # or leave it as None

            Salary.objects.update_or_create(
                trip=trip,
                defaults={
                    "adjusted_salary": adjusted_salary,
                    "sss_contribution": sss_contribution,
                    "philhealth_contribution": philhealth_contribution,
                    "pagibig_contribution": pagibig_contribution,
                    "pagibig_loan": pagibig_loan,
                    "sss_loan": sss_loan,
                    "bonuses": data.get("bonuses", 0),
                    "bale": data.get("bale", 0),
                    "cash_advance": data.get("cash_advance", 0),
                    "cash_bond": data.get("cash_bond", 0),
                    "charges": data.get("charges", 0),
                    "others": data.get("others", 0),
                }
            )
        
        return Response({"success": True, "message": "Salaries and deductions updated."})

    except Exception as e:
        print("Error updating salary:", e)
        return Response({"error": str(e)}, status=500)
#==============================================================================================================================
# SALARY BREAKDOWN PDF
@api_view(['GET'])
@permission_classes([AllowAny])
def generate_salary_breakdown_pdf(request):
    username = request.GET.get("employee")
    start = date.fromisoformat(request.GET.get("start_date"))
    end = date.fromisoformat(request.GET.get("end_date"))

    if not all([username, start, end]):
        return Response({"error": "Missing parameters"}, status=400)

    try:
        employee = Employee.objects.select_related("user").get(user__username=username)
        user_type = employee.user.employee_type.lower()
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)

    # For staff - placeholder
    if user_type == "staff":
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, 750, f"Payroll PDF Placeholder for Staff: {username}")
        p.drawString(100, 720, f"Date Range: {start} to {end}")
        p.showPage()
        p.save()
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf', headers={
            'Content-Disposition': f'attachment; filename="{username}_staff_salary_breakdown.pdf"'
        })

    trips = Trip.objects.filter(
        employee=employee,
        end_date__range=(start, end),
        is_completed=True
    )

    if not trips.exists():
        return Response({"error": "No completed trips found in this range."}, status=400)

    data = [{"trip": t, "salary": Salary.objects.filter(trip=t).first()} for t in trips]

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(letter), topMargin=30, leftMargin=30, rightMargin=30, bottomMargin=30)
    styles = getSampleStyleSheet()
    left_align = ParagraphStyle(name='LeftAlign', parent=styles['Normal'], alignment=TA_LEFT)
    left_heading = ParagraphStyle(name='LeftHeading', parent=styles['Heading4'], alignment=TA_LEFT)
    elements = []

    elements.append(Paragraph(f"<b>Salary Report for {username}</b>", left_align))
    elements.append(Paragraph(f"<b>Date Range:</b> {start} to {end}", left_align))
    elements.append(Spacer(1, 12))

    # Trip Table
    trip_table_data = [["Trip ID", "Num of Drops", "End Date", "Base Salary", "Multiplier", "Final Drop Made", "Adjusted Salary"]]
    gross_total = 0

    for record in data:
        trip = record["trip"]
        salary = record["salary"]
        if not salary:
            continue

        adjusted = salary.adjusted_salary or 0
        gross_total += adjusted

        final_drop = "N/A"
        if hasattr(trip, "addresses") and trip.addresses and hasattr(trip, "clients") and trip.clients:
            last_address = trip.addresses[-1]
            city = "Unknown"

            if isinstance(last_address, str):
                parts = [p.strip() for p in last_address.split(",")]
                if len(parts) >= 4:
                    city = parts[2]  # Adjust index depending on your format

            final_drop = f"{city} (Client: {trip.clients[-1]})"


        trip_table_data.append([
            str(trip.trip_id),
            str(getattr(trip, "num_of_drops", "N/A")),
            trip.end_date.strftime("%Y-%m-%d"),
            f"{trip.base_salary:.2f}",
            str(trip.multiplier),
            final_drop,
            f"{adjusted:.2f}"
        ])

    trip_table = Table(trip_table_data, repeatRows=1, hAlign='LEFT')
    trip_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(Paragraph("<b>TRIP TABLE</b>", left_heading))
    elements.append(trip_table)
    elements.append(Spacer(1, 12))

    # Additionals
    bonus_total = sum(s["salary"].bonuses for s in data if s["salary"])
    additionals_total = sum(getattr(s["trip"], "additionals", 0) for s in data if s["salary"])
    elements.append(Paragraph("<b>ADDITIONALS</b>", left_heading))
    add_table = Table([["Bonuses", "Additionals"], [f"{bonus_total:.2f}", f"{additionals_total:.2f}"]], hAlign='LEFT')
    add_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(add_table)
    elements.append(Spacer(1, 12))

    # Monthly deductions based on week of export date
    def get_week_of_month(d):
        return ((d.day - 1) // 7) + 1

    week_index = get_week_of_month(date.today())
    monthly_deductions = {}

    if week_index == 1:
        monthly_deductions["Pag-IBIG Contribution"] = sum(s["salary"].pagibig_contribution or 0 for s in data if s["salary"])
    elif week_index == 2:
        monthly_deductions["PhilHealth Contribution"] = sum(s["salary"].philhealth_contribution or 0 for s in data if s["salary"])
    elif week_index == 3:
        monthly_deductions["SSS Contribution"] = sum(s["salary"].sss_contribution or 0 for s in data if s["salary"])
    elif week_index == 4:
        monthly_deductions["SSS Loan"] = sum(s["salary"].sss_loan or 0 for s in data if s["salary"])
        monthly_deductions["Pag-IBIG Loan"] = sum(s["salary"].pagibig_loan or 0 for s in data if s["salary"])

    if monthly_deductions:
        monthly_table_data = [["Monthly Deduction", "Amount"]] + [[k, f"{v:.2f}"] for k, v in monthly_deductions.items()]
        elements.append(Paragraph("<b>MONTHLY DEDUCTIONS</b>", left_heading))
        monthly_table = Table(monthly_table_data, hAlign='LEFT')
        monthly_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ]))
        elements.append(monthly_table)
        elements.append(Spacer(1, 12))

    # Weekly Deductions
    weekly_deductions = {
        "Bale": sum(s["salary"].bale for s in data if s["salary"]),
        "Cash Advance": sum(s["salary"].cash_advance for s in data if s["salary"]),
        "Cash Bond": sum(s["salary"].cash_bond for s in data if s["salary"]),
        "Charges": sum(s["salary"].charges for s in data if s["salary"]),
        "Others": sum(s["salary"].others for s in data if s["salary"]),
    }
    weekly_table_data = [["Weekly Deduction", "Amount"]] + [[k, f"{v:.2f}"] for k, v in weekly_deductions.items()]
    elements.append(Paragraph("<b>WEEKLY DEDUCTIONS</b>", left_heading))
    weekly_table = Table(weekly_table_data, hAlign='LEFT')
    weekly_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(weekly_table)
    elements.append(Spacer(1, 12))

    # Totals
    total_deductions = sum(monthly_deductions.values()) + sum(weekly_deductions.values())
    net_pay = gross_total + bonus_total + additionals_total - total_deductions
    totals_table_data = [["Gross Salary", "Additionals", "Deductions", "Net Pay"],
                         [f"{gross_total:.2f}", f"{bonus_total + additionals_total:.2f}", f"- {total_deductions:.2f}", f"{net_pay:.2f}"]]
    elements.append(Paragraph("<b>TOTALS</b>", left_heading))
    totals_table = Table(totals_table_data, hAlign='LEFT')
    totals_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(totals_table)

    doc.build(elements)
    buffer.seek(0)
    return HttpResponse(buffer, content_type='application/pdf', headers={
        'Content-Disposition': f'attachment; filename="{username}_salary_breakdown.pdf"'
    })
    
#==================================================================================================================================================================================
@api_view(['GET'])
@permission_classes([AllowAny])
def generate_gross_payroll_pdf(request):
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    if not start_date or not end_date:
        return HttpResponse("Missing start or end date", status=400)

    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        return HttpResponse("Invalid date format", status=400)

    totals_records = Total.objects.filter(start_date=start_date, end_date=end_date)
    if not totals_records.exists():
        return HttpResponse("No totals records found within this date range.", status=404)

    formatted_start = DateFormat(start_date).format('F d, Y')
    formatted_end = DateFormat(end_date).format('F d, Y')

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=landscape(letter),
        topMargin=30, leftMargin=30, rightMargin=30, bottomMargin=30
    )

    styles = getSampleStyleSheet()
    normal = styles['Normal']
    normal.fontSize = 8
    left_align = ParagraphStyle(name='LeftAlign', parent=normal, alignment=TA_LEFT, fontSize=9)
    left_heading = ParagraphStyle(name='LeftHeading', parent=styles['Heading4'], alignment=TA_LEFT, fontSize=10)

    elements = [
        Paragraph("<b>BIG C TRUCKING SERVICES GROSS PAYROLL</b>", styles['Title']),
        Spacer(1, 10),
        Paragraph(f"<b>PAYROLL PERIOD:</b> {formatted_start} to {formatted_end}", left_align),
        Paragraph(f"<b>TOTAL EMPLOYEES WITH TRIPS:</b> {totals_records.count()}", left_align),
        Spacer(1, 20)
    ]

    def create_employee_table(totals):
        table_data = [
            ["DESCRIPTION", "AMOUNT"],
            ["Bale", f"{totals.total_bale:.2f}"],
            ["CASH ADVANCE", f"{totals.total_cash_advance:.2f}"],
            ["CASH BOND", f"{totals.total_bond:.2f}"],
            ["CHARGES", f"{totals.total_charges:.2f}"],
            ["OTHERS", f"{totals.total_others:.2f}"],
            ["SSS (including loan)", f"{(totals.total_sss + totals.total_sss_loan):.2f}"],
            ["PHILHEALTH", f"{totals.total_philhealth:.2f}"],
            ["PAG-IBIG (including loan)", f"{(totals.total_pagibig + totals.total_pagibig_loan):.2f}"],
            ["BONUSES", f"{totals.total_bonuses:.2f}"],
            ["BASE SALARY", f"{totals.total_base_salary:.2f}"],
            ["ADDITIONALS", f"{totals.total_additionals:.2f}"],
            ["OVERALL TOTAL", f"{totals.overall_total:.2f}"],
        ]
        table = Table(table_data, colWidths=[130, 90])
        table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ]))
        return table

    row_buffer = []
    for idx, totals in enumerate(totals_records, 1):
        content = [
            Paragraph(f"<b>EMPLOYEE:</b> {totals.employee.user.username.upper()}", left_align),
            Spacer(1, 4),
            create_employee_table(totals)
        ]
        row_buffer.append(content)

        if len(row_buffer) == 3 or idx == len(totals_records):
            while len(row_buffer) < 3:
                row_buffer.append([])

            row_table = Table([row_buffer], colWidths=[doc.width / 3] * 3)
            row_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 10),
                ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ]))
            elements.append(row_table)
            elements.append(Spacer(1, 25))
            row_buffer = []

    doc.build(elements)
    buffer.seek(0)

    return HttpResponse(buffer, content_type='application/pdf', headers={
        'Content-Disposition': 'attachment; filename="gross_payroll.pdf"'
    })
#==================================================================================================================================================================================
# ADD TRIP [ADMIN SIDE]
class RegisterTripView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            vehicle = Vehicle.objects.get(pk=request.data["vehicle_id"])
            employee = Employee.objects.get(pk=request.data["employee_id"])
            helper = None
            if request.data.get("helper_id"):
                helper = Employee.objects.get(pk=request.data["helper_id"])
            helper2 = None
            if request.data.get("helper2_id"):
                helper2 = Employee.objects.get(pk=request.data["helper2_id"])

            trip = Trip.objects.create(
                vehicle=vehicle,
                employee=employee,
                helper=helper,
                helper2=helper2,
                
                # Pass the new array fields here
                addresses=request.data.get("addresses", []),
                clients=request.data.get("clients", []),
                distances=request.data.get("distances", []),
                user_lat=request.data.get("user_lat"),
                user_lng=request.data.get("user_lng"),
                dest_lat=request.data.get("dest_lat", []),
                dest_lng=request.data.get("dest_lng", []),
                completed=request.data.get("completed", []),
                multiplier=request.data.get("multiplier"),
                base_salary=request.data.get("base_salary"),
                num_of_drops=request.data.get("num_of_drops"),
                additionals=request.data.get("additionals"),
                start_date=request.data.get("start_date"),
                end_date=request.data.get("end_date"),
                
                is_completed=False
            )

            return Response({"message": "Trip created successfully."}, status=status.HTTP_201_CREATED)

        except Vehicle.DoesNotExist:
            return Response({"error": "Vehicle not found."}, status=status.HTTP_404_NOT_FOUND)
        except Employee.DoesNotExist:
            return Response({"error": "Employee or Helper not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
#==================================================================================================================================================================================
# PRIORITY QUEUE
@api_view(["GET"])
@permission_classes([AllowAny])
def priority_queue_view(request):
    # Get start and end of current week (Monday to Sunday)
    today = datetime.now().date()
    start_of_week = today - timedelta(days=today.weekday())  # Monday
    end_of_week = start_of_week + timedelta(days=6)  # Sunday

    # Convert to datetime if your Trip.end_date is datetime-aware
    start_of_week_dt = make_aware(datetime.combine(start_of_week, datetime.min.time()))
    end_of_week_dt = make_aware(datetime.combine(end_of_week, datetime.max.time()))

    employees = Employee.objects.filter(user__employee_type__in=["Driver", "Helper"])
    employee_data = []

    for employee in employees:
        # Find trips where this employee is either the driver or helper and ended this week
        weekly_trips = Trip.objects.filter(
            end_date__range=(start_of_week_dt, end_of_week_dt),
            is_completed=True
        ).filter(
            Q(employee=employee) | Q(helper=employee) | Q(helper2=employee)
        )

        # Calculate total base salary from trips this week
        total_base_salary = sum([trip.base_salary or 0 for trip in weekly_trips])

        serialized = EmployeeSerializer(employee).data
        serialized["base_salary"] = total_base_salary
        employee_data.append(serialized)

    # Sort employees by total base salary (ascending, prioritize lower earners)
    sorted_employees = sorted(employee_data, key=lambda e: e["base_salary"])
    return Response(sorted_employees)
#==================================================================================================================================================================================
# DELETE VEHICLES
@csrf_exempt
def delete_vehicle_by_plate(request, plate_number):
    if request.method == "DELETE":
        try:
            vehicle = Vehicle.objects.get(plate_number=plate_number)
            vehicle.delete()
            return JsonResponse({"message": f"Vehicle '{plate_number}' deleted successfully!"}, status=200)
        except Vehicle.DoesNotExist:
            return JsonResponse({"error": "Vehicle not found"}, status=404)
    return JsonResponse({"error": "Invalid request method"}, status=400)

#=========================================================================================================================================================
class TotalViewSet(viewsets.ModelViewSet):
    queryset = Total.objects.all()
    serializer_class = TotalSerializer
    
#==================================================================================================================================================================================
# EMPLOYEE LOCATION FETCHING
MAX_RETRIES = 3

@api_view(['POST'])
@permission_classes([AllowAny])  # Optional, remove if not using auth
def update_employee_location(request):
    employee_id = request.data.get("employee_id")
    latitude = request.data.get("latitude")
    longitude = request.data.get("longitude")

    if not all([employee_id, latitude, longitude]):
        return Response({"message": "Missing fields"}, status=400)

    for attempt in range(MAX_RETRIES):
        try:
            employee = Employee.objects.get(pk=employee_id)
            location, created = EmployeeLocation.objects.update_or_create(
                employee=employee,
                defaults={"latitude": latitude, "longitude": longitude}
            )

            return Response({
                "message": "Location updated successfully",
                "created": created,
                "latitude": location.latitude,
                "longitude": location.longitude,
            })
        except OperationalError as e:
            if "database is locked" in str(e) and attempt < MAX_RETRIES - 1:
                print("🔁 DB is locked, retrying in 0.5s...")
                time.sleep(0.5)
                continue
            print("❌ Final DB error:", e)
            return Response({"message": str(e)}, status=500)
        except Employee.DoesNotExist:
            return Response({"message": "Employee not found"}, status=404)
        except Exception as e:
            print("❌ Error in update-location view:", str(e))
            return Response({"message": str(e)}, status=500)

#==================================================================================================================================================================================
# EMPLOYEE LOCATION UPDATE
@api_view(['GET'])
@permission_classes([AllowAny])  # You can adjust this if needed
def get_employee_location(request, employee_id):
    try:
        location = EmployeeLocation.objects.get(employee__employee_id=employee_id)
        return Response({
            "latitude": location.latitude,
            "longitude": location.longitude
        })
    except EmployeeLocation.DoesNotExist:
        return Response({"message": "Location not available"}, status=404)
#=========================================================================================================================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def calculate_totals(request):
    start_date = request.data.get('start_date')
    end_date = request.data.get('end_date')

    if not start_date or not end_date:
        return Response({'error': 'Start and end dates are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        return Response({'error': 'Invalid date format.'}, status=status.HTTP_400_BAD_REQUEST)

    trips = Trip.objects.filter(
        is_completed=True,
        end_date__range=(start_date, end_date)
    ).select_related('employee', 'helper', 'helper2')

    user_to_trips = defaultdict(list)

    for trip in trips:
        if trip.employee:
            user_to_trips[trip.employee_id].append(trip)
        if trip.helper:
            user_to_trips[trip.helper_id].append(trip)
        if trip.helper2:
            user_to_trips[trip.helper2_id].append(trip)

    created_records = []

    for user_id, trips_for_user in user_to_trips.items():
        salaries = Salary.objects.filter(trip__in=trips_for_user)

        totals = {
            'total_bale': salaries.aggregate(total=Sum('bale'))['total'] or 0,
            'total_cash_advance': salaries.aggregate(total=Sum('cash_advance'))['total'] or 0,
            'total_bond': salaries.aggregate(total=Sum('cash_bond'))['total'] or 0,
            'total_sss': salaries.aggregate(total=Sum('sss_contribution'))['total'] or 0,
            'total_sss_loan': salaries.aggregate(total=Sum('sss_loan'))['total'] or 0,
            'total_philhealth': salaries.aggregate(total=Sum('philhealth_contribution'))['total'] or 0,
            'total_pagibig': salaries.aggregate(total=Sum('pagibig_contribution'))['total'] or 0,
            'total_pagibig_loan': salaries.aggregate(total=Sum('pagibig_loan'))['total'] or 0,
            'total_others': salaries.aggregate(total=Sum('others'))['total'] or 0,
            'total_bonuses': salaries.aggregate(total=Sum('bonuses'))['total'] or 0,
            'total_charges': salaries.aggregate(total=Sum('charges'))['total'] or 0,
            'total_base_salary': sum([t.base_salary for t in trips_for_user if t.base_salary]) or 0,
            'total_additionals': sum([t.additionals for t in trips_for_user if t.additionals]) or 0,
        }

        totals['overall_total'] = sum(totals.values())

        record = Total.objects.create(
            start_date=start_date,
            end_date=end_date,
            employee_id=user_id,  # Whether employee or helper, this works
            **totals
        )

        created_records.append({
            'user_id': user_id,
            'totals_id': record.totals_id,
            'overall_total': totals['overall_total']
        })

    return Response({
        'message': f"✅ Created totals for {len(created_records)} user(s) (including helpers).",
        'records': created_records
    }, status=status.HTTP_201_CREATED)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_completed_trips_salaries(request):
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    if not start_date or not end_date:
        return Response({"error": "Start and end dates are required."}, status=400)

    try:
        start = datetime.fromisoformat(start_date).date()
        end = datetime.fromisoformat(end_date).date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

    trips = Trip.objects.filter(is_completed=True, end_date__range=(start, end))
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def trips_by_date_range(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if not start_date or not end_date:
        return Response({'error': 'Start and end date required.'}, status=400)

    try:
        start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00')).date()
        end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00')).date()
    except ValueError:
        return Response({'error': 'Invalid date format.'}, status=400)

    trips = Trip.objects.filter(end_date__range=(start_date, end_date), is_completed=True)

    data = []
    for trip in trips:
        salary = Salary.objects.filter(trip=trip).first()  # get the corresponding salary
        data.append({
            'id': trip.trip_id,
            'driver': trip.employee.user.username if trip.employee and trip.employee.user else '',
            'helper': trip.helper.user.username if trip.helper and trip.helper.user else '',
            'helper2': trip.helper2.user.username if trip.helper2 and trip.helper2.user else '',
            'base_salary': float(trip.base_salary or 0),
            'additionals': float(trip.additionals or 0),
            'end_date': trip.end_date,
            'salary': {
                'bale': float(salary.bale) if salary else 0,
                'cash_advance': float(salary.cash_advance) if salary else 0,
                'cash_bond': float(salary.cash_bond) if salary else 0,
                'charges': float(salary.charges) if salary else 0,
                'others': float(salary.others) if salary else 0,
                'sss_contribution': float(salary.sss_contribution) if salary else 0,
                'sss_loan': float(salary.sss_loan) if salary else 0,
                'philhealth_contribution': float(salary.philhealth_contribution) if salary else 0,
                'pagibig_contribution': float(salary.pagibig_contribution) if salary else 0,
                'pagibig_loan': float(salary.pagibig_loan) if salary else 0,
                'bonuses': float(salary.bonuses) if salary else 0,
            }
        })

    return Response(data, status=200)

def completed_trips_view(request):
    employee_username = request.GET.get("employee")
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")

    if not employee_username or not start_date or not end_date:
        return JsonResponse({"error": "Missing query parameters"}, status=400)

    try:
        start_date = parse_datetime(start_date)
        end_date = parse_datetime(end_date)
    except Exception:
        return JsonResponse({"error": "Invalid date format"}, status=400)

    trips = Trip.objects.filter(
        employee__user__username=employee_username,
        is_completed=True,
        end_date__range=[start_date, end_date]
    )

    trip_data = []
    for trip in trips:
        salary = Salary.objects.filter(trip=trip).first()
        trip_data.append({
            "trip_id": trip.pk,
            "end_date": trip.end_date,
            "bale": salary.bale if salary else 0,
            "cash_advance": salary.cash_advance if salary else 0,
            "cash_bond": salary.cash_bond if salary else 0,
            "charges": salary.charges if salary else 0,
            "others": salary.others if salary else 0,
            "bonuses": salary.bonuses if salary else 0,
        })

    return JsonResponse(trip_data, safe=False)

@csrf_exempt
def distribute_deductions(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    def parse_float(value):
        try:
            return float(value)
        except (ValueError, TypeError):
            return 0.0

    try:
        data = json.loads(request.body)
        username = data.get("username")
        start_date = parse_datetime(data.get("start_date"))
        end_date = parse_datetime(data.get("end_date"))

        bale = parse_float(data.get("bale"))
        cash_advance = parse_float(data.get("cash_advance"))
        cash_bond = parse_float(data.get("cash_bond"))
        charges = parse_float(data.get("charges"))
        others = parse_float(data.get("others"))

        trips = Trip.objects.filter(
            employee__user__username=username,
            is_completed=True,
            end_date__range=[start_date, end_date]
        )

        print(f"Updating Salary records for {trips.count()} trip(s)")

        updated = 0
        for trip in trips:
            salary = Salary.objects.filter(trip=trip).first()
            if salary:
                salary.bale = bale
                salary.cash_advance = cash_advance
                salary.cash_bond = cash_bond
                salary.charges = charges
                salary.others = others
                salary.save()
                updated += 1
            else:
                print(f"⚠️ No salary found for Trip {trip.id}")

        return JsonResponse({"message": f"✅ Updated {updated} salary record(s)."})

    except Exception as e:
        print(f"❌ ERROR: {e}")
        return JsonResponse({"error": "Unexpected error occurred."}, status=500)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def set_payment_status(request):
    employee_id = request.data.get("employee_id")
    status = request.data.get("status")

    if employee_id is None:
        return Response({"error": "Employee ID is required."}, status=400)

    try:
        employee = Employee.objects.get(pk=employee_id)
        employee.payment_status = status
        employee.save()
        return Response({"message": "Payment status updated successfully."})
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found."}, status=404)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_data(request, pk):
    user = request.user
    if user.id != pk:
        return Response({"error": "Unauthorized"}, status=403)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

