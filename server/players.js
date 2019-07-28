const Player = function(dbPlayer) {
  this.playerId = dbPlayer.playerId;
  this.playerName = dbPlayer.playerName;
};

const validateNull = (object) => object !== null;

const validateId = (id) => typeof id === "number";

const validatePlayerName = (name) =>
  typeof name === "string" && name.replace(" ", "").length > 2;

module.exports.selectPlayer = ({ player }, knex) => {
  return knex("players")
    .select("player_id as playerId", "player_name as playerName")
    .where(player ? { player_id: player.playerId } : true)
    .then((players) => players.map((player) => new Player(player)))
    .catch((err) => {
      // sanitize known errors
      // TODO

      // throw unknown errors
      return Promise.reject(err);
    });
};

module.exports.insertPlayer = ({ player }, knex) => {
  if (!validateNull(player))
    return Promise.reject(new Error("Request data must be provided"));
  if (!validatePlayerName(player.playerName))
    return Promise.reject(
      new Error("PlayerName must be provided, and be at least 2 characters")
    );

  return knex("players")
    .insert({ player_name: player.playerName.toLowerCase() })
    .then(() => {
      return knex("players")
        .select("player_id as playerId", "player_name as playerName")
        .where({ player_name: player.playerName.toLowerCase() });
    })
    .then((players) => new Player(players.pop()))
    .catch((err) => {
      // sanitize known errors
      if (
        err.message.match("duplicate key value") ||
        err.message.match("UNIQUE constraint failed")
      )
        return Promise.reject(new Error("That player already exists"));

      // throw unknown errors
      return Promise.reject(err);
    });
};

module.exports.updatePlayer = ({ player }, knex) => {
  if (!validateNull(player))
    return Promise.reject(new Error("Request data must be provided"));
  if (!validateId(player.playerId))
    return Promise.reject(new Error("Id must be provided, and be a number"));
  if (!validatePlayerName(player.playerName))
    return Promise.reject(
      new Error("PlayerName must be provided, and be at least 2 characters")
    );

  return knex("players")
    .update({ player_name: player.playerName.toLowerCase() })
    .where({ player_id: player.playerId })
    .then(() => {
      return knex("players")
        .select("player_id as playerId", "player_name as playerName")
        .where({ player_id: player.playerId });
    })
    .then((players) => new Player(players.pop()))
    .catch((err) => {
      // sanitize known errors
      // TODO

      // throw unknown errors
      return Promise.reject(err);
    });
};

module.exports.deletePlayer = ({ player }, knex) => {
  if (!validateNull(player))
    return Promise.reject(new Error("Request data must be provided"));
  if (!validateId(player.playerId))
    return Promise.reject(new Error("Id must be provided, and be a number"));

  return knex("players")
    .delete()
    .where({ player_id: player.playerId })
    .then(() => {
      return knex("players")
        .select("player_id as playerId", "player_name as playerName")
        .where({ player_id: player.playerId });
    })
    .then((players) => players.length === 0)
    .catch((err) => {
      // sanitize known errors
      // TODO

      // throw unknown errors
      return Promise.reject(err);
    });
};
