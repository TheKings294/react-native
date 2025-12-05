<?php

namespace App\Doctrine\Type;

use App\Doctrine\Type\PostgresEnumType;

class BookTemplateEnum extends PostgresEnumType
{
    public const NAME = 'BookTemplate';

    public static function getValues(): array
    {
        return ['SIMPLE', 'TRAVEL_DIARY', 'PHOTO_ALBUM', 'MAGAZINE', 'MINIMALIST', 'CLASSIC'];
    }

    public function getName(): string
    {
        return self::NAME;
    }
}
