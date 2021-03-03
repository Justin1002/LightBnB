const { Pool } = require('pg')

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

module.exports = {
  query: (text, params) => {
    const start = Date.now();
    return pool.query(text, params)
      .then(res => {
        console.log('executed query', text, `\n${(Date.now() - start)}ms`)
        return res;
      })
      .catch(err => {
        console.error('failed query', `\n${(Date.now() - start)}ms`)
        return err;
      })
  }
}