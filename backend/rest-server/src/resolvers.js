//import { Author, View } from './connectors';
const db = require('./db/index.js');
const resolvers = {
  Query: {
    user(_, args) {
      const { username } = args;
      return (async () => { 
        try{
          let data = await db.query('select * from Users where username=?' , [username]);
          return data[0]
        } catch(err) {
          console.log(err)
        }
      })()
    },
    allBets(_, args) {
      return (async () => {
        try{
          let data = await db.query('select * from Bets');
          return data
        } catch(err) {
          console.log(err)
        }
      })()
    },
    allUsers(_, args) {
      return (async () => {
        try{
          let data = await db.query('select * from Users')
          return data
        } catch(err) {
          console.log(err)
        }
      })()
    }
  },
  Mutation: {
    addBet(_, args) {
      console.log(args)
      return (async() => {
        try {
          const {description, wager, creator, club} = args
          await db.query('insert into Bets (description, wager, creator, club) values (?,?,?,?)', [description, wager, creator, club])
          return args
        } catch(err) {
          console.log(err);
        }
      })()
    }
  },
  User: {
    bets(user) {
      return (async () => { 
        try{
          let bets = await db.query('select * from Bets where creator=?', [user.id]);
          return bets
        } catch(err) {
          console.log(err)
        }
      })()
    }
  },
  Bet: {
    user(creator) {
      return (async () => { 
        try{
          let bets = await db.query('select * from Users where id=?', [creator.id]);
          return bets
        } catch(err) {
          console.log(err)
        }
      })()
    }
  }
  
};

export default resolvers;