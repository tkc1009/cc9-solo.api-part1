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
      it("set up 2 Player 1/2", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
            insertPlayer(player: { playerName: "red" }) {
              playerId
              playerName
            }
          }`,
        });
        temp.playerId1 = res.body.data.insertPlayer.playerId;
        const expected = {
          data: {
            insertPlayer: {
              playerId: temp.playerId1,
              playerName: "red",
            },
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
      it("set up 2 Player 2/2", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
            insertPlayer(player: { playerName: "green" }) {
              playerId
              playerName
            }
          }`,
        });
        temp.playerId2 = res.body.data.insertPlayer.playerId;
        const expected = {
          data: {
            insertPlayer: {
              playerId: temp.playerId2,
              playerName: "green",
            },
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
      it("set up 2 PartyMember 1/2", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
            insertPartyMember(partyMember: { playerId: ${temp.playerId1}, pokemonId: "106" }) {
              playerId
              partyMemberId
              pokemonId
              pokemonName
            }
          }`,
        });
        temp.partyMemberId1 = res.body.data.insertPartyMember.partyMemberId;
        const expected = {
          data: {
            insertPartyMember: {
              playerId: temp.playerId1,
              partyMemberId: temp.partyMemberId1,
              pokemonId: "106",
              pokemonName: "hitmonlee",
            },
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
      it("set up 2 PartyMember 2/2", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
            insertPartyMember(partyMember: { playerId: ${temp.playerId2}, pokemonName: "hitmonchan" }) {
              playerId
              partyMemberId
              pokemonId
              pokemonName
            }
          }`,
        });
        temp.partyMemberId2 = res.body.data.insertPartyMember.partyMemberId;
        const expected = {
          data: {
            insertPartyMember: {
              playerId: temp.playerId2,
              partyMemberId: temp.partyMemberId2,
              pokemonId: "107",
              pokemonName: "hitmonchan",
            },
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
    });
    describe("selectPartyMember", () => {
      it("selectPartyMember should return all PartyMember", async () => {
        const res = await request.post("/graphql").send({
          query: `query {
            selectPartyMember {
              playerId
              partyMemberId
              pokemonId
              pokemonName
            }
          }`,
        });
        const expected = {
          data: {
            selectPartyMember: [
              {
                playerId: temp.playerId1,
                partyMemberId: temp.partyMemberId1,
                pokemonId: "106",
                pokemonName: "hitmonlee",
              },
              {
                playerId: temp.playerId2,
                partyMemberId: temp.partyMemberId2,
                pokemonId: "107",
                pokemonName: "hitmonchan",
              },
            ],
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
      it("selectPartyMember should return specific PartyMember", async () => {
        const res = await request.post("/graphql").send({
          query: `query {
            selectPartyMember(partyMember: { playerId: ${temp.playerId1} }) {
              playerId
              partyMemberId
              pokemonId
              pokemonName
            }
          }`,
        });
        const expected = {
          data: {
            selectPartyMember: [
              {
                playerId: temp.playerId1,
                partyMemberId: temp.partyMemberId1,
                pokemonId: "106",
                pokemonName: "hitmonlee",
              },
            ],
          },
        };
        console.log();
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
    });
    describe("insertPartyMember", () => {
      it("insertPartyMember should return PartyMember", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
            insertPartyMember(partyMember: { playerId: ${temp.playerId1}, pokemonId: "121" }) {
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
              playerId: temp.playerId1,
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
            updatePartyMember(partyMember: { playerId: ${temp.playerId1}, partyMemberId: ${temp.partyMemberId}, pokemonName: "mew" }) {
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
              playerId: temp.playerId1,
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
            deletePartyMember(partyMember: { playerId: ${temp.playerId1}, partyMemberId: ${temp.partyMemberId}})
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
