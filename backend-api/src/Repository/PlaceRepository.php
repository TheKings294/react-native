<?php

namespace App\Repository;

use App\Entity\Place;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Place>
 */
class PlaceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Place::class);
    }

    public function save(Place $place, bool $flush = false): void
    {
        $this->getEntityManager()->persist($place);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Place $place, bool $flush = false): void
    {
        $this->getEntityManager()->remove($place);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findByLocation(float $latitude, float $longitude, float $radius = 10): array
    {
        // Find places within a radius (in kilometers)
        $qb = $this->createQueryBuilder('p');

        return $qb
            ->where('(6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(p.latitude)))) <= :radius')
            ->setParameter('lat', $latitude)
            ->setParameter('lng', $longitude)
            ->setParameter('radius', $radius)
            ->getQuery()
            ->getResult();
    }

    public function findByPlaceType(string $placeType): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.placeType = :type')
            ->setParameter('type', $placeType)
            ->orderBy('p.averageRating', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByCity(string $city): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.city = :city')
            ->setParameter('city', $city)
            ->orderBy('p.averageRating', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
