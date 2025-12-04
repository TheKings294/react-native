import {useLocalSearchParams} from "expo-router";
import type { RoadBook } from "@/model/RaodBook";
import { RoadBookCard } from "@/components/roadbook"

function reviveRoadBook(json: any): RoadBook {
    return {
        ...json,
        startDate: new Date(json.startDate),
        endDate: new Date(json.endDate),
        createdAt: new Date(json.createdAt),
        updatedAt: new Date(json.updatedAt),
        places: json.places ?? [], // if nested, you can revive deeper
    };
}

export default function RoadBookScreen() {
    const { data } = useLocalSearchParams()
    const dataString = Array.isArray(data) ? data[0] : data;
    const rawObject = JSON.parse(decodeURIComponent(dataString));
    const rb: RoadBook = reviveRoadBook(rawObject);

    return (
        <>
            <RoadBookCard roadBook={rb} />
        </>
    )
}