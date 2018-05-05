const db = require('./db/index.js');
const testResolvers = {
  User: {
    bets(user) {
      return (async () => { 
        console.log('fuck yeah babababababab')
        try{
          let bets = await db.query('select * from Bets where creator=?', [user.id]);
          return bets
        } catch(err) {
          console.log(err)
        }
      })()
    }
  }
};

export default testResolvers;