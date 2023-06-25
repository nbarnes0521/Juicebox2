const { Client } = require('pg') // imports the pg module

const client = new Client('postgres://localhost:5432/juicebox-dev');

/**
 * USER Methods
 */

 async function createUser({ username, password, name, location }) {
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password, name, location)
      VALUES($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, [username, password, name, location]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [user] } = await client.query(`
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT id, username, name, location, active
      FROM users;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id, username, name, location, active
      FROM users
      WHERE id=${userId};
    `);

    if (!user) {
      return null;
    }

    user.posts = await getPostsByUser(userId);

    return user;
  } catch (error) {
    throw error;
  }
}

async function createPost({ authorId, title, content }) {
  try {
    const { rows: [post] } = await client.query(`
      INSERT INTO posts("authorId", title, content)
      VALUES($1, $2, $3)
      RETURNING *;
    `, [authorId, title, content]);

    return post;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = {}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [post] } = await client.query(`
      UPDATE posts
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return post;
  } catch (error) {
    throw error;
  }
}

async function getAllPosts() {
  try {
    const { rows } = await client.query(`
      SELECT posts.id, posts.title, posts.content, posts.active, users.id as author_id, users.username, users.name, users.location, tags.id as tag_id, tags.name as tag_name
      FROM posts
      JOIN users ON posts."authorId" = users.id
      LEFT JOIN post_tags ON posts.id = post_tags."postId"
      LEFT JOIN tags ON post_tags."tagId" = tags.id;
    `);

    const posts = [];
    const postIds = new Set();

    for (const row of rows) {
      if (!postIds.has(row.id)) {
        postIds.add(row.id);
        const { id, title, content, active, author_id, username, name, location } = row;
        const post = { id, title, content, active, author: { id: author_id, username, name, location }, tags: [] };
        posts.push(post);
      }

      const { tag_id, tag_name } = row;

      if (tag_id) {
        posts[posts.length - 1].tags.push({ id: tag_id, name: tag_name });
      }
    }

    return posts;
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT posts.id, posts.title, posts.content, posts.active, users.id as author_id, users.username, users.name, users.location, tags.id as tag_id, tags.name as tag_name
      FROM posts
      JOIN users ON posts."authorId" = users.id
      LEFT JOIN post_tags ON posts.id = post_tags."postId"
      LEFT JOIN tags ON post_tags."tagId" = tags.id
      WHERE users.id=${userId};
    `);

    const posts = [];
    const postIds = new Set();

    for (const row of rows) {
      if (!postIds.has(row.id)) {
        postIds.add(row.id);
        const { id, title, content, active, author_id, username, name, location } = row;
        const post = { id, title, content, active, author: { id: author_id, username, name, location }, tags: [] };
        posts.push(post);
      }

      const { tag_id, tag_name } = row;

      if (tag_id) {
        posts[posts.length - 1].tags.push({ id: tag_id, name: tag_name });
      }
    }

    return posts;
  } catch (error) {
    throw error;
  }
}

async function getAllTags() {
    const client = new Client();
    await client.connect();
  
    try {
      const query = 'SELECT * FROM tags;';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    } finally {
      await client.end();
    }
  }
  

module.exports = {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getAllTags
};

  // npm run seed:dev (To run database)





// npm run start:dev