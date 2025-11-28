<?php

namespace App\Doctrine\Type;

use App\Doctrine\Type\PostgresEnumType;

class PlaceTypeEnum extends PostgresEnumType
{
    public const NAME = 'PlaceType';

    public static function getValues(): array
    {
        return [
            'RESTAURANT', 'HOTEL', 'ATTRACTION', 'MUSEUM', 'PARK', 'BEACH',
            'MOUNTAIN', 'CITY', 'VIEWPOINT', 'HIDDEN_GEM', 'CAFE', 'BAR',
            'SHOP', 'TRANSPORTATION', 'OTHER'
        ];
    }

    public function getName(): string
    {
        return self::NAME;
    }
}
