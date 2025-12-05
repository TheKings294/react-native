<?php

namespace App\Doctrine\Type;

class VoteCategoryEnum extends PostgresEnumType
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
