<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 320, unique: true)]
    private ?string $email = null;

    #[ORM\Column(type: 'json')]
    private ?array $roles = null;

    #[ORM\Column(length: 255)]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $displayName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $avatar = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $bio = null;

    #[ORM\Column(length: 255)]
    private ?string $passwordHash = null;

    #[ORM\Column(options: ['default' => "CURRENT_TIMESTAMP"])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $lastLoginAt = null;

    #[ORM\Column(options: ['default' => true])]
    private ?bool $isProfilePublic = null;

    #[ORM\OneToMany(targetEntity: FavoritePlace::class, mappedBy: 'favoritesPlaces')]
    private Collection $favoritePlaces;

    #[ORM\OneToMany(targetEntity: Follow::class, mappedBy: 'follower')]
    private Collection $following;

    #[ORM\OneToMany(targetEntity: Follow::class, mappedBy: 'following')]
    private Collection $followers;

    #[ORM\OneToMany(targetEntity: Roadbook::class, mappedBy: 'roadbooks')]
    private Collection $roadBooks;

    #[ORM\OneToMany(targetEntity: FavoriteRoadbook::class, mappedBy: 'favoriteRoadbooks')]
    private Collection $favoriteRoadbooks;

    #[ORM\OneToMany(targetEntity: PlaceRating::class, mappedBy: 'rater')]
    private Collection $placesRated;

    #[ORM\OneToMany(targetEntity: Tip::class, mappedBy: 'tips')]
    private Collection $tips;

    #[ORM\OneToMany(targetEntity: TipVote::class, mappedBy: 'tipsVotes')]
    private Collection $tipsVoted;

    #[ORM\OneToMany(targetEntity: SharedRoadbook::class, mappedBy: 'sharedBy')]
    private Collection $roadBooksShared;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }
    public function setRoles(?array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getDisplayName(): ?string
    {
        return $this->displayName;
    }

    public function setDisplayName(?string $displayName): static
    {
        $this->displayName = $displayName;

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->passwordHash;
    }

    public function setPasswordHash(string $passwordHash): static
    {
        $this->passwordHash = $passwordHash;

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

    public function getLastLoginAt(): ?\DateTimeImmutable
    {
        return $this->lastLoginAt;
    }

    public function setLastLoginAt(?\DateTimeImmutable $lastLoginAt): static
    {
        $this->lastLoginAt = $lastLoginAt;

        return $this;
    }

    public function isProfilePublic(): ?bool
    {
        return $this->isProfilePublic;
    }

    public function setIsProfilePublic(bool $isProfilePublic): static
    {
        $this->isProfilePublic = $isProfilePublic;

        return $this;
    }

    public function eraseCredentials(): void
    {

    }
}
