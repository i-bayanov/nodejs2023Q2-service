interface IAlbum {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

type TCreateAlbumDto = Omit<IAlbum, 'id'>;
type TUpdateAlbumDto = Omit<IAlbum, 'id'>;
