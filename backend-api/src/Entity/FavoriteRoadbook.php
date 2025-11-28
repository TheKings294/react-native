<?php

namespace App\Entity;

use App\Repository\FavoriteRoadbookRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FavoriteRoadbookRepository::class)]
class FavoriteRoadbook
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'favoriteRoadbooks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?int $userId = null;

    #[ORM\Column]
    #[ORM\ManyToOne(targetEntity: Roadbook::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?int $roadbookId = null;

    #[ORM\Column(options: ["default" => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getRoadbookId(): ?int
    {
        return $this->roadbookId;
    }

    public function setRoadbookId(int $roadbookId): static
    {
        $this->roadbookId = $roadbookId;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
