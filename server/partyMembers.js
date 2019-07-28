const PartyMember = function(dbPartyMember) {
  this.playerId = dbPartyMember.playerId;
  this.partyMemberId = dbPartyMember.partyMemberId;
  this.pokemonId = dbPartyMember.pokemonId;
  this.pokemonName = dbPartyMember.pokemonName;
};

const validateNull = (object) => object !== null;

const validateId = (id) => typeof id === "number";

module.exports.selectPartyMember = ({ partyMember }, knex) => {
  return knex("partymembers")
    .select(
      "player_id as playerId",
      "party_member_id as partyMemberId",
      "pokemon_id as pokemonId",
      "pokemon_name as pokemonName"
    )
    .where(partyMember ? { player_id: partyMember.playerId } : true)
    .then((partyMembers) =>
      partyMembers.map((partyMember) => new PartyMember(partyMember))
    )
    .catch((err) => {
      // sanitize known errors
      // TODO

      // throw unknown errors
      return Promise.reject(err);
    });
};

module.exports.insertPartyMember = ({ partyMember }, knex, pokeapi) => {
  if (!validateNull(partyMember))
    return Promise.reject(new Error("Request data must be provided"));
  if (
    !validateNull(partyMember.pokemonId) &&
    !validateNull(partyMember.pokemonName)
  )
    return Promise.reject(new Error("Pokemon Id or Name must be provided"));
  if (!validateId(partyMember.playerId))
    return Promise.reject(new Error("Id must be provided, and be a number"));

  return pokeapi
    .get(`/pokemon/?limit=964`)
    .then((res) => res.data)
    .then((pokemons) => {
      const gotPokemon = pokemons.results.find(
        (pokemon) =>
          pokemon.url
            .slice(34)
            .replace("/", "")
            .padStart(3, "0") === partyMember.pokemonId ||
          pokemon.name === partyMember.pokemonName
      );
      return knex("partymembers")
        .insert({
          player_id: partyMember.playerId,
          pokemon_id: gotPokemon.url
            .slice(34)
            .replace("/", "")
            .padStart(3, "0"),
          pokemon_name: gotPokemon.name,
        })
        .then(() => {
          return knex("partymembers")
            .select(
              "player_id as playerId",
              "party_member_id as partyMemberId",
              "pokemon_id as pokemonId",
              "pokemon_name as pokemonName"
            )
            .where({
              player_id: partyMember.playerId,
              pokemon_id: gotPokemon.url
                .slice(34)
                .replace("/", "")
                .padStart(3, "0"),
            })
            .orWhere({
              player_id: partyMember.playerId,
              pokemon_name: gotPokemon.name,
            });
        })
        .then((partyMembers) => new PartyMember(partyMembers.pop()))
        .catch((err) => {
          // sanitize known errors
          // TODO

          // throw unknown errors
          return Promise.reject(err);
        });
    });
};

module.exports.updatePartyMember = ({ partyMember }, knex, pokeapi) => {
  if (!validateNull(partyMember))
    return Promise.reject(new Error("Request data must be provided"));
  if (
    !validateNull(partyMember.pokemonId) &&
    !validateNull(partyMember.pokemonName)
  )
    return Promise.reject(new Error("Pokemon Id or Name must be provided"));
  if (!validateId(partyMember.playerId))
    return Promise.reject(new Error("Id must be provided, and be a number"));
  if (!validateId(partyMember.partyMemberId))
    return Promise.reject(new Error("Id must be provided, and be a number"));

  return pokeapi
    .get(`/pokemon/?limit=964`)
    .then((res) => res.data)
    .then((pokemons) => {
      const gotPokemon = pokemons.results.find(
        (pokemon) =>
          pokemon.url
            .slice(34)
            .replace("/", "")
            .padStart(3, "0") === partyMember.pokemonId ||
          pokemon.name === partyMember.pokemonName
      );
      return knex("partymembers")
        .update({
          pokemon_id: gotPokemon.url
            .slice(34)
            .replace("/", "")
            .padStart(3, "0"),
          pokemon_name: gotPokemon.name,
        })
        .where({
          player_id: partyMember.playerId,
          party_member_id: partyMember.partyMemberId,
        })
        .then(() => {
          return knex("partymembers")
            .select(
              "player_id as playerId",
              "party_member_id as partyMemberId",
              "pokemon_id as pokemonId",
              "pokemon_name as pokemonName"
            )
            .where({
              player_id: partyMember.playerId,
              party_member_id: partyMember.partyMemberId,
            });
        })
        .then((partyMembers) => new PartyMember(partyMembers.pop()))
        .catch((err) => {
          // sanitize known errors
          // TODO

          // throw unknown errors
          return Promise.reject(err);
        });
    });
};

module.exports.deletePartyMember = ({ partyMember }, knex) => {
  if (!validateNull(partyMember))
    return Promise.reject(new Error("Request data must be provided"));
  if (!validateId(partyMember.playerId))
    return Promise.reject(new Error("Id must be provided, and be a number"));
  if (!validateId(partyMember.partyMemberId))
    return Promise.reject(new Error("Id must be provided, and be a number"));

  return knex("partymembers")
    .delete()
    .where({
      player_id: partyMember.playerId,
      party_member_id: partyMember.partyMemberId,
    })
    .then(() => {
      return knex("partymembers")
        .select(
          "player_id as playerId",
          "party_member_id as partyMemberId",
          "pokemon_id as pokemonId",
          "pokemon_name as pokemonName"
        )
        .where({
          player_id: partyMember.playerId,
          party_member_id: partyMember.partyMemberId,
        });
    })
    .then((partyMembers) => partyMembers.length === 0)
    .catch((err) => {
      // sanitize known errors
      // TODO

      // throw unknown errors
      return Promise.reject(err);
    });
};
