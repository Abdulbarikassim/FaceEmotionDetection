import uuid
from io import BytesIO

import requests
from PIL import Image

from config import Config

BASE_URL = (Config.SUPABASE_URL or "").rstrip("/") + "/storage/v1"
BUCKET = Config.STORAGE_BUCKET
TIMEOUT = 15

ALLOWED_TYPES = {"JPEG": ("image/jpeg", "jpg"), "PNG": ("image/png", "png"), "WEBP": ("image/webp", "webp")}


def _headers():
    # Secret key: backend only, never send it to the frontend
    key = Config.SUPABASE_SECRET_KEY
    return {"apikey": key, "Authorization": f"Bearer {key}"}


def ensure_bucket():
    """Create the public image bucket if it doesn't exist yet"""
    response = requests.get(f"{BASE_URL}/bucket/{BUCKET}", headers=_headers(), timeout=TIMEOUT)
    if response.ok:
        return

    response = requests.post(
        f"{BASE_URL}/bucket",
        headers=_headers(),
        json={
            "id": BUCKET,
            "name": BUCKET,
            "public": True,
            "file_size_limit": 5 * 1024 * 1024,
            "allowed_mime_types": [mime for mime, _ in ALLOWED_TYPES.values()],
        },
        timeout=TIMEOUT,
    )
    # 409 = another process created it at the same time
    if not response.ok and response.status_code != 409:
        raise RuntimeError(f"Could not create storage bucket: {response.status_code} {response.text}")
    print(f"Storage bucket '{BUCKET}' ready")


def _prepare_image(image_bytes):
    """Return (bytes, content_type, extension); converts unsupported formats to JPEG"""
    image = Image.open(BytesIO(image_bytes))
    if image.format in ALLOWED_TYPES:
        content_type, ext = ALLOWED_TYPES[image.format]
        return image_bytes, content_type, ext

    buffer = BytesIO()
    image.convert("RGB").save(buffer, format="JPEG", quality=90)
    return buffer.getvalue(), "image/jpeg", "jpg"


def upload_image(image_bytes, user_id):
    """Upload an image and return (path, public_url). Random file names so links can't be guessed."""
    data, content_type, ext = _prepare_image(image_bytes)
    path = f"{user_id}/{uuid.uuid4().hex}.{ext}"

    response = requests.post(
        f"{BASE_URL}/object/{BUCKET}/{path}",
        headers={**_headers(), "Content-Type": content_type, "x-upsert": "false"},
        data=data,
        timeout=TIMEOUT,
    )
    if not response.ok:
        raise RuntimeError(f"Upload failed: {response.status_code} {response.text}")

    return path, f"{BASE_URL}/object/public/{BUCKET}/{path}"


def delete_image(path):
    """Delete an image from the bucket; returns True on success"""
    response = requests.delete(f"{BASE_URL}/object/{BUCKET}/{path}", headers=_headers(), timeout=TIMEOUT)
    if not response.ok:
        print(f"Could not delete image {path}: {response.status_code} {response.text}")
    return response.ok
