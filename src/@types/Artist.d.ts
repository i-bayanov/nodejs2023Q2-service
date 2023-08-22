interface IArtist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

type TCreateArtistDto = Omit<IArtist, 'id'>;
type TUpdateArtistDto = Omit<IArtist, 'id'>;
