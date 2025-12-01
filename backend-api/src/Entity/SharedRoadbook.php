<?php

namespace App\Entity;

use App\Repository\SharedRoadbookRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SharedRoadbookRepository::class)]
class SharedRoadbook
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[ORM\ManyToOne(targetEntity: Roadbook::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?int $roadbookId = null;

    #[ORM\Column]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'sharedWith')]
    #[ORM\JoinColumn(nullable: false)]
    private ?int $sharedWithUserId = null;

    #[ORM\Column]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'sharedBy')]
    #[ORM\JoinColumn(nullable: false)]
    private ?int $sharedByUserId = null;

    #[ORM\Column(options: ["default" => false])]
    private ?bool $canEdit = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $message = null;

    #[ORM\Column(options: ["default" => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $createdAt = null;

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

    public function getSharedWithUserId(): ?int
    {
        return $this->sharedWithUserId;
    }

    public function setSharedWithUserId(int $sharedWithUserId): static
    {
        $this->sharedWithUserId = $sharedWithUserId;

        return $this;
    }

    public function getSharedByUserId(): ?int
    {
        return $this->sharedByUserId;
    }

    public function setSharedByUserId(int $sharedByUserId): static
    {
        $this->sharedByUserId = $sharedByUserId;

        return $this;
    }

    public function isCanEdit(): ?bool
    {
        return $this->canEdit;
    }

    public function setCanEdit(bool $canEdit): static
    {
        $this->canEdit = $canEdit;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;

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
