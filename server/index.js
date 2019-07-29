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

// The schema should model the full data object available.

const schema = buildSchema(`
  type Player {
    playerId: Int
    playerName: String
  }
  input PlayerInput {
    playerId: Int = null
    playerName: String = null
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
    selectPlayer(player: PlayerInput = null): [Player]
    selectPartyMember(partyMember: PartyMemberInput = null): [PartyMember]
  }

  type Mutation {
    insertPlayer(player: PlayerInput = null): Player
    updatePlayer(player: PlayerInput = null): Player
    deletePlayer(player: PlayerInput = null): Boolean
    insertPartyMember(partyMember: PartyMemberInput = null): PartyMember
    updatePartyMember(partyMember: PartyMemberInput = null): PartyMember
    deletePartyMember(partyMember: PartyMemberInput = null): Boolean
  }
`);

// The root provides the resolver functions for each type of query or mutation.
const root = {
  selectPlayer: (request) => players.selectPlayer(request, knex),
  insertPlayer: (request) => players.insertPlayer(request, knex),
  updatePlayer: (request) => players.updatePlayer(request, knex),
  deletePlayer: (request) => players.deletePlayer(request, knex),
  selectPartyMember: (request) => partyMembers.selectPartyMember(request, knex),
  insertPartyMember: (request) =>
    partyMembers.insertPartyMember(request, knex, pokeapi),
  updatePartyMember: (request) =>
    partyMembers.updatePartyMember(request, knex, pokeapi),
  deletePartyMember: (request) => partyMembers.deletePartyMember(request, knex),
};

// Start your express server!
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.use(express.static("htdocs"));
app.get("/", (req, res) => res.sendFile("./index.html"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
});

module.exports = app;
