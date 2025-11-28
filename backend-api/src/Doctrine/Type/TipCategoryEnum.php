<?php

namespace App\Doctrine\Type;

use App\Doctrine\Type\PostgresEnumType;
class TipCategoryEnum extends PostgresEnumType
{
    public const NAME = 'TipCategory';

    public static function getValues(): array
    {
        return [
            'GENERAL', 'TRANSPORTATION', 'FOOD', 'ACCOMMODATION', 'SAFETY',
            'BUDGET', 'TIMING', 'HIDDEN_SPOT', 'LOCAL_CULTURE', 'WARNING', 'INSIDER'
        ];
    }

    public function getName(): string
    {
        return self::NAME;
    }
}
