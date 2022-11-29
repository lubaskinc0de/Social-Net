from datetime import datetime
from typing import Any, Iterable, Collection
from django.forms.fields import ImageField as ImageFieldValidator
from rest_framework import serializers
from django.utils.translation import gettext as _
from uuid import uuid4
import os
from django.utils.deconstruct import deconstructible


@deconstructible
# сlass decorator that allows the decorated class to be serialized by the migrations subsystem.
class PathAndRenameDate:
    """
    The class that is used to add the current year/month to the source path and renamed to uuid4 file
    """

    def __init__(self, sub_path: str) -> None:
        self.path = sub_path

    def __call__(self, instance: Any, filename: str) -> str:
        """Return path to the renamed file"""

        ext = filename.split(".")[-1]
        filename = "{}.{}".format(uuid4().hex, ext)

        def make_date_path(path: str) -> str:
            now = datetime.now()
            return os.path.join(path, "{}/{}".format(now.year, now.month))

        date_path = make_date_path(self.path)
        full_path = os.path.join(date_path, filename)

        return full_path


def validate_images(images: Collection) -> None:
    """
    Accepts Collection of images and validates them
    """

    if not any(images):
        return

    if len(images) > 10:
        raise serializers.ValidationError(
            detail={
                "max_file_length": _(
                    "Недопустимое кол-во файлов, максимальное кол-во файлов: 10"
                )
            },
            code="max_file_length",
        )

    images_validator(images)


def images_validator(images: Iterable) -> None:
    """
    Accepts images and checks that each of them is really an image
    """

    img_validator = ImageFieldValidator().to_python

    for image in images:
        if image.size / 1024 / 1024 > 8:
            raise serializers.ValidationError(
                detail={
                    "file_too_large": _("Файл, который вы загрузили, слишком большой.")
                },
                code="file_too_large",
            )
        img_validator(image)
