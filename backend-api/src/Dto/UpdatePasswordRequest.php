<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class UpdatePasswordRequest
{
    #[Assert\NotBlank]
    public ?string $oldPassword = null;

    #[Assert\NotBlank]
    #[Assert\Length(min: 8)]
    public ?string $newPassword = null;
}
