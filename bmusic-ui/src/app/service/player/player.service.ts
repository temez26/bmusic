import { Injectable } from '@angular/core';
import { PlayerModel } from '../models/player.class';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  player: PlayerModel = new PlayerModel();

  constructor() {}
}
