<?php

namespace App\Doctrine\Type;

use App\Doctrine\Type\PostgresEnumType;

class VoteTypeEnum extends PostgresEnumType
{
    public const NAME = 'VoteType';

    public static function getValues(): array
    {
        return ['UP', 'DOWN'];
    }

    public function getName(): string
    {
        return self::NAME;
    }
}
