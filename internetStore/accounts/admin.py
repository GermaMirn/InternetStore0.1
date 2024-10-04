from django.contrib import admin
from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
  list_display = (
    "user",
    "fullname",
    "phoneNumber",
  )

  readonly_fields = ("user",)
  ordering = ("user", )


admin.site.register(Profile, ProfileAdmin)