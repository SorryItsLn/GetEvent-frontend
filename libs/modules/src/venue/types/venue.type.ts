export type Venue = { id: string; name: string; address: string; city: string };

export type CreateVenueRequest = { name: string; address: string; city: string };

export type CreateVenueResponse = string;

export type UpdateVenueRequest = { name: string; address: string; city: string };

export type UpdateVenueResponse = string;

export type GetVenueByIdResponse = Venue | null;

export type GetAllVenuesResponse = Venue[];
