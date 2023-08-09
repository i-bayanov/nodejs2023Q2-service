interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

type TCreateTrackDto = Omit<Track, 'id'>;
type TUpdateTrackDto = Omit<Track, 'id'>;
