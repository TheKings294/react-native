<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;
use OpenApi\Attributes\Response as Res;
use OpenApi\Attributes\RequestBody;
use OpenApi\Attributes\Property;
use function Symfony\Component\Clock\now;

#[Route('/api/auth')]
#[OA\Tag(name: 'Registration')]
class RegistrationController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator
    ) {}

    #[Route('/register', name: 'register', methods: ['POST'])]
    #[OA\Post(
        path: "/api/auth/register",
        description: "Creates a new user account after validating email, username, and password.",
        summary: "Register a new user",
        requestBody: new RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email", "username", "password"],
                properties: [
                    new Property(property: "email", type: "string", example: "john@example.com"),
                    new Property(property: "username", type: "string", example: "john_doe"),
                    new Property(property: "password", type: "string", example: "strongPassword123"),
                    new Property(property: "displayName", type: "string", example: "John", nullable: true),
                    new Property(property: "bio", type: "string",example: "Hello, I'm John!", nullable: true),
                    new Property(property: "isProfilePublic", type: "boolean", example: true, nullable: true),
                ]
            )
        ),
        responses: [
            new Res(
                response: 201,
                description: "User registered successfully",
                content: new OA\JsonContent(
                    properties: [
                        new Property(property: "message", type: "string", example: "User registered successfully"),
                        new Property(
                            property: "user",
                            properties: [
                                new Property(property: "id", type: "integer", example: 12),
                                new Property(property: "email", type: "string", example: "john@example.com"),
                                new Property(property: "username", type: "string", example: "john_doe"),
                                new Property(property: "displayName", type: "string", example: "John"),
                                new Property(property: "createdAt", type: "string", example: "2025-01-01 12:00:00"),
                            ],
                            type: 'object'
                        ),
                    ]
                )
            ),
            new Res(
                response: 400,
                description: "Invalid input or missing required fields",
                content: new OA\JsonContent(
                    properties: [
                        new Property(property: "error", type: "string", example: "Missing required fields: email, username, and password are required")
                    ]
                )
            ),
            new Res(
                response: 409,
                description: "User already exists",
                content: new OA\JsonContent(
                    properties: [
                        new Property(property: "error", type: "string", example: "This email is already registered")
                    ]
                )
            ),
            new Res(
                response: 500,
                description: "Internal server error",
                content: new OA\JsonContent(
                    properties: [
                        new Property(property: "error", type: "string", example: "Registration failed: Some error message")
                    ]
                )
            ),
        ]
    )]
    public function register(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
            }

            // Validate required fields
            if (empty($data['email']) || empty($data['username']) || empty($data['password'])) {
                return $this->json([
                    'error' => 'Missing required fields: email, username, and password are required'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Check if email already exists
            if ($this->userRepository->findByEmail($data['email'])) {
                return $this->json([
                    'error' => 'This email is already registered'
                ], Response::HTTP_CONFLICT);
            }

            // Check if username already exists
            if ($this->userRepository->findByUsername($data['username'])) {
                return $this->json([
                    'error' => 'This username is already taken'
                ], Response::HTTP_CONFLICT);
            }

            // Validate password strength
            if (strlen($data['password']) < 8) {
                return $this->json([
                    'error' => 'Password must be at least 8 characters long'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Create new user
            $user = new User();
            $user->setEmail($data['email']);
            $user->setUsername($data['username']);

            // Optional fields
            if (isset($data['displayName'])) {
                $user->setDisplayName($data['displayName']);
            }
            if (isset($data['bio'])) {
                $user->setBio($data['bio']);
            }
            $user->setIsProfilePublic(isset($data['isProfilePublic']) ? (bool) $data['isProfilePublic'] : true);

            // Hash password
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPasswordHash($hashedPassword);

            // Validate entity
            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $user->setRoles(['ROLE_USER']);
            $user->setCreatedAt(new \DateTimeImmutable());
            $user->setUpdatedAt(new \DateTimeImmutable());

            // Save user
            $this->userRepository->save($user, true);

            return $this->json([
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getUserIdentifier(),
                    'username' => $user->getUsername(),
                    'displayName' => $user->getDisplayName(),
                    'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Registration failed: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/check-email', name: 'check_email', methods: ['POST'])]
    public function checkEmail(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['email'])) {
            return $this->json(['error' => 'Email is required'], Response::HTTP_BAD_REQUEST);
        }

        $exists = $this->userRepository->findByEmail($data['email']) !== null;

        return $this->json(['available' => !$exists]);
    }

    #[Route('/check-username', name: 'check_username', methods: ['POST'])]
    public function checkUsername(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['username'])) {
            return $this->json(['error' => 'Username is required'], Response::HTTP_BAD_REQUEST);
        }

        $exists = $this->userRepository->findByUsername($data['username']) !== null;

        return $this->json(['available' => !$exists]);
    }
}
