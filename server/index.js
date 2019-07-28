const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const config = require("../config");
const knex = require("knex")(config.db);
const axios = require("axios");
const pokeapi = axios.create(config.pokeapi);

// The objects include each specific functions.
const players = require("./players");
const partyMembers = require("./partyMembers");

// The data below is mocked.
const data = require("./data");

// The schema should model the full data object available.

const schema = buildSchema(`
  type Weight {
    minimum: String
    maximum: String
  }

  type Height {
    minimum: String
    maximum: String
  }

  type EvolutionRequirements {
    amount: Int
    name: String
  }

  type PokemonIdAndName {
    id: Int
    name: String
  }

  type Attack {
    name: String
    type: String
    damage: Int
  }

  type Attacks {
    fast: [Attack]
    special: [Attack]
  }

  type PokemonsByAttack {
    name: String
    type: String
    damage: Int
    pokemons: [Pokemon]
  }

  type Pokemon {
    id: String
    name: String
    classification: String
    types: [String]
    resistant: [String]
    weaknesses: [String]
    weight: Weight
    height: Height
    fleeRate: Float
    evolutionRequirements: EvolutionRequirements
    evolutions: [PokemonIdAndName]
    maxCP: Int
    maxHP: Int
    attacks: Attacks
  }

  input WeightInput {
    minimum: String
    maximum: String
  }

  input HeightInput {
    minimum: String
    maximum: String
  }

  input EvolutionRequirementsInput {
    amount: Int
    name: String
  }

  input PokemonIdAndNameInput {
    id: Int
    name: String
  }

  input AttackInput {
    name: String
    type: String
    damage: Int
  }

  input AttacksInput {
    fast: [AttackInput]
    special: [AttackInput]
  }

  input PokemonInput {
    id: String
    name: String
    classification: String
    types: [String]
    resistant: [String]
    weaknesses: [String]
    weight: WeightInput
    height: HeightInput
    fleeRate: Float
    evolutionRequirements: EvolutionRequirementsInput
    evolutions: [PokemonIdAndNameInput]
    maxCP: Int
    maxHP: Int
    attacks: AttacksInput
  }

  type Player {
    id: Int
    name: String
  }
  input PlayerInput {
    id: Int = null
    name: String = null
  }

  type PartyMember {
    playerId: Int
    partyMemberId: Int
    pokemonId: String
    pokemonName: String
  }
  input PartyMemberInput {
    playerId: Int = null
    partyMemberId: Int = null
    pokemonId: String = null
    pokemonName: String = null
  }

  type Query {
    Pokemons(id: String = null, name: String = null): [Pokemon]
    Attacks(type: String = null): [Attack]
    PokemonsByType(type: String = null): [Pokemon]
    PokemonsByAttack(name: String = null): PokemonsByAttack
  }

  type Mutation {
    insertPlayer(player: PlayerInput = null): Player
    updatePlayer(player: PlayerInput = null): Player
    deletePlayer(player: PlayerInput = null): Boolean
    insertPartyMember(partyMember: PartyMemberInput = null): PartyMember
    updatePartyMember(partyMember: PartyMemberInput = null): PartyMember
    deletePartyMember(partyMember: PartyMemberInput = null): Boolean
    createPokemon(pokemon: PokemonInput = null): [Pokemon]
    updatePokemon(target: String = null, pokemon: PokemonInput = null): [Pokemon]
    deletePokemon(target: String = null): Boolean
    createType(type: String = null): [String]
    updateType(target: String = null, type: String = null): [String]
    deleteType(target: String = null): Boolean
    createAttack(category: String = null, attack: AttackInput = null): Attacks
    updateAttack(target: String = null, attack: AttackInput = null): Attacks
    deleteAttack(target: String = null): Boolean
  }
`);

// The root provides the resolver functions for each type of query or mutation.
const root = {
  insertPlayer: (request) => players.insertPlayer(request, knex),
  updatePlayer: (request) => players.updatePlayer(request, knex),
  deletePlayer: (request) => players.deletePlayer(request, knex),
  insertPartyMember: (request) =>
    partyMembers.insertPartyMember(request, knex, pokeapi),
  updatePartyMember: (request) =>
    partyMembers.updatePartyMember(request, knex, pokeapi),
  deletePartyMember: (request) => partyMembers.deletePartyMember(request, knex),
  Pokemons: ({ id, name }) => {
    return data.pokemon.filter(
      (pokemon) =>
        pokemon.name === name ||
        pokemon.id === id ||
        (name === null && id === null)
    );
  },
  Attacks: ({ type }) => {
    return data.attacks.fast
      .concat(data.attacks.special)
      .filter((attack) => attack.type === type || type === null);
  },
  PokemonsByType: ({ type }) => {
    return data.pokemon.filter((pokemon) => pokemon.types.includes(type));
  },
  PokemonsByAttack: ({ name }) => {
    const optedAttack = data.attacks.fast
      .concat(data.attacks.special)
      .find((attack) => attack.name === name);
    const optedPokemons = data.pokemon.filter((pokemon) =>
      pokemon.attacks.fast
        .concat(pokemon.attacks.special)
        .map((attack) => attack.name)
        .includes(name)
    );
    return { ...optedAttack, pokemons: optedPokemons };
  },
  createPokemon: ({ pokemon }) => {
    data.pokemon.push(pokemon);
    return data.pokemon;
  },
  updatePokemon: ({ target, pokemon }) => {
    const optedPokemon = data.pokemon.find((pokemon) => pokemon.id === target);
    Object.assign(optedPokemon, pokemon);
    return data.pokemon;
  },
  deletePokemon: ({ target }) => {
    const optedPokemon = data.pokemon.find((pokemon) => pokemon.id === target);
    if (optedPokemon === undefined) return false;
    data.pokemon.splice(data.pokemon.indexOf(optedPokemon), 1);
    return true;
  },
  createType: ({ type }) => {
    data.types.push(type);
    return data.types;
  },
  updateType: ({ target, type }) => {
    data.types[data.types.indexOf(target)] = type;
    return data.types;
  },
  deleteType: ({ target }) => {
    const index = data.types.indexOf(target);
    if (index === -1) return false;
    data.types.splice(index, 1);
    return true;
  },
  createAttack: ({ category, attack }) => {
    data.attacks[category].push(attack);
    return data.attacks;
  },
  updateAttack: ({ target, attack }) => {
    const queriedAttack = data.attacks.fast
      .concat(data.attacks.special)
      .find((attack) => attack.name === target);
    Object.assign(queriedAttack, attack);
    return data.attacks;
  },
  deleteAttack: ({ target }) => {
    const optedFastAttack = data.attacks.fast.find(
      (attack) => attack.name === target
    );
    const optedSpecialAttack = data.attacks.special.find(
      (attack) => attack.name === target
    );
    const optedFastindex = data.attacks.fast.indexOf(optedFastAttack);
    const optedSpecialindex = data.attacks.special.indexOf(optedSpecialAttack);
    if (optedFastindex === -1 && optedSpecialindex === -1) return false;
    if (optedFastindex !== -1) data.attacks.fast.splice(optedFastindex, 1);
    if (optedSpecialindex !== -1)
      data.attacks.special.splice(optedSpecialindex, 1);
    return true;
  },
};

// Start your express server!
const app = express();

/*
  The only endpoint for your server is `/graphql`- if you are fetching a resource, 
  you will need to POST your query to that endpoint. Suggestion: check out Apollo-Fetch
  or Apollo-Client. Note below where the schema and resolvers are connected. Setting graphiql
  to 'true' gives you an in-browser explorer to test your queries.
*/
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
});

module.exports = app;
