const Player = function(dbPlayer) {
  this.id = dbPlayer.id;
  this.name = dbPlayer.name;
};

const validateNull = (object) => object !== null;

const validateId = (id) => typeof id === "number";

const validatePlayerName = (name) =>
  typeof name === "string" && name.replace(" ", "").length > 2;

module.exports.insertPlayer = ({ player }, knex) => {
  if (!validateNull(player))
    return Promise.reject(new Error("Request data must be provided"));
  if (!validatePlayerName(player.name))
    return Promise.reject(
      new Error("PlayerName must be provided, and be at least 2 characters")
    );

  return knex("players")
    .insert({ player_name: player.name.toLowerCase() })
    .then(() => {
      return knex("players")
        .select("player_id as id", "player_name as name")
        .where({ player_name: player.name.toLowerCase() });
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
  if (!validateId(player.id))
    return Promise.reject(new Error("Id must be provided, and be a number"));
  if (!validatePlayerName(player.name))
    return Promise.reject(
      new Error("PlayerName must be provided, and be at least 2 characters")
    );

  return knex("players")
    .update({ player_name: player.name.toLowerCase() })
    .where({ player_id: player.id })
    .then(() => {
      return knex("players")
        .select("player_id as id", "player_name as name")
        .where({ player_id: player.id });
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
  if (!validateId(player.id))
    return Promise.reject(new Error("Id must be provided, and be a number"));

  return knex("players")
    .delete()
    .where({ player_id: player.id })
    .then(() => {
      return knex("players")
        .select("player_id as id", "player_name as name")
        .where({ player_id: player.id });
    })
    .then((players) => players.length === 0)
    .catch((err) => {
      // sanitize known errors
      // TODO

      // throw unknown errors
      return Promise.reject(err);
    });
};
