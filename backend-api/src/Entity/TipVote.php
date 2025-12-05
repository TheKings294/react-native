<?php

namespace App\Entity;

use App\Repository\TipVoteRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TipVoteRepository::class)]
class TipVote
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'tipsVotes')]
    private ?int $userId = null;

    #[ORM\Column]
    #[ORM\ManyToOne(targetEntity: Tip::class)]
    private ?int $tipId = null;

    #[ORM\Column(type: 'VoteType',length: 255)]
    private ?string $voteType = null;

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

    public function getTipId(): ?int
    {
        return $this->tipId;
    }

    public function setTipId(int $tipId): static
    {
        $this->tipId = $tipId;

        return $this;
    }

    public function getVoteType(): ?string
    {
        return $this->voteType;
    }

    public function setVoteType(string $voteType): static
    {
        $this->voteType = $voteType;

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
