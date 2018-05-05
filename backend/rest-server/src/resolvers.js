//import { Author, View } from './connectors';
const db = require('./db/index.js');
const resolvers = {
  Query: {
    user(_, args) {
      const { username } = args;
      return (async () => { 
        try{
          let data = await db.query('select * from Users where username=?' , [username]);
          let bets = await db.query('select * from Bets where creator=?', [data[0]["id"]]);
          data[0]['bets'] = bets
          console.log('here is data', data[0]);
          //data[0]
          return data[0]
        } catch(err) {
          console.log(err)
        }
      })()
    },
    allUsers(_, args) {
      return (async () => {
        try{
          let data = await db.query('select * from User')
          console.log('here is data', data);
          return JSON.stringify(data)
        } catch(err) {
          console.log(err)
        }
      })()
    }
  },
  // User: {
  //   posts(author) {
  //     return author.getPosts();
  //   }
  // },
  // Bet: {
  //   author(post) {
  //     return post.getAuthor();
  //   },
  //   views(post) {
  //     return View.findOne({ postId: post.id }).then(view => view.views);
  //   }
  // }
};

export default resolvers;