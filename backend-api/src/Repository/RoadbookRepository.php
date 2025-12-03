<?php

namespace App\Repository;

use App\Entity\Roadbook;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\User;

/**
 * @extends ServiceEntityRepository<Roadbook>
 */
class RoadbookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Roadbook::class);
    }

    public function save(Roadbook $roadbook, bool $flush = false): void
    {
        $this->getEntityManager()->persist($roadbook);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Roadbook $roadbook, bool $flush = false): void
    {
        $this->getEntityManager()->remove($roadbook);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Find all roadbooks by user
     */
    public function findByUser(User $user): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.userId = :user')
            ->setParameter('user', $user->getId())
            ->orderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find roadbook by id and user
     */
    public function findOneByIdAndUser(int $id, User $user): ?Roadbook
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.id = :id')
            ->andWhere('r.user = :user')
            ->setParameter('id', $id)
            ->setParameter('user', $user)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Search roadbooks by title
     */
    public function searchByTitle(string $query, User $user): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.title LIKE :query')
            ->andWhere('r.user = :user')
            ->setParameter('query', '%' . $query . '%')
            ->setParameter('user', $user)
            ->orderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
