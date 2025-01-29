export class Playlist {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public songIds: number[],
    public createdBy: number,
    public creationDate: string
  ) {}

  addSong(songId: number): void {
    if (!this.songIds.includes(songId)) {
      this.songIds.push(songId);
    }
  }

  removeSong(songId: number): void {
    this.songIds = this.songIds.filter((id) => id !== songId);
  }
}
