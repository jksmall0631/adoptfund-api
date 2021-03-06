exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function(table) {
            table.increments('id').primary();
            table.string('firstName');
            table.string('lastName');
            table.string('email');
            table.string('password');

            table.timestamps();
        }),
        knex.schema.createTable('family', function(table){
          table.increments('id').primary();
          table.string('expiration');
          table.string('location');
          table.string('name');
          table.string('title');
          table.text('story');
          table.string('links');
          table.string('image');
          table.integer('amountFunded')
          table.integer('cost')
            table.integer('userId')
                 .references('id')
                 .inTable('users');
        }),
        knex.schema.createTable('donation', function(table){
          table.increments('id').primary();
          table.integer('donationAmount');
          table.string('firstName')
          table.string('lastName')
          table.string('email')
            table.integer('familyId')
                 .references('id')
                 .inTable('family');

          table.timestamps();

        }),
        knex.schema.createTable('comments', function(table){
            table.increments('id').primary();
            table.string('body');
            table.integer('userId')
                 .references('id')
                 .inTable('users');
            table.integer('familyId')
                 .references('id')
                 .inTable('family');

            table.timestamps();
        }),
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('comments'),
      knex.schema.dropTable('donation'),
      knex.schema.dropTable('family'),
      knex.schema.dropTable('users')
    ])
};
