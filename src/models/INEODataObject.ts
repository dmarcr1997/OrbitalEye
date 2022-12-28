export interface NEODataObject {
    id: number;
    name: string;
    link: string;
    velocity: number;
    bounty: number;
    missDistance: number;
    diameter: number;
    closestApproachDate: string;
    absoluteMagnitude: number;
    hazardous: boolean;
    sentry: boolean;
    semiMajorAxis?: number;
    eccentricity?: number;
    aphelion?: number;
    perihelion?: number;
};