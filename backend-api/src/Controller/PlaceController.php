<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Place;
use App\Repository\PlaceRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Nelmio\ApiDocBundle\Attribute\Model;
use OpenApi\Attributes as OA;

#[Route('/api/places', name: 'api_place_')]
class PlaceController extends AbstractController
{
    public function __construct(
        private PlaceRepository $placeRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/places',
        description: 'Returns a list of places. You can search by city, by place type, or by geographic coordinates + radius.',
        summary: 'List or search places',
        tags: ['Places'],
        parameters: [
            new OA\Parameter(
                name: 'page',
                description: 'Page number (pagination)',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer', default: 1, example: 1)
            ),
            new OA\Parameter(
                name: 'limit',
                description: 'Number of items per page',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer', default: 20, example: 20)
            ),
            new OA\Parameter(
                name: 'placeType',
                description: 'Filter by place type (example: bar, club)',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', example: 'bar')
            ),
            new OA\Parameter(
                name: 'city',
                description: 'Filter by city name',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', example: 'Paris')
            ),
            new OA\Parameter(
                name: 'latitude',
                description: 'Latitude for geolocation search',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'number', example: 48.8566)
            ),
            new OA\Parameter(
                name: 'longitude',
                description: 'Longitude for geolocation search',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'number', example: 2.3522)
            ),
            new OA\Parameter(
                name: 'radius',
                description: 'Search radius in kilometers (default: 10km)',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer', default: 10, example: 10)
            )
        ],
        responses: [
            new OA\Response(
                response: Response::HTTP_OK,
                description: 'Returns a list of places',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        ref: new Model(type: Place::class, groups: ['place:list'])
                    )
                )
            )
        ]
    )]
    public function list(Request $request): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 20);
        $placeType = $request->query->get('placeType');
        $city = $request->query->get('city');
        $latitude = $request->query->get('latitude');
        $longitude = $request->query->get('longitude');
        $radius = $request->query->getInt('radius', 10);

        if ($latitude && $longitude) {
            $places = $this->placeRepository->findByLocation(
                (float) $latitude,
                (float) $longitude,
                $radius
            );
        } elseif ($placeType) {
            $places = $this->placeRepository->findByPlaceType($placeType);
        } elseif ($city) {
            $places = $this->placeRepository->findByCity($city);
        } else {
            $places = $this->placeRepository->findBy(
                [],
                ['createdAt' => 'DESC'],
                $limit,
                ($page - 1) * $limit
            );
        }

        return $this->json($places, Response::HTTP_OK, [], ['groups' => 'place:list']);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    #[OA\Get(
        path: '/places/{id}',
        description: 'Returns detailed information about a place using its ID.',
        summary: 'Get a place by ID',
        tags: ['Places'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                description: 'ID of the place to retrieve',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Place found',
                content: new OA\JsonContent(
                    ref: new Model(type: Place::class, groups: ['place:read'])
                )
            ),
            new OA\Response(
                response: 404,
                description: 'The requested place does not exist',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Place not found')
                    ]
                )
            ),
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $place = $this->placeRepository->find($id);

        if (!$place) {
            return $this->json(['error' => 'Place not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($place, Response::HTTP_OK, [], ['groups' => 'place:read']);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[OA\Post(
        path: '/api/places',
        description: 'Creates a new place using the fields allowed in the serializer group `place:write`.',
        summary: 'Create a new place',
        requestBody: new OA\RequestBody(
            description: 'Place data to create',
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: Place::class, groups: ['place:write'])
            )
        ),
        tags: ['Places'],
        responses: [
            new OA\Response(
                response: Response::HTTP_CREATED,
                description: 'Place created successfully',
                content: new OA\JsonContent(
                    ref: new Model(type: Place::class, groups: ['place:read'])
                )
            ),
            new OA\Response(
                response: Response::HTTP_BAD_REQUEST,
                description: 'Validation errors or invalid request data',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'errors',
                            type: 'object',
                            example: [
                                'name' => 'This value should not be blank.',
                                'latitude' => 'This value should be a valid number.'
                            ],
                        ),
                        new OA\Property(
                            property: 'error',
                            type: 'string',
                            example: 'Invalid data: unexpected field'
                        )
                    ],
                    type: 'object',
                )
            )
        ]
    )]
    public function create(Request $request): JsonResponse
    {
        try {
            $place = $this->serializer->deserialize(
                $request->getContent(),
                Place::class,
                'json',
                ['groups' => 'place:write']
            );

            $errors = $this->validator->validate($place);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $this->placeRepository->save($place, true);

            return $this->json($place, Response::HTTP_CREATED, [], ['groups' => 'place:read']);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid data: ' . $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    #[OA\Put(
        path: '/api/places/{id}',
        description: 'Updates an existing place using the fields allowed in the serializer group `place:write`.',
        summary: 'Update an existing place',
        requestBody: new OA\RequestBody(
            description: 'Updated place data',
            required: true,
            content: new OA\JsonContent(
                ref: new Model(type: Place::class, groups: ['place:write'])
            )
        ),

        tags: ['Places'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                description: 'ID of the place to update',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 12)
            )
        ],
        responses: [
            new OA\Response(
                response: Response::HTTP_OK,
                description: 'Place updated successfully',
                content: new OA\JsonContent(
                    ref: new Model(type: Place::class, groups: ['place:read'])
                )
            ),
            new OA\Response(
                response: Response::HTTP_NOT_FOUND,
                description: 'Place not found',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'error',
                            type: 'string',
                            example: 'Place not found'
                        )
                    ],
                    type: 'object',
                )
            ),
            new OA\Response(
                response: Response::HTTP_BAD_REQUEST,
                description: 'Validation errors or invalid input',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'errors',
                            type: 'object',
                            example: [
                                'name' => 'This value should not be blank.',
                                'latitude' => 'This value should be a valid number.'
                            ]
                        ),
                        new OA\Property(
                            property: 'error',
                            type: 'string',
                            example: 'Invalid data: Unexpected field.'
                        )
                    ],
                    type: 'object',
                )
            )
        ]
    )]
    public function update(int $id, Request $request): JsonResponse
    {
        $place = $this->placeRepository->find($id);

        if (!$place) {
            return $this->json(['error' => 'Place not found'], Response::HTTP_NOT_FOUND);
        }

        try {
            $updatedPlace = $this->serializer->deserialize(
                $request->getContent(),
                Place::class,
                'json',
                ['object_to_populate' => $place, 'groups' => 'place:write']
            );

            $errors = $this->validator->validate($updatedPlace);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
            }

            $this->placeRepository->save($updatedPlace, true);

            return $this->json($updatedPlace, Response::HTTP_OK, [], ['groups' => 'place:read']);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid data: ' . $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[OA\Delete(
        path: '/api/places/{id}',
        description: 'Deletes an existing place by its ID.',
        summary: 'Delete a place',
        tags: ['Places'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                description: 'ID of the place to delete',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer', example: 42)
            )
        ],
        responses: [
            new OA\Response(
                response: Response::HTTP_OK,
                description: 'Place deleted successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'message',
                            type: 'string',
                            example: 'Place deleted successfully'
                        )
                    ],
                    type: 'object',
                )
            ),
            new OA\Response(
                response: Response::HTTP_NOT_FOUND,
                description: 'Place not found',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'error',
                            type: 'string',
                            example: 'Place not found'
                        )
                    ],
                    type: 'object',
                )
            )
        ]
    )]
    public function delete(int $id): JsonResponse
    {
        $place = $this->placeRepository->find($id);

        if (!$place) {
            return $this->json(['error' => 'Place not found'], Response::HTTP_NOT_FOUND);
        }

        $this->placeRepository->remove($place, true);

        return $this->json(['message' => 'Place deleted successfully'], Response::HTTP_OK);
    }

    #[Route('/search', name: 'search', methods: ['GET'])]
    #[OA\Get(
        path: '/api/places/search',
        description: 'Searches for places by name, description, or city. Returns up to 50 results ordered by rating.',
        summary: 'Search places',
        tags: ['Places'],
        parameters: [
            new OA\Parameter(
                name: 'q',
                description: 'Search text (partial match). Example: bar, club, paris...',
                in: 'query',
                required: true,
                schema: new OA\Schema(type: 'string', example: 'cocktail')
            )
        ],
        responses: [
            new OA\Response(
                response: Response::HTTP_OK,
                description: 'Search results for matching places',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        ref: new Model(type: Place::class, groups: ['place:list'])
                    )
                )
            ),
            new OA\Response(
                response: Response::HTTP_BAD_REQUEST,
                description: 'Missing search query',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'error',
                            type: 'string',
                            example: 'Search query is required'
                        )
                    ],
                    type: 'object',
                )
            )
        ]
    )]
    public function search(Request $request): JsonResponse
    {
        $query = $request->query->get('q', '');

        if (empty($query)) {
            return $this->json(['error' => 'Search query is required'], Response::HTTP_BAD_REQUEST);
        }

        $qb = $this->placeRepository->createQueryBuilder('p');
        $places = $qb
            ->where('LOWER(p.name) LIKE LOWER(:query)')
            ->orWhere('LOWER(p.description) LIKE LOWER(:query)')
            ->orWhere('LOWER(p.city) LIKE LOWER(:query)')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('p.averageRating', 'DESC')
            ->setMaxResults(50)
            ->getQuery()
            ->getResult();

        return $this->json($places, Response::HTTP_OK, [], ['groups' => 'place:list']);
    }
}
