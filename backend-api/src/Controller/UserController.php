<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Entity\User;
use App\Dto\UpdateUserRequest;
use App\Dto\UpdatePasswordRequest;

#[Route('/api/user')]
#[OA\Tag(name: 'Users')]
class UserController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator,
        private readonly SerializerInterface $serializer,
        private readonly UserPasswordHasherInterface $hasher
    )
    {
    }

    #[Route('/update', name: 'api_user_update', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    #[OA\Put(
        description: 'Allows the authenticated user to update their username, display name, avatar, bio, or visibility.',
        summary: 'Update the authenticated user profile',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'username', type: 'string', nullable: true),
                    new OA\Property(property: 'displayName', type: 'string', nullable: true),
                    new OA\Property(property: 'avatar', type: 'string', nullable: true),
                    new OA\Property(property: 'bio', type: 'string', nullable: true),
                    new OA\Property(property: 'isProfilePublic', type: 'boolean', nullable: true),
                ],
                type: 'object'
            )
        ),
        tags: ['Users'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'User updated successfully'
            ),
            new OA\Response(
                response: 400,
                description: 'Validation errors'
            ),
            new OA\Response(
                response: 401,
                description: 'Unauthorized'
            )
        ]
    )]
    public function updateUser(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $dto = $this->serializer->deserialize($request->getContent(), UpdateUserRequest::class, 'json');
        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        if ($dto->username !== null) {
            $user->setUsername($dto->username);
        }
        if ($dto->displayName !== null) {
            $user->setDisplayName($dto->displayName);
        }
        if ($dto->avatar !== null) {
            $user->setAvatar($dto->avatar);
        }
        if ($dto->bio !== null) {
            $user->setBio($dto->bio);
        }
        if ($dto->isProfilePublic !== null) {
            $user->setIsProfilePublic($dto->isProfilePublic);
        }

        $user->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json(['message' => 'User updated successfully'], Response::HTTP_OK);
    }

    #[Route('/update-password', name: 'api_user_update_password', methods: ['PATCH'])]
    #[IsGranted('ROLE_USER')]
    #[OA\Patch(
        description: 'Requires the current password and a new password.',
        summary: 'Update the authenticated user password',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['oldPassword', 'newPassword'],
                properties: [
                    new OA\Property(property: 'oldPassword', type: 'string'),
                    new OA\Property(property: 'newPassword', type: 'string'),
                ],
                type: 'object',
            )
        ),
        tags: ['Users'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Password updated successfully'
            ),
            new OA\Response(
                response: 400,
                description: 'Validation errors'
            ),
            new OA\Response(
                response: 401,
                description: 'Invalid credentials or unauthorized'
            )
        ]
    )]
    public function updatePassword(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $dto = $this->serializer->deserialize($request->getContent(), UpdatePasswordRequest::class, 'json');
        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        if (!$this->hasher->isPasswordValid($user, $dto->oldPassword)) {
            return $this->json(['error' => 'Invalid current password'], Response::HTTP_UNAUTHORIZED);
        }

        $user->setPasswordHash($this->hasher->hashPassword($user, $dto->newPassword));
        $user->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json(['message' => 'Password updated successfully'], Response::HTTP_OK);
    }

    #[Route('/delete/{id}', name: 'api_user_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    #[OA\Delete(
        description: 'Allows a user to delete their own account. Admins may delete any account.',
        summary: 'Delete a user',
        tags: ['Users'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                description: 'The ID of the user to delete',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'User deleted successfully'
            ),
            new OA\Response(
                response: 404,
                description: 'User not found'
            ),
            new OA\Response(
                response: 403,
                description: 'Forbidden — trying to delete another user without admin role'
            )
        ]
    )]
    public function deleteUser(int $id): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $this->getUser();

        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Prevent deleting others unless admin
        if ($currentUser->getId() !== $user->getId() && !in_array('ROLE_ADMIN', $currentUser->getRoles())) {
            return $this->json(['error' => 'You cannot delete another user'], Response::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return $this->json(['message' => 'User deleted successfully'], Response::HTTP_OK);
    }
}
