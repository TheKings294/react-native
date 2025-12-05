import {Place} from "@/model/Place";

export type RoadBook = {
  id: number;
  userId?: number;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  coverImageURL?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  countries?: string[];
  tags?: string[];
  isPublished?: boolean;
  isPublic?: boolean;
  template?: string | null;
  theme?: string | string[] | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  viewCount?: number;
  favoriteCount?: number;
  places: Place[];
}

export type RoadBookFormData = {
  title: string;
  description?: string;
  coverImage?: string;
  startDate?: Date;
  endDate?: Date;
  countries: string[];
  tags: string[];
  isPublished: boolean;
  isPublic: boolean;
  template: string;
  theme: string;
};
