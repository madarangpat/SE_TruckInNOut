from datetime import datetime
from django.dispatch import receiver
from django.forms import ValidationError
from rest_framework import generics
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User, Administrator, Employee, Salary, Trip, Vehicle, PasswordReset, SalaryConfiguration
from .serializers import (
    UserSerializer, AdministratorSerializer, EmployeeSerializer,
    SalarySerializer, TripSerializer, VehicleSerializer,
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
from rest_framework.decorators import api_view, permission_classes, parser_classes
from django.core.files.storage import default_storage
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
from calendar import monthcalendar, FRIDAY

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
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_salary_configuration(request, configId):
    try:
        salary_config = SalaryConfiguration.objects.get(id=configId)  # Use the passed configId
    except SalaryConfiguration.DoesNotExist:
        return Response({"error": "Salary configuration not found"}, status=404)
    
    # Proceed to update the salary config
    serializer = SalaryConfigurationSerializer(salary_config, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Salary configuration updated successfully", "data": serializer.data}, status=200)
    return Response({"error": serializer.errors}, status=400)
    
#==================================================================================================================================================================================
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user_profile(request, user_id):
    """Update a specific user's profile based on the user ID in the URL"""
    try:
        user = User.objects.get(id=user_id)  # Fetch the user by ID
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # Only allow admins to update other users' profiles (you can modify this permission)
    if not request.user.is_superuser and request.user.id != user.id:
        return Response({"error": "You do not have permission to update this user."}, status=403)

    # Serialize the user with the provided data
    serializer = UserProfileSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile updated successfully!", "user": serializer.data})

    return Response(serializer.errors, status=400)
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
    authentication_classes = [JWTAuthentication]
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

    trips = Trip.objects.filter(employee__user__username=username, end_date__range=(start, end))
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
@api_view(["POST"])
@permission_classes([AllowAny])
def update_salary_deductions(request):
    data = request.data
    username = data.get("username")
    start_date = parse_datetime(data.get("start_date"))
    end_date = parse_datetime(data.get("end_date"))

    if not all([username, start_date, end_date]):
        return Response({"error": "Missing data"}, status=400)

    try:
        employee = Employee.objects.get(user__username=username)
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)

    # Filter only completed trips
    trips = Trip.objects.filter(
        employee=employee,
        is_in_progress=False,
        end_date__range=(start_date, end_date)
    )

    for trip in trips:
        salary, created = Salary.objects.get_or_create(trip=trip)
        salary.bonuses = data.get("bonuses", 0) or 0
        salary.bale = data.get("bale", 0) or 0
        salary.cash_advance = data.get("cash_advance", 0) or 0
        salary.cash_bond = data.get("cash_bond", 0) or 0
        salary.charges = data.get("charges", 0) or 0
        salary.others = data.get("others", 0) or 0
        salary.save()

    return Response({"status": "success"})



























































































#SALARY BREAKDOWN PDF GENERATION [ADMIN SIDE]
def get_week_of_month(date):
    day = date.day
    week_number = (day - 1) // 7 + 1
    return week_number

@api_view(['GET'])
@permission_classes([AllowAny])
def generate_salary_breakdown_pdf(request):
    username = request.GET.get("employee")
    start = parse_datetime(request.GET.get("start_date"))
    end = parse_datetime(request.GET.get("end_date"))

    if not all([username, start, end]):
        return Response({"error": "Missing parameters"}, status=400)

    try:
        employee = Employee.objects.select_related("user").get(user__username=username)
        user_type = employee.user.employee_type.lower()
    except Employee.DoesNotExist:
        return Response({"error": "Employee not found"}, status=404)

    if user_type == "staff":
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, 750, f"Payroll PDF Placeholder for Staff: {username}")
        p.drawString(100, 720, f"Date Range: {start.date()} to {end.date()}")
        p.drawString(100, 690, "You can replace this with your actual Staff logic later.")
        p.showPage()
        p.save()
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf', headers={
            'Content-Disposition': f'attachment; filename="{username}_staff_salary_breakdown.pdf"'
        })

    try:
        config = SalaryConfiguration.objects.last()
        sss_pct = config.sss
        philhealth_pct = config.philhealth
        pagibig_pct = config.pag_ibig
    except:
        return Response({"error": "Missing Salary Configuration."}, status=500)

    trips = Trip.objects.filter(
        employee=employee, 
        end_date__range=(start, end),
        is_in_progress=False
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
    elements.append(Paragraph(f"<b>Date Range:</b> {start.date()} to {end.date()}", left_align))
    elements.append(Spacer(1, 12))

    trip_table_data = [["Trip ID", "Num of Drops", "End Date", "Base Salary", "Multiplier", "Final Drop Made", "Adjusted Salary"]]
    gross_total = 0

    for record in data:
        trip = record["trip"]
        salary = record["salary"]
        base = salary.trip.base_salary if salary and salary.trip else 0
        multiplier = float(getattr(trip, "multiplier", 1))
        adjusted = base * Decimal(str(multiplier))
        gross_total += adjusted
        
        if hasattr(trip, "addresses") and trip.addresses and hasattr(trip, "clients") and trip.clients:
            last_address = trip.addresses[-1]
            last_client = trip.clients[-1]
            final_drop = f"{last_address} (Client: {last_client})"
        else:
            final_drop = "N/A"

        trip_table_data.append([
            str(trip.trip_id),
            str(getattr(trip, "num_of_drops", "N/A")),
            trip.end_date.strftime("%Y-%m-%d"),
            f"{base:.2f}",
            str(multiplier),
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

    bonus_total = sum(s["salary"].bonuses for s in data if s["salary"])
    additionals_total = sum(s["salary"].trip.additionals for s in data if s["salary"])
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

    monthly_deductions = {
        "Pag-IBIG Contribution": 0,
        "PhilHealth Contribution": 0,
        "SSS Contribution": 0,              
        "SSS Loan": 0,
        "Pag-IBIG Loan": 0,
    }

    for record in data:
        trip = record["trip"]
        salary = record["salary"]
        if not salary:
            continue

        base = salary.trip.base_salary if salary and salary.trip else 0
        multiplier = float(getattr(trip, "multiplier", 1))
        adjusted = base * Decimal(str(multiplier))
        week_index = get_week_of_month(trip.end_date)

        if week_index == 1:
            monthly_deductions["Pag-IBIG Contribution"] += adjusted * pagibig_pct
        elif week_index == 2:
            monthly_deductions["PhilHealth Contribution"] += adjusted * philhealth_pct
        elif week_index == 3:
            monthly_deductions["SSS Contribution"] += adjusted * sss_pct
        elif week_index == 4:
            monthly_deductions["SSS Loan"] += salary.sss_loan or 0
            monthly_deductions["Pag-IBIG Loan"] += salary.pagibig_loan or 0
        else:
            pass # ignore if 5th week, no monthly deductions

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
#GROSS PAYROLL PDF GENERATION [ADMIN]
def generate_gross_payroll_pdf(request):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=landscape(letter))
    width, height = landscape(letter)

    # Title
    title_text = "Gross Payroll Report – November 2024, 2nd Week"
    pdf.setFont("Helvetica-Bold", 16)
    text_width = pdf.stringWidth(title_text, "Helvetica-Bold", 16)
    x_position = (width - text_width) / 2
    pdf.drawString(x_position, height - 50, title_text)

    # Placeholder table for Gross Payroll (adjust later)
    payroll_data = [
        ["Employee", "Total Trips", "Gross Pay"],
        ["Juan Dela Cruz", "5", "₱ 8,500"],
        ["Maria Clara", "4", "₱ 7,200"],
        ["Jose Rizal", "6", "₱ 9,100"]
    ]

    def draw_table(data, x, y):
        table = Table(data, colWidths=[150] * len(data[0]), repeatRows=1)
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

    draw_table(payroll_data, 50, height - 150)

    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="gross_payroll.pdf"'
    return response

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
                
                is_in_progress=True
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
    employees = Employee.objects.filter(user__employee_type__in=["Driver", "Helper"]) \
                                .order_by("completed_trip_count")
    sorted_employees = sorted(employees, key=lambda emp: emp.completed_trip_count)
                                
    serializer = EmployeeSerializer(sorted_employees, many=True)
    return Response(serializer.data)