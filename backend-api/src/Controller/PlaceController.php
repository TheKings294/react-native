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

#[Route('/api/places', name: 'api_place_')]
class PlaceController extends AbstractController
{
    public function __construct(
        private PlaceRepository $placeRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
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
    public function show(int $id): JsonResponse
    {
        $place = $this->placeRepository->find($id);

        if (!$place) {
            return $this->json(['error' => 'Place not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($place, Response::HTTP_OK, [], ['groups' => 'place:read']);
    }

    #[Route('', name: 'create', methods: ['POST'])]
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
