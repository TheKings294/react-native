<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Entity\User;
use Nelmio\ApiDocBundle\Attribute\Security;
use OpenApi\Attributes as OA;

class ApiLoginController extends AbstractController
{
    #[Route('/api/auth/login', name: 'api_login', methods: ['POST'])]
    #[OA\Post(
        path: '/api/auth/login',
        description: 'This endpoint authenticates a user via Symfony security and returns user info + a token if credentials are valid.',
        summary: 'Authenticate a user and return a token',
        requestBody: new OA\RequestBody(
            description: 'User login credentials',
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'john@example.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'password123'),
                ],
                type: 'object',
            )
        ),
        tags: ['Authentication'],
        responses: [
            new OA\Response(
                response: Response::HTTP_OK,
                description: 'Login successful',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Login successful'),
                        new OA\Property(
                            property: 'user',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 1),
                                new OA\Property(property: 'email', type: 'string', example: 'john@example.com'),
                                new OA\Property(property: 'username', type: 'string', example: 'johnny'),
                                new OA\Property(property: 'displayName', type: 'string', example: 'John Doe'),
                                new OA\Property(property: 'avatar', type: 'string', example: 'https://example.com/avatar.jpg', nullable: true, ),
                                new OA\Property(property: 'bio', type: 'string', example: 'Full-stack developer', nullable: true, ),
                                new OA\Property(property: 'isProfilePublic', type: 'boolean', example: true),
                                new OA\Property(property: 'lastLoginAt', type: 'string', example: '2025-03-20 14:30:12', nullable: true, ),
                                new OA\Property(property: 'token', type: 'string', example: 'Hello')
                            ],
                            type: 'object',
                        )
                    ],
                    type: 'object',
                )
            ),
        ]
    )]
    #[Security(name: 'cookieAuth')]
    public function login(#[CurrentUser] ?User $user): Response
    {
        if (null === $user) {
            return $this->json([
                'message' => 'missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = "Hello";

        return new JsonResponse([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getUserIdentifier(),
                'username' => $user->getUsername(),
                'displayName' => $user->getDisplayName(),
                'avatar' => $user->getAvatar(),
                'bio' => $user->getBio(),
                'isProfilePublic' => $user->isProfilePublic(),
                'lastLoginAt' => $user->getLastLoginAt()?->format('Y-m-d H:i:s'),
                'token' => $token,
            ]
        ], Response::HTTP_OK);
    }
}
