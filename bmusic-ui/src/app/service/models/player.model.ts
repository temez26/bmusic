export class PlayerModel {
  currentTitle: string | null = null;
  currentArtist: string | null = null;
  currentAlbumCover: string | null = null;
  //fordisplaying the time
  currentTime: string = '0:00';
  duration: string = '0:00';
  //for playback calculations
  audioCurrentTime: number = 0;
  audioDuration: number = 0;
  isShuffle: boolean = false;
  isRepeat: boolean = false;
  isPlaying: boolean = false;
  volumePercentage: number = 50;
}
