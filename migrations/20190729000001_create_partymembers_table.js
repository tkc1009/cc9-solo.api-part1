exports.up = function(knex, Promise) {
  return knex.schema.createTable("partymembers", (t) => {
    t.unique(["player_id", "party_member_id"]);

    t.integer("player_id").notNullable();
    t.foreign("player_id")
      .references("player_id")
      .inTable("players");

    t.increments("party_member_id").index();

    t.string("pokemon_id", 3).notNullable();

    t.string("pokemon_name", 15).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("partymembers");
};
