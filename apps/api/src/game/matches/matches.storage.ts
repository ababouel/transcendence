import { Match } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Game } from './match-game.interface';
import { WebsocketService } from '@src/websocket/websocket.service';
import { GameOverData, ServerGameEvents, State } from '@transcendence/db';

@Injectable()
export class MatchesStorage {
  games: Game[] = [];

  constructor(private readonly websocketService: WebsocketService) {}

  private createGame(match: Match): Game {
    const game = new Game(this.websocketService, match);
    game.setGameService();
    this.games.push(game);
    return game;
  }

  findGame(matchId: number): Game | undefined {
    return this.games.find((game) => game.match.matchId === matchId);
  }

  connectPlayer(match: Match, userId: number) {
    let game = this.findGame(match.matchId);
    if (!game) {
      game = this.createGame(match);
    }
    game.users.push(userId);
    if (
      game.state === State.WAITING &&
      game.users.find((id) => id === match.homeId) &&
      game.users.find((id) => id === match.adversaryId)
    ) {
      game.state = State.PLAYING;

      // start game simulation
      game.gameService.startgame(match);
    }
  }

  removePlayer(disconnectedUserId: number) {
    const game = this.games.find((g) => g.users.includes(disconnectedUserId));
    if (!game) return;

    game.gameService.stopGame(disconnectedUserId);
    this.games = this.games.filter(
      (g) => g.match.matchId !== game.match.matchId,
    );
  }

  isUserInGame(userId: number) {
    const game = this.games.find((g) => g.users.includes(userId));
    return !!game;
  }
}
