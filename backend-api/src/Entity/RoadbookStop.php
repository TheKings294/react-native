<?php

namespace App\Entity;

use App\Repository\RoadbookStopRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RoadbookStopRepository::class)]
class RoadbookStop
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[ORM\ManyToOne(targetEntity: Roadbook::class, inversedBy: 'roadbookPlace')]
    #[ORM\JoinColumn(nullable: false)]
    private ?int $roadbookId = null;

    #[ORM\Column(nullable: true)]
    #[ORM\ManyToOne(targetEntity: Place::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?int $placeId = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $customLocation = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $arrivalDate = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $departureDate = null;

    #[ORM\Column]
    private ?int $dayNumber = null;

    #[ORM\Column]
    private ?int $orderIndex = null;

    #[ORM\Column(length: 255)]
    private ?string $content = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?array $photos = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $mood = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $weather = null;

    #[ORM\Column(nullable: true)]
    private ?float $temperature = null;

    #[ORM\Column(nullable: true)]
    private ?float $expenses = null;

    #[ORM\Column(options: ["default" => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getPlaceId(): ?int
    {
        return $this->placeId;
    }

    public function setPlaceId(?int $placeId): static
    {
        $this->placeId = $placeId;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCustomLocation(): ?string
    {
        return $this->customLocation;
    }

    public function setCustomLocation(?string $customLocation): static
    {
        $this->customLocation = $customLocation;

        return $this;
    }

    public function getArrivalDate(): ?\DateTime
    {
        return $this->arrivalDate;
    }

    public function setArrivalDate(?\DateTime $arrivalDate): static
    {
        $this->arrivalDate = $arrivalDate;

        return $this;
    }

    public function getDepartureDate(): ?\DateTime
    {
        return $this->departureDate;
    }

    public function setDepartureDate(?\DateTime $departureDate): static
    {
        $this->departureDate = $departureDate;

        return $this;
    }

    public function getDayNumber(): ?int
    {
        return $this->dayNumber;
    }

    public function setDayNumber(int $dayNumber): static
    {
        $this->dayNumber = $dayNumber;

        return $this;
    }

    public function getOrderIndex(): ?int
    {
        return $this->orderIndex;
    }

    public function setOrderIndex(int $orderIndex): static
    {
        $this->orderIndex = $orderIndex;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

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

    public function getMood(): ?string
    {
        return $this->mood;
    }

    public function setMood(?string $mood): static
    {
        $this->mood = $mood;

        return $this;
    }

    public function getWeather(): ?string
    {
        return $this->weather;
    }

    public function setWeather(?string $weather): static
    {
        $this->weather = $weather;

        return $this;
    }

    public function getTemperature(): ?float
    {
        return $this->temperature;
    }

    public function setTemperature(?float $temperature): static
    {
        $this->temperature = $temperature;

        return $this;
    }

    public function getExpenses(): ?float
    {
        return $this->expenses;
    }

    public function setExpenses(?float $expenses): static
    {
        $this->expenses = $expenses;

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
