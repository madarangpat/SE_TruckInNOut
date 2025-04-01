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
                user_lat=request.data.get("user_lat", []),
                user_lng=request.data.get("user_lng", []),
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
#GROSS PAYROLL PDF GENERATION
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
#SALARY BREAKDOWN PDF GENERATION
@api_view(['GET'])
@permission_classes([AllowAny])
def generate_salary_breakdown_pdf(request):
    username = request.GET.get("employee")
    start = parse_datetime(request.GET.get("start_date"))
    end = parse_datetime(request.GET.get("end_date"))

    if not all([username, start, end]):
        return Response({"error": "Missing parameters"}, status=400)

    trips = Trip.objects.filter(employee__user__username=username, end_date__range=(start, end))
    data = []
    for trip in trips:
        salary = Salary.objects.filter(trip=trip).first()
        data.append({"trip": trip, "salary": salary})

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(letter), topMargin=30, leftMargin=30, rightMargin=30, bottomMargin=30)
    styles = getSampleStyleSheet()

    # Define left-aligned text style
    left_align = ParagraphStyle(name='LeftAlign', parent=styles['Normal'], alignment=TA_LEFT)
    left_heading = ParagraphStyle(name='LeftHeading', parent=styles['Heading4'], alignment=TA_LEFT)

    elements = []

    # Header
    elements.append(Paragraph(f"<b>Salary Report for {username}</b>", left_align))
    elements.append(Paragraph(f"<b>Date Range:</b> {start.date()} to {end.date()}", left_align))
    elements.append(Spacer(1, 12))

    # Trip Table
    trip_table_data = [["Trip ID", "Num of Drops", "End Date", "Base Salary", "Multiplier", "Gross Amount"]]
    gross_total = 0

    for record in data:
        trip = record["trip"]
        salary = record["salary"]
        base = salary.base_salary if salary else 0
        multiplier = float(getattr(trip, "multiplier", 1))
        computed = base * multiplier
        gross_total += computed

        trip_table_data.append([
            str(trip.trip_id),
            str(getattr(trip, "num_of_drops", "N/A")),
            trip.end_date.strftime("%Y-%m-%d"),
            f" {base:.2f}",
            str(multiplier),
            f" {computed:.2f}"
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

    # Additionals Table
    bonus_sum = sum(s["salary"].bonuses for s in data if s["salary"])
    additionals_sum = sum(s["salary"].additionals for s in data if s["salary"])
    total_add = bonus_sum + additionals_sum
    add_table_data = [["Bonuses", "Additionals"], [f" {bonus_sum:.2f}", f" {additionals_sum:.2f}"]]

    add_table = Table(add_table_data, hAlign='LEFT')
    add_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(Paragraph("<b>ADDITIONALS</b>", left_heading))
    elements.append(add_table)
    elements.append(Spacer(1, 12))

    # Deductions Table
    totals = {
        "sss": 0, "pagibig": 0, "philhealth": 0, "vale": 0,
        "sss_loan": 0, "pagibig_loan": 0, "cash_advance": 0,
        "cash_bond": 0, "charges": 0, "others": 0
    }

    for s in data:
        salary = s["salary"]
        if salary:
            totals["vale"] += salary.vale
            totals["sss_loan"] += salary.sss_loan
            totals["pagibig_loan"] += salary.pagibig_loan
            totals["cash_advance"] += salary.cash_advance
            totals["cash_bond"] += salary.cash_bond
            totals["charges"] += salary.charges
            totals["others"] += salary.others

    deduction_total = sum(totals.values())
    ded_table_data = [[
        "SSS", "Pag-IBIG", "PhilHealth", "Vale", "SSS Loan",
        "Pag-IBIG Loan", "Cash Advance", "Cash Bond", "Charges", "Others"
    ], [
        f" {totals['sss']:.2f}",
        f" {totals['pagibig']:.2f}",
        f" {totals['philhealth']:.2f}",
        f" {totals['vale']:.2f}",
        f" {totals['sss_loan']:.2f}",
        f" {totals['pagibig_loan']:.2f}",
        f" {totals['cash_advance']:.2f}",
        f" {totals['cash_bond']:.2f}",
        f" {totals['charges']:.2f}",
        f" {totals['others']:.2f}",
    ]]

    ded_table = Table(ded_table_data, hAlign='LEFT')
    ded_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(Paragraph("<b>DEDUCTIONS</b>", left_heading))
    elements.append(ded_table)
    elements.append(Spacer(1, 12))

    # Totals Table
    net_pay = gross_total + total_add - deduction_total
    total_table_data = [["Gross Salary", "Additionals", "Deductions", "Net Pay"],
                        [f" {gross_total:.2f}", f" {total_add:.2f}", f"-  {deduction_total:.2f}", f" {net_pay:.2f}"]]

    total_table = Table(total_table_data, hAlign='LEFT')
    total_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(Paragraph("<b>TOTALS</b>", left_heading))
    elements.append(total_table)

    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return HttpResponse(buffer, content_type='application/pdf', headers={
        'Content-Disposition': f'attachment; filename="{username}_salary_breakdown.pdf"'
    })
    
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
# # Define the viewset for SalaryConfiguration
# class SalaryConfigurationViewSet(viewsets.ModelViewSet):
#     queryset = SalaryConfiguration.objects.all()
#     serializer_class = SalaryConfigurationSerializer

#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         data = request.data
#         # Assuming the data is in the correct structure for the JSONField
#         salary_data = {
#             'sss': data.get('sss'),
#             'philhealth': data.get('philhealth'),
#             'pag_ibig': data.get('pag_ibig'),
#         }
#         # Update the `salary_data` field in the model
#         instance.salary_data = salary_data
#         instance.save()
#         return Response(self.serializer_class(instance).data)
# =====================================================================================================
@api_view(['GET'])
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
