# Backend image for Hugging Face Spaces (Docker SDK)
FROM python:3.13-slim

# No .pyc files, unbuffered logs (so they show up live), quieter TensorFlow logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TF_CPP_MIN_LOG_LEVEL=2

# Hugging Face runs containers as user ID 1000
RUN useradd -m -u 1000 user
WORKDIR /home/user/app

# Install dependencies first so this layer is cached when only code changes
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app code and model (.dockerignore keeps secrets and extras out)
COPY --chown=user . .

USER user

# Hugging Face Spaces expects the app on port 7860.
# 1 worker keeps a single copy of the model in memory; threads handle parallel requests.
EXPOSE 7860
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "1", "--threads", "4", "--timeout", "120", "app:app"]
