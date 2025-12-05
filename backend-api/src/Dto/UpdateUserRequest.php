<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UpdateUserRequest
{
    #[Assert\Length(min: 3, max: 50)]
    public ?string $username = null;

    #[Assert\Length(min: 3, max: 50)]
    public ?string $displayName = null;

    #[Assert\Url]
    public ?string $avatar = null;

    #[Assert\Length(max: 255)]
    public ?string $bio = null;

    #[Assert\Type('bool')]
    public ?bool $isProfilePublic = null;
}
