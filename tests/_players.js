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
  describe("Test For Players", () => {
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
    });
    describe("selectPlayer", () => {
      it("selectPlayer should return all Player", async () => {
        const res = await request.post("/graphql").send({
          query: `query {
            selectPlayer {
              playerId
              playerName
            }
          }`,
        });
        const expected = {
          data: {
            selectPlayer: [
              {
                playerId: temp.playerId1,
                playerName: "red",
              },
              {
                playerId: temp.playerId2,
                playerName: "green",
              },
            ],
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
      it("selectPlayer should return specific Player", async () => {
        const res = await request.post("/graphql").send({
          query: `query {
            selectPlayer(player: { playerId: ${temp.playerId1} }) {
              playerId
              playerName
            }
          }`,
        });
        const expected = {
          data: {
            selectPlayer: [
              {
                playerId: temp.playerId1,
                playerName: "red",
              },
            ],
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
    });
    describe("insertPlayer", () => {
      it("insertPlayer should return name of player", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
            insertPlayer(player: { playerName: "blue" }) {
              playerId
              playerName
            }
          }`,
        });
        temp.playerId = res.body.data.insertPlayer.playerId;
        const expected = {
          data: {
            insertPlayer: {
              playerId: temp.playerId,
              playerName: "blue",
            },
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
    });
    describe("updatePlayer", () => {
      it("updatePlayer should return id and name of player", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
            updatePlayer(player: { playerId: ${temp.playerId}, playerName: "yellow"} ) {
              playerId
              playerName
            }
          }`,
        });
        const expected = {
          data: {
            updatePlayer: {
              playerId: temp.playerId,
              playerName: "yellow",
            },
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
    });
    describe("deletePlayer", () => {
      it("deletePlayer should return true", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
            deletePlayer(player: { playerId: ${temp.playerId}} )
          }`,
        });
        const expected = {
          data: {
            deletePlayer: true,
          },
        };
        JSON.stringify(res.body).should.equal(JSON.stringify(expected));
      });
    });
  });
});
