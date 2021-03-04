const properties = require('./json/properties.json');
const users = require('./json/users.json');
const db = require('./db/index.js')

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
  const query = `SELECT * 
  FROM  users
  WHERE email = $1`
  const value = [email || 'null']
  return db.query(query, value)
  .then (res => res.rows[0])
  .catch (err => console.error('query error', err.stack));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const query = `SELECT *
  FROM users
  WHERE id = $1`
  const value = [id || 'null']
  return db.query(query, value) 
  .then (res => res.rows[0])
  .catch(err => console.error('query error', err.stack));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  const query = `INSERT into users(name,email,password)
  VALUES($1, $2, $3)
  RETURNING *`
  const values = [user.name, user.email, user.password]
  return db.query(query,values)
  .then (res => res.rows[0])
  .catch(err => console.error('query error', err.stack));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  const query = `SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  LEFT JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`
  const values = [guest_id,limit]
  return db.query(query,values)
  .then (res => res.rows)
  .catch(err => console.error('query error', err.stack));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
//  return pool.query(`
//  SELECT * FROM properties
//  LIMIT $1`, [limit])
//  .then(res => res.rows);
const queryParams = [];
let query = `SELECT properties.*, avg(property_reviews.rating) as average_rating
FROM properties
LEFT JOIN property_reviews ON properties.id = property_id
`
if (options.city) {
  queryParams.push(`%${options.city}%`);
  query += `WHERE city LIKE $${queryParams.length}`;
}

if (options.owner_id) {
  queryParams.push(`${options.owner_id}`);
  if (queryParams.length > 1) {
    query += ` AND owner_id = $${queryParams.length}`;
  }
  else {
  query += `WHERE owner_id = $${queryParams.length}`;
  }
}

if (options.minimum_price_per_night) {
  queryParams.push(Number(options.minimum_price_per_night) * 100);

  if (queryParams.length > 1) {
    query += ` AND cost_per_night >= $${queryParams.length}`;
  }
  else {
    query += `WHERE cost_per_night >= $${queryParams.length}`;
  }
}

if (options.maximum_price_per_night) {
  queryParams.push(Number(options.maximum_price_per_night) * 100);

  if (queryParams.length > 1) {
    query += ` AND cost_per_night <= $${queryParams.length}`;
  }
  else {
    query += `WHERE cost_per_night <= $${queryParams.length}`;
  }
}

query += ` GROUP BY properties.id`;

if (options.minimum_rating) {
  queryParams.push(Number(options.minimum_rating));
  query += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
}

queryParams.push(limit);
query += `
ORDER BY cost_per_night
LIMIT $${queryParams.length}`;

console.log(query, queryParams);

return db.query(query,queryParams)
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack));

}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
  const query = `INSERT into properties(owner_id,title,description,thumbnail_photo_url,cover_photo_url,cost_per_night,street,city,province,post_code,country,parking_spaces,number_of_bathrooms,number_of_bedrooms)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
  RETURNING *;`
  const values = [property.owner_id,property.title,property.description,property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night * 100, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms]
  return db.query(query, values)
    .then(res => res.rows[0])
    .catch(err => console.error('query error', err.stack));
}
exports.addProperty = addProperty;

const addReservation = function(reservation) {
  const query = `INSERT INTO reservations(start_date,end_date,property_id,guest_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`
  
  const values = [reservation.start_date, reservation.end_date, reservation.property_id, reservation.guest_id];

  return db.query(query,values)
    .then(res => res.rows[0])
    .catch(err => console.error('query error', err.stack));
};
exports.addReservation = addReservation;
