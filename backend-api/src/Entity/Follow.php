<?php

namespace App\Entity;

use App\Repository\FollowRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FollowRepository::class)]
class Follow
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $followerId = null;

    #[ORM\Column]
    private ?int $followingId = null;

    #[ORM\Column(options: ['default' => "CURRENT_TIMESTAMP"])]
    private ?\DateTimeImmutable $createdAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFollowerId(): ?int
    {
        return $this->followerId;
    }

    public function setFollowerId(int $followerId): static
    {
        $this->followerId = $followerId;

        return $this;
    }

    public function getFollowingId(): ?int
    {
        return $this->followingId;
    }

    public function setFollowingId(int $followingId): static
    {
        $this->followingId = $followingId;

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
