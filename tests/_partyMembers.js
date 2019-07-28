const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();
const app = require("../server/index");

describe("AI Pokemon Battle API Server", () => {
  let request;
  const temp = {};
  beforeEach(() => {
    request = chai.request(app);
  });
  describe("Test For PartyMembers", () => {
    describe("set up", () => {
      it("set up name of Player", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
          insertPlayer(player: {id: null, name: "red"}) {
            id
            name
          }
        }`,
        });
        temp.playerId = res.body.data.insertPlayer.id;
        const expected = {
          data: {
            insertPlayer: {
              id: temp.playerId,
              name: "red",
            },
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
    });
    describe("insertPartyMember", () => {
      it("insertPartyMember should return PartyMember", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
          insertPartyMember(partyMember: { playerId: ${temp.playerId}, pokemonId: "121" }) {
            playerId
            partyMemberId
            pokemonId
            pokemonName
          }
        }`,
        });
        temp.partyMemberId = res.body.data.insertPartyMember.partyMemberId;
        const expected = {
          data: {
            insertPartyMember: {
              playerId: temp.playerId,
              partyMemberId: temp.partyMemberId,
              pokemonId: "121",
              pokemonName: "starmie",
            },
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
    });
    describe("updatePartyMember", () => {
      it("updatePartyMember should return PartyMember", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
          updatePartyMember(partyMember: { playerId: ${temp.playerId}, partyMemberId: ${temp.partyMemberId}, pokemonName: "mew" }) {
            playerId
            partyMemberId
            pokemonId
            pokemonName
          }
        }`,
        });
        const expected = {
          data: {
            updatePartyMember: {
              playerId: temp.playerId,
              partyMemberId: temp.partyMemberId,
              pokemonId: "151",
              pokemonName: "mew",
            },
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
    });
    describe("deletePartyMember", () => {
      it("deletePartyMember should return true", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
          deletePartyMember(partyMember: { playerId: ${temp.playerId}, partyMemberId: ${temp.partyMemberId}})
        }`,
        });
        const expected = {
          data: {
            deletePartyMember: true,
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
    });
  });
});
