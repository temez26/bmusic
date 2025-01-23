import { Injectable } from '@angular/core';
import { PlayerModel } from '../service/models/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  player: PlayerModel = new PlayerModel();

  constructor() {}
}
