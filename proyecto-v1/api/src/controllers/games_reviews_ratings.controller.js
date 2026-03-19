const Database = require('#database')

const index = async (req, res) => {
    try {
    const [results] = await Database.query(
      'SELECT * FROM `games_reviews_ratings`'
    );
  
    return res.send({data: results, error: null})
  } catch (err) {
    return res.status(400).send({data: null, error: 'Error al consultar la DB: ' + err});
  }
}

module.exports = {
    index
}