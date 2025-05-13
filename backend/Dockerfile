FROM python:3.12-alpine

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies required to build Python packages and interact with PostgreSQL
RUN apk add --no-cache \
    gcc \
    libpq \
    musl-dev \
    postgresql-dev \
    python3-dev

# Copy requirements and install dependencies with caching enabled
COPY requirements.txt /app/
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt gunicorn

# Copy the rest of the application code
COPY . /app/

# Create a non-root user, prepare static and media directories, and set permissions
RUN adduser -D appuser && \
    mkdir -p /app/staticfiles /app/media && \
    chown -R appuser:appuser /app && \
    chmod -R 755 /app/staticfiles /app/media

# Switch to the non-root user
USER appuser

# Run Django management commands to collect static files, create migrations, and apply them.
RUN python manage.py collectstatic --noinput && \
    python manage.py makemigrations --no-input && \
    python manage.py migrate --no-input --settings=backend.settings

# Expose the application port (if desired, you can specify the port here)
# EXPOSE ${APP_PORT}

# Start Gunicorn with 3 workers
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:${APP_PORT}", "--workers", "3"]
