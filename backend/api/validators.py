import os
from PIL import Image, UnidentifiedImageError
from django.core.exceptions import ValidationError

def validate_image(value):
    try:
        # Attempt to open the image using Pillow
        image = Image.open(value)
        image_format = image.format.lower()  # e.g., 'jpeg', 'png'
    except UnidentifiedImageError:
        raise ValidationError("Invalid image file. Unable to identify the image format.")

    # Define allowed common image types
    valid_image_formats = ["jpeg", "png", "gif", "bmp", "webp"]

    if image_format not in valid_image_formats:
        raise ValidationError(
            "Unsupported image format. Allowed types are: JPG, JPEG, PNG, GIF, BMP, and WebP."
        )

    # Check that the file extension matches the image content
    ext = os.path.splitext(value.name)[1][1:].lower()  # get extension without dot

    if image_format == "jpeg" and ext not in ["jpg", "jpeg"]:
        raise ValidationError(
            "File extension does not match the image content. Expected .jpg or .jpeg"
        )
    elif image_format != "jpeg" and image_format != ext:
        raise ValidationError(
            f"File extension does not match the image content. Expected .{image_format}"
        )
