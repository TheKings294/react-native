<?php

namespace App\Entity;

use App\Repository\RoadbookRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RoadbookRepository::class)]
class Roadbook
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?int $id = null;

    #[ORM\Column]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'roadbooks')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?int $userId = null;

    #[ORM\Column(length: 255)]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?string $coverImage = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?\DateTimeImmutable $startDate = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?\DateTimeImmutable $endDate = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?array $countries = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?array $tags = null;

    #[ORM\Column(options: ["default" => false])]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?bool $isPublished = null;

    #[ORM\Column(options: ["default" => false])]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?bool $isPublic = null;

    #[ORM\Column(type: 'BookTemplate', length: 255, options: ["default" => 'SIMPLE'])]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?string $template = null;

    #[ORM\Column(length: 255, nullable: true, options: ["default" => 'default'])]
    #[Groups(['roadbook:list', 'roadbook:read', 'roadbook:create'])]
    private ?string $theme = null;

    #[ORM\Column(options: ["default" => 'CURRENT_TIMESTAMP'])]
    #[Groups(['roadbook:list', 'roadbook:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['roadbook:list', 'roadbook:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['roadbook:read'])]
    private ?\DateTimeImmutable $publishedAt = null;

    #[ORM\Column(options: ["default" => 0])]
    #[Groups(['roadbook:list', 'roadbook:read'])]
    private ?int $viewCount = null;

    #[ORM\Column(options: ["default" => 0])]
    #[Groups(['roadbook:list', 'roadbook:read'])]
    private ?int $favoriteCount = null;

    #[ORM\OneToMany(targetEntity: RoadbookStop::class, mappedBy: 'roadbookPlace')]
    private Collection $roadBooksStops;

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

    public function getCoverImage(): ?string
    {
        return $this->coverImage;
    }

    public function setCoverImage(?string $coverImage): static
    {
        $this->coverImage = $coverImage;

        return $this;
    }

    public function getStartDate(): ?\DateTimeImmutable
    {
        return $this->startDate;
    }

    public function setStartDate(?\DateTimeImmutable $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeImmutable
    {
        return $this->endDate;
    }

    public function setEndDate(?\DateTimeImmutable $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getCountries(): ?array
    {
        return $this->countries;
    }

    public function setCountries(?array $countries): static
    {
        $this->countries = $countries;

        return $this;
    }

    public function getTags(): ?array
    {
        return $this->tags;
    }

    public function setTags(?array $tags): static
    {
        $this->tags = $tags;

        return $this;
    }

    public function isPublished(): ?bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): static
    {
        $this->isPublished = $isPublished;

        return $this;
    }

    public function isPublic(): ?bool
    {
        return $this->isPublic;
    }

    public function setIsPublic(bool $isPublic): static
    {
        $this->isPublic = $isPublic;

        return $this;
    }

    public function getTemplate(): ?string
    {
        return $this->template;
    }

    public function setTemplate(string $template): static
    {
        $this->template = $template;

        return $this;
    }

    public function getTheme(): ?string
    {
        return $this->theme;
    }

    public function setTheme(?string $theme): static
    {
        $this->theme = $theme;

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

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(?\DateTimeImmutable $publishedAt): static
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    public function getViewCount(): ?int
    {
        return $this->viewCount;
    }

    public function setViewCount(int $viewCount): static
    {
        $this->viewCount = $viewCount;

        return $this;
    }

    public function getFavoriteCount(): ?int
    {
        return $this->favoriteCount;
    }

    public function setFavoriteCount(int $favoriteCount): static
    {
        $this->favoriteCount = $favoriteCount;

        return $this;
    }
}
