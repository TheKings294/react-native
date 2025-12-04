import {Place} from "@/model/Place";

export type RoadBook = {
    id: number;
    userId: number;
    title: string;
    description: string;
    coverImageURL: string;
    startDate: Date;
    endDate: Date;
    countries: string[];
    tags: string[];
    isPublished: boolean;
    isPublic: boolean;
    theme: string[];
    createdAt: Date;
    updatedAt: Date;
    viewCount: number;
    favoriteCount: number;
    places: Place[];
}