<?php

namespace App\Doctrine\Type;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;

abstract class PostgresEnumType extends Type
{
    abstract public static function getValues(): array;

    public function getSQLDeclaration(array $fieldDeclaration, AbstractPlatform $platform): string
    {
        // PostgreSQL enum type name = doctrine type name
        return sprintf('%s', $this->getName());
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): ?string
    {
        return $value; // Already a string in PHP
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform): ?string
    {
        if ($value === null) {
            return null;
        }

        if (!in_array($value, static::getValues(), true)) {
            throw new \InvalidArgumentException(sprintf(
                'Invalid value "%s" for ENUM "%s". Allowed values: %s',
                $value,
                $this->getName(),
                implode(', ', static::getValues())
            ));
        }

        return $value;
    }

    public function requiresSQLCommentHint(AbstractPlatform $platform)
    {
        return true; // Required so Doctrine keeps the type
    }
}
