export class PlayerModel {
  currentSongId: number | null = null;
  currentTitle: string | null = null;
  currentArtist: string | null = null;
  currentAlbumCover: string = '';
  formattedCurrentTime: string = '0:00';
  duration: string = '0:00';
  currentTime: number = 0;
  audioDuration: number = 0;
  isShuffle: boolean = false;
  isRepeat: boolean = false;
  isPlaying: boolean = false;
  volumePercentage: number = 50;
}
