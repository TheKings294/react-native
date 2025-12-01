<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController
{
    public function index(UserPasswordHasherInterface $passwordHasher): Response
    {
        $user = new User();
        $plainPassword = "";

        $hashedPassword = $passwordHasher->hashPassword($user, $plainPassword);
        $user->setPasswordHash($hashedPassword);

        return $this->json(["success" => true, "user" => $user]);
    }
}
