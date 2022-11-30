from cities_light.admin import CityAdmin, CountryAdmin, RegionAdmin, SubRegionAdmin
from .models import City, Country, Region, SubRegion
from django.contrib import admin


class CustomCityAdmin(CityAdmin):
    """Custom City admin"""

    list_display = [
        "alternate_names",
        "name_ascii",
        "region",
        "country",
        "subregion",
        "timezone",
    ]
    list_select_related = ["country", "region", "subregion"]


class CustomCountryAdmin(CountryAdmin):
    """Custom Country admin"""

    list_display = [
        "alternate_names",
        "name_ascii",
        "code2",
        "code3",
        "continent",
        "phone",
    ]


class CustomRegionAdmin(RegionAdmin):
    """Custom Region admin"""

    list_display = ["alternate_names", "name_ascii", "country"]


class CustomSubRegionAdmin(SubRegionAdmin):
    """Custom SubRegion admin"""

    list_display = ["alternate_names", "name_ascii", "country", "region"]
    list_select_related = ["country", "region"]


to_register = [
    (City, CustomCityAdmin),
    (SubRegion, CustomSubRegionAdmin),
    (Region, CustomRegionAdmin),
    (Country, CustomCountryAdmin),
]

to_unregister = [City, SubRegion, Region, Country]

for model in to_unregister:
    admin.site.unregister(model)

for model, model_admin in to_register:
    admin.site.register(model, model_admin)
