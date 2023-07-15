const {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  // Tags
  createTags,
  createPostTag,
  addTagsToPost,
  getPostById,
  
  
  
  getAllTags
} = require('./index');

  
    // DROPPING TABLES
  async function dropTables() {
    try {
      console.log("Starting to drop tables...");
  
      await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
      `);
  
      console.log("Finished dropping tables!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
  }
  
    // CREATING TABLES
  async function createTables() {
    try {
      console.log("Starting to build tables...");
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL,
          name varchar(255) NOT NULL,
          location varchar(255) NOT NULL,
          active boolean DEFAULT true
        );
        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          "authorId" INTEGER REFERENCES users(id),
          title varchar(255) NOT NULL,
          content TEXT NOT NULL,
          active BOOLEAN DEFAULT true
        );
        CREATE TABLE tags (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL
        );
        CREATE TABLE post_tags (
          "postId" INTEGER REFERENCES posts(id),
          "tagId" INTEGER REFERENCES tags(id),
          UNIQUE ("postId", "tagId")
        );
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
  }
  
  // CREATING INITIAL USERS
  async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
  
      await createUser({ 
        username: 'albert', 
        password: 'bertie99',
        name: 'Al Bert',
        location: 'Sidney, Australia' 
      });
      await createUser({ 
        username: 'sandra', 
        password: '2sandy4me',
        name: 'Just Sandra',
        location: 'Ain\'t tellin\''
      });
      await createUser({ 
        username: 'glamgal',
        password: 'soglam',
        name: 'Joshua',
        location: 'Upper East Side'
      });
  
      console.log("Finished creating users!");
    } catch (error) {
      console.error("Error creating users!");
      throw error;
    }
  }

      // CREATING INITIAL POSTS
      async function createInitialPosts() {
        try {
          const [albert, sandra, glamgal] = await getAllUsers();
      
          console.log("Starting to create posts...");
          await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
            tags: ["#happy", "#youcandoanything"]
          });
      
          await createPost({
            authorId: sandra.id,
            title: "How does this work?",
            content: "Seriously, does this even do anything?",
            tags: ["#happy", "#worst-day-ever"]
          });
      
          await createPost({
            authorId: glamgal.id,
            title: "Living the Glam Life",
            content: "Do you even? I swear that half of you are posing.",
            tags: ["#happy", "#youcandoanything", "#canmandoeverything"]
          });
          console.log("Finished creating posts!");
        } catch (error) {
          console.log("Error creating posts!");
          throw error;
        }
      }

  // async function createTags(tagList) {
  //   if (tagList.length === 0) {
  //     return;
  //   }
  
  //   const insertValues = tagList.map((_, index) => `($${index + 1})`).join(', ');
  
  //   const selectValues = tagList.map(
  //     (_, index) => `$${index + 1}`).join(', ');

  //   try {
  //     await client.query(
  //       `INSERT INTO tags(name)
  //        VALUES ${insertValues}
  //        ON CONFLICT (name) DO NOTHING`,
  //       tagList
  //     );
  
  //     const { rows } = await client.query(
  //       `SELECT * FROM tags
  //        WHERE name IN (${tagList.map((_, index) => `$${index + 1}`).join(', ')})`,
  //       tagList
  //     );
  
  //     return rows;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //   // CREATING INITIAL TAGS // REMOVED PURPOSEFULLY ///////
  // async function createInitialTags() {
  //   try {
  //     console.log("Starting to create tags...");
  
  //     const [happy, sad, inspo, catman] = await createTags([
  //       '#happy',
  //       '#worst-day-ever',
  //       '#youcandoanything',
  //       '#catmandoeverything'
  //     ]);
  
  //     const [postOne, postTwo, postThree] = await getAllPosts();
  
  //     await addTagsToPost(postOne.id, [happy, inspo]);
  //     await addTagsToPost(postTwo.id, [sad, inspo]);
  //     await addTagsToPost(postThree.id, [happy, catman, inspo]);
  
  //     console.log("Finished creating tags!");
  //   } catch (error) {
  //     console.log("Error creating tags!");
  //     throw error;
  //   }
  // }
  

   // REBUILD !!! /////
   async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialPosts();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    }
  }
  
  
  
  async function testDB() {
    try {
      // console.log("Starting to test database...");
  
      // console.log("Calling getAllUsers");
      // const users = await getAllUsers();
      // console.log("Result:", users);
  
      // console.log("Calling updateUser on users[0]");
      // const updateUserResult = await updateUser(users[0].id, {
      //   name: "Newname Sogood",
      //   location: "Lesterville, KY"
      // });
      // console.log("Result:", updateUserResult);
  
      console.log("Calling getAllPosts");
      const posts = await getAllPosts(); // HERE
      console.log("Result:", posts);

      // console.log("Calling getPostsByUser");
      // const userId = 1;
      
      // try {
      //   const posts = await getPostsByUser(userId);
      //   console.log("Result:", posts);
      // } catch (error) {
      //   console.error("Error:", error);
      // }      
  
      // console.log("Calling updatePost on posts[0]");
      // const updatePostResult = await updatePost(posts[0].id, {
      //   title: "New Title",
      //   content: "Updated Content"
      // });
      // console.log("Result:", updatePostResult);
  
      // console.log("Calling getUserById with 1");
      // const albert = await getUserById(1);
      // console.log("Result:", albert);

      // console.log("Calling getPostById with 1 ");
      // const alPost = await getPostById(1);
      // console.log("Result:", alPost)

      // console.log("Calling getAllTags!!!!!!!!!");
      // const tagsHere = await getAllTags();
      // console.log("Result:", tagsHere)

      // console.log("Calling getPostById with 2");
      // const sanPost = await getPostById(2);
      // console.log("Result:", sanPost)
  
      // console.log("HELLO, HERE ARE TAGS");
      // const tagsHere = await getAllTags();
      // console.log("Result:", tagsHere)
      
      console.log("Calling updatePost on posts[1], only updating tags");
      const updatePostTagsResult = await updatePost(posts[1].id, {
        tags: ["#youcandoanything", "#redfish", "#bluefish"]
      });
      console.log("Result:", updatePostTagsResult);
  
      
  // END OF TEST ///
      console.log("Finished database tests! End of CODE");
    } catch (error) {
      console.log("Error during testDB");
      throw error;
    }
    
  }
  
  
  rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
  
  
  // To Revert back to last commit: git reset --hard HEAD
  