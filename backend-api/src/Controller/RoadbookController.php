<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Roadbook;
use App\Repository\RoadbookRepository;
use App\Repository\PlaceRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Attribute\Model;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;


#[Route('/api/roadbooks')]
#[OA\Tag(name: 'Roadbooks')]
class RoadbookController extends AbstractController
{
    public function __construct(
        private RoadbookRepository $roadbookRepository,
        private PlaceRepository $placeRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {
    }

    #[Route('', name: 'api_roadbooks_list', methods: ['GET'])]
    #[OA\Get(
        description: 'Returns a list of all roadbooks created by the authenticated user',
        summary: 'Get all roadbooks for the authenticated user',
    )]
    #[OA\Response(
        response: 200,
        description: 'List of roadbooks',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: Roadbook::class, groups: ['roadbook:list']))
        )
    )]
    #[OA\Response(response: 401, description: 'Unauthorized')]
    #[IsGranted('ROLE_USER')]
    public function list(): JsonResponse
    {
        $user = $this->getUser();

        $roadbooks = $this->roadbookRepository->findByUser($user);

        return $this->json($roadbooks, Response::HTTP_OK, [], [
            'groups' => ['roadbook:list']
        ]);
    }

    #[Route('/{id}', name: 'api_roadbooks_show', methods: ['GET'])]
    #[OA\Get(
        description: 'Returns details of a specific roadbook',
        summary: 'Get a specific roadbook',
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'Roadbook ID',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Roadbook details',
        content: new OA\JsonContent(ref: new Model(type: Roadbook::class, groups: ['roadbook:read']))
    )]
    #[OA\Response(response: 404, description: 'Roadbook not found')]
    #[OA\Response(response: 403, description: 'Access denied')]
    #[IsGranted('ROLE_USER')]
    public function show(int $id): JsonResponse
    {
        $user = $this->getUser();
        $roadbook = $this->roadbookRepository->findOneByIdAndUser($id, $user);

        if (!$roadbook) {
            return $this->json([
                'error' => 'Roadbook not found or access denied'
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json($roadbook, Response::HTTP_OK, [], [
            'groups' => ['roadbook:read']
        ]);
    }

    #[Route('', name: 'api_roadbooks_create', methods: ['POST'])]
    #[OA\Post(
        description: 'Creates a new roadbook for the authenticated user',
        summary: 'Create a new roadbook',
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['title'],
            properties: [
                new OA\Property(property: 'title', type: 'string', example: 'My Summer Trip'),
                new OA\Property(property: 'description', type: 'string', example: 'A beautiful road trip through Europe'),
                new OA\Property(
                    property: 'places',
                    type: 'array',
                    items: new OA\Items(type: 'integer'),
                    example: [1, 2, 3]
                )
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Roadbook created successfully',
        content: new OA\JsonContent(ref: new Model(type: Roadbook::class, groups: ['roadbook:create']))
    )]
    #[OA\Response(response: 400, description: 'Invalid input')]
    #[OA\Response(response: 401, description: 'Unauthorized')]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $roadbook = new Roadbook();
        $roadbook->setTitle($data['title'] ?? '');
        $roadbook->setDescription($data['description'] ?? null);
        $roadbook->setCoverImage($data['coverImage'] ?? null);
        if (!empty($data['startDate'])) {
            $roadbook->setStartDate(new \DateTimeImmutable($data['startDate']));
        }
        if (!empty($data['endDate'])) {
            $roadbook->setEndDate(new \DateTimeImmutable($data['endDate']));
        }
        $roadbook->setCountries(isset($data['countries']) && is_array($data['countries']) ? $data['countries'] : null);
        $roadbook->setTags(isset($data['tags']) && is_array($data['tags']) ? $data['tags'] : null);
        $roadbook->setIsPublished(isset($data['isPublished']) ? (bool)$data['isPublished'] : false);
        $roadbook->setIsPublic(isset($data['isPublic']) ? (bool)$data['isPublic'] : false);
        if (!empty($data['template'])) {
            $roadbook->setTemplate($data['template']);
        }
        if (array_key_exists('theme', $data)) {
            $roadbook->setTheme($data['theme']);
        }
        $now = new \DateTimeImmutable();
        $roadbook->setCreatedAt($now);
        $roadbook->setUpdatedAt($now);
        $roadbook->setViewCount(0);
        $roadbook->setFavoriteCount(0);
        $roadbook->setUserId($user->getId());

        // Add places if provided
        if (isset($data['places']) && is_array($data['places'])) {
            foreach ($data['places'] as $placeId) {
                $place = $this->placeRepository->find($placeId);
                if ($place) {
                    $roadbook->addPlace($place);
                }
            }
        }

        $errors = $this->validator->validate($roadbook);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->roadbookRepository->save($roadbook, true);

        return $this->json($roadbook, Response::HTTP_CREATED, [], [
            'groups' => ['roadbook:read']
        ]);
    }

    #[Route('/{id}', name: 'api_roadbooks_update', methods: ['PUT', 'PATCH'])]
    #[OA\Put(
        description: 'Updates an existing roadbook',
        summary: 'Update a roadbook',
    )]
    #[OA\Patch(
        description: 'Updates an existing roadbook',
        summary: 'Update a roadbook',
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'Roadbook ID',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'title', type: 'string', example: 'Updated Trip Title'),
                new OA\Property(property: 'description', type: 'string', example: 'Updated description'),
                new OA\Property(
                    property: 'places',
                    type: 'array',
                    items: new OA\Items(type: 'integer'),
                    example: [1, 3, 5]
                )
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Roadbook updated successfully',
        content: new OA\JsonContent(ref: new Model(type: Roadbook::class, groups: ['roadbook:read']))
    )]
    #[OA\Response(response: 404, description: 'Roadbook not found')]
    #[OA\Response(response: 403, description: 'Access denied')]
    #[IsGranted('ROLE_USER')]
    public function update(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        $roadbook = $this->roadbookRepository->findOneByIdAndUser($id, $user);

        if (!$roadbook) {
            return $this->json([
                'error' => 'Roadbook not found or access denied'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $roadbook->setTitle($data['title']);
        }

        if (isset($data['description'])) {
            $roadbook->setDescription($data['description']);
        }

        // Update places if provided
        if (isset($data['places']) && is_array($data['places'])) {
            // Remove all existing places
            foreach ($roadbook->getPlaces() as $place) {
                $roadbook->removePlace($place);
            }

            // Add new places
            foreach ($data['places'] as $placeId) {
                $place = $this->placeRepository->find($placeId);
                if ($place) {
                    $roadbook->addPlace($place);
                }
            }
        }

        $errors = $this->validator->validate($roadbook);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($roadbook, Response::HTTP_OK, [], [
            'groups' => ['roadbook:read']
        ]);
    }

    #[Route('/{id}', name: 'api_roadbooks_delete', methods: ['DELETE'])]
    #[OA\Delete(
        description: 'Deletes a roadbook',
        summary: 'Delete a roadbook',
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'Roadbook ID',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 204,
        description: 'Roadbook deleted successfully'
    )]
    #[OA\Response(response: 404, description: 'Roadbook not found')]
    #[OA\Response(response: 403, description: 'Access denied')]
    public function delete(int $id): JsonResponse
    {
        $user = $this->getUser();
        $roadbook = $this->roadbookRepository->findOneByIdAndUser($id, $user);

        if (!$roadbook) {
            return $this->json([
                'error' => 'Roadbook not found or access denied'
            ], Response::HTTP_NOT_FOUND);
        }

        $this->roadbookRepository->remove($roadbook, true);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/search', name: 'api_roadbooks_search', methods: ['GET'])]
    #[OA\Get(
        description: 'Search roadbooks by title',
        summary: 'Search roadbooks',
    )]
    #[OA\Parameter(
        name: 'q',
        description: 'Search query',
        in: 'query',
        required: true,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Response(
        response: 200,
        description: 'Search results',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: Roadbook::class, groups: ['roadbook:list']))
        )
    )]
    #[IsGranted('ROLE_USER')]
    public function search(Request $request): JsonResponse
    {
        $query = $request->query->get('q', '');
        $user = $this->getUser();

        if (empty($query)) {
            return $this->json(['error' => 'Search query is required'], Response::HTTP_BAD_REQUEST);
        }

        $roadbooks = $this->roadbookRepository->searchByTitle($query, $user);

        return $this->json($roadbooks, Response::HTTP_OK, [], [
            'groups' => ['roadbook:list']
        ]);
    }
}
