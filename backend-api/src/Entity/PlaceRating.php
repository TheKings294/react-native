<?php

namespace App\Entity;

use App\Repository\PlaceRatingRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PlaceRatingRepository::class)]
class PlaceRating
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $userId = null;

    #[ORM\Column]
    private ?int $placeId = null;

    #[ORM\Column]
    private ?int $overallRating = null;

    #[ORM\Column(nullable: true)]
    private ?int $atmosphereRating = null;

    #[ORM\Column(nullable: true)]
    private ?int $valueRating = null;

    #[ORM\Column(nullable: true)]
    private ?int $serviceRating = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $review = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?array $photos = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $visitDate = null;

    #[ORM\Column(options: ["default" => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

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

    public function getPlaceId(): ?int
    {
        return $this->placeId;
    }

    public function setPlaceId(int $placeId): static
    {
        $this->placeId = $placeId;

        return $this;
    }

    public function getOverallRating(): ?int
    {
        return $this->overallRating;
    }

    public function setOverallRating(int $overallRating): static
    {
        $this->overallRating = $overallRating;

        return $this;
    }

    public function getAtmosphereRating(): ?int
    {
        return $this->atmosphereRating;
    }

    public function setAtmosphereRating(?int $atmosphereRating): static
    {
        $this->atmosphereRating = $atmosphereRating;

        return $this;
    }

    public function getValueRating(): ?int
    {
        return $this->valueRating;
    }

    public function setValueRating(?int $valueRating): static
    {
        $this->valueRating = $valueRating;

        return $this;
    }

    public function getServiceRating(): ?int
    {
        return $this->serviceRating;
    }

    public function setServiceRating(?int $serviceRating): static
    {
        $this->serviceRating = $serviceRating;

        return $this;
    }

    public function getReview(): ?string
    {
        return $this->review;
    }

    public function setReview(?string $review): static
    {
        $this->review = $review;

        return $this;
    }

    public function getPhotos(): ?string
    {
        return $this->photos;
    }

    public function setPhotos(?string $photos): static
    {
        $this->photos = $photos;

        return $this;
    }

    public function getVisitDate(): ?\DateTime
    {
        return $this->visitDate;
    }

    public function setVisitDate(?\DateTime $visitDate): static
    {
        $this->visitDate = $visitDate;

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

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
