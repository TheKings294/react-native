<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class AuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    public function __construct(private UserRepository $userRepository)
    {
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): ?JsonResponse
    {
        $user = $token->getUser();

        if ($user instanceof User) {
            // Update last login time
            $user->setLastLoginAt(new \DateTimeImmutable());
            $this->userRepository->save($user, true);
        }

        return null;
    }
}
