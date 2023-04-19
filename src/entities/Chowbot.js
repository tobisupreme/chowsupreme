const GAME_STATES = {
  IN_PROGRESS: 'in_progress',
  WAITING: 'waiting',
};

class SessionEvent {
  constructor({ eventName, message, data }) {
    this.data = data;
    this.eventName = eventName;
    this.message = message;
  }
}

class BotSession {
  constructor({ io }) {
    this.events = [];
    this.socket = io;
  }

  createChatSession({ message, data, eventName }) {
    const event = new SessionEvent({ message, data, eventName });
    this.events.push(event);
    return event;
  }

  emitEvent(event) {
    this.socket.emit(event.eventName, event);
  }

  emitGameEvent({ message, data, eventName }) {
    const event = this.createChatSession({ message, data, eventName });
    this.emitEvent(event);
  }

  join({ event, socket }) {
    if (this.state === GAME_STATES.IN_PROGRESS) {
      this.emitGameEvent({
        message: `Game is in progress, try again in ${this.timer.secondsLeft()} seconds`,
        eventName: 'join_error',
      });
    }

    if (!event.data.name || !event.data.name.trim().length) {
      this.emitGameEvent({
        message: `Must provide a name`,
        eventName: 'join_error',
      });
    }

    if (this.state === GAME_STATES.WAITING) {
      const player = new Player({ name: event.data.name, id: socket.id });
      this.playersIndex[socket.id] = player;

      if (!this.gameMaster) {
        player.setGameMaster(true);
        this.gameMaster = player;
      }

      this.players.push(player);
      this.emitGameEvent({
        message: `${player.name} just joined`,
        data: {
          player,
          gameMaster: this.gameMaster,
        },
        eventName: 'player_joined',
      });
    }
  }

  start() {

  }

  exit({ socket }) {
    this.players = this.players.filter((pl) => pl.id !== socket.id);
  }
}

module.exports = BotSession;
