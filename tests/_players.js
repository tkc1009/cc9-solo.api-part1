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
    describe("insertPlayer", () => {
      it("insertPlayer should return name of player", async () => {
        const res = await request.post("/graphql").send({
          query: `mutation {
          insertPlayer(player: { name: "red" }) {
            id
            name
          }
        }`,
        });
        temp.id = res.body.data.insertPlayer.id;
        const expected = {
          data: {
            insertPlayer: {
              id: temp.id,
              name: "red",
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
          updatePlayer(player: { id: ${temp.id}, name: "green"} ) {
            id
            name
          }
        }`,
        });
        const expected = {
          data: {
            updatePlayer: {
              id: temp.id,
              name: "green",
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
          deletePlayer(player: { id: ${temp.id}} )
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
