exports.up = function(knex, Promise) {
  return knex.schema.createTable("players", (t) => {
    t.increments("player_id").index();

    t.string("player_name", 15)
      .unique()
      .notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("players");
};
