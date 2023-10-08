import { Server, Socket } from 'socket.io';
import { MatchesService } from '@src/game/matches/matches.service';
import { Match } from '@prisma/client';
import { GameData, State, User } from '@src/game/gameplay/gameData';
import { GamePlayService } from '@src/game/gameplay/gameplay.service';

//table of games
export class Game {
  state: State;
  server: Server;
  matchesService: MatchesService;
  matchId: number;
  users: User[];
  gameData: GameData;

  constructor(server: Server, matchesService: MatchesService, matchId: number) {
    this.state = State.WAITING;
    this.server = server;
    this.matchesService = matchesService;
    this.matchId = matchId;
    this.users = [];
    this.gameData = new GameData();
  }
}

export class GamesCollection {
  games: Game[] = [];

  constructor(
    private readonly server: Server,
    private readonly matchesService: MatchesService,
    private readonly gamePlayService: GamePlayService,
  ) {}

  private createGame(matchId: number): Game {
    const game = new Game(this.server, this.matchesService, matchId);
    this.games.push(game);
    return game;
  }

  private findGame(matchId: number): Game | undefined {
    return this.games.find((game) => game.matchId === matchId);
  }

  connectPlayer(match: Match, userId: number, client: Socket) {
    this.removePlayer(client);
    let game = this.findGame(match.matchId);
    if (!game) {
      game = this.createGame(match.matchId);
    }
    game.users.push({
      id: userId,
      socketId: client.id,
    });
    client.join(match.matchId.toString());
    if (
      game.state === State.WAITING &&
      game.users.find((user) => user.id === match.homeId) &&
      game.users.find((user) => user.id === match.adversaryId)
    ) {
      game.state = State.PLAYING;

      // start game simulation
      this.gamePlayService.startgame();
    }
  }

  removePlayer(client: Socket) {
    this.games.forEach((game) => {
      const user = game.users.find((user) => user.socketId === client.id);
      if (user) {
        game.users = game.users.filter((user) => user.socketId !== client.id);
      }
      client.leave(game.matchId.toString());
      if (game.users.length === 0 && game.state !== State.PLAYING) {
        this.games = this.games.filter((game) => game.matchId !== game.matchId);
      }
    });
  }
}
