interface Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

type TCreateArtistDto = Omit<Artist, 'id'>;
type TUpdateArtistDto = Omit<Artist, 'id'>;
