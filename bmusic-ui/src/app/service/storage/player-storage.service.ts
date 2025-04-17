import { Injectable } from '@angular/core';
import { PlayerModel } from '../../service';

@Injectable({
  providedIn: 'root',
})
export class PlayerStorageService {
  savePlayerState(player: PlayerModel) {
    const playerState = JSON.stringify(player);
    sessionStorage.setItem('playerState', playerState);
  }

  loadPlayerState(): PlayerModel {
    const playerState = sessionStorage.getItem('playerState');
    if (playerState) {
      return JSON.parse(playerState) as PlayerModel;
    }
    return new PlayerModel();
  }
}
