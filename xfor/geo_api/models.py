from cities_light.abstract_models import (
    AbstractCity,
    AbstractRegion,
    AbstractCountry,
    AbstractSubRegion,
)
from cities_light.receivers import connect_default_signals


class Country(AbstractCountry):
    """Custom Country model"""

    class Meta(AbstractCountry.Meta):
        verbose_name = "стран(а-у)"
        verbose_name_plural = "Страны"


connect_default_signals(Country)


class Region(AbstractRegion):
    """Custom Region model"""

    class Meta(AbstractRegion.Meta):
        verbose_name = "регион"
        verbose_name_plural = "Регионы"


connect_default_signals(Region)


class SubRegion(AbstractSubRegion):
    """Custom SubRegion model"""

    class Meta(AbstractSubRegion.Meta):
        verbose_name = "субрегион"
        verbose_name_plural = "Субрегионы"


connect_default_signals(SubRegion)


class City(AbstractCity):
    """Custom City model"""

    class Meta(AbstractCity.Meta):
        verbose_name = "город"
        verbose_name_plural = "Города"


connect_default_signals(City)
