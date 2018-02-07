const sql = require('sqlite');

module.exports.execute = async(req, res) => {
  const query = decodeURI(req.query.name);

  try{
    if(!query.length >= 2) throw { status: 403, message: 'Query must be 2 or more characters.' };
  
    const col = 'REPLACE(REPLACE(REPLACE(khName, \'(\', \'\'), \')\', \'\'), "\'", \'\')';
    const rows = await sql.all(
      `SELECT khID, khName FROM kamihime WHERE ${col} LIKE ? LIMIT 10`,
      sanitiseQuery(query)
    );
    res
      .status(200)
      .json(rows);
  }
  catch (err) {
    if(!isNaN(err.status))
      res
        .status(err.status)
        .json({ error: err.message });
    else
      res
        .status(500)
        .json({ error: err.message });
  }
};

function sanitiseQuery(query) {
  if(!/^[aeiou]/i.test(query) && query.length > 4)
    return `%${query
      .replace(/'/g, '\'\'')
      .replace(/[aeiou]/gi, '_')
    }%`;
  return `${query.replace(/'/g, '\'\'')}%`;
}