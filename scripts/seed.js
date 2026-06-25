import dotenv from "dotenv";
import mongoose from "mongoose";
import Posts from "../src/models/postModel.js";

dotenv.config();

const DB_CONN = process.env.DB_CONN;

if (!DB_CONN) {
  console.error("DB_CONN is not set in .env. Aborting seeding.");
  process.exit(1);
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeUsers(count = 40) {
  const names = [
    "alex",
    "sam",
    "jordan",
    "taylor",
    "morgan",
    "casey",
    "jamie",
    "riley",
    "dakota",
    "quinn",
    "devon",
    "kyle",
    "lee",
    "pat",
    "aria",
    "leo",
    "noah",
    "mia",
    "oliver",
    "ava",
    "sophia",
    "amelia",
    "isla",
    "lucas",
    "logan",
    "chris",
    "harper",
    "nora",
    "zane",
    "mina",
    "arya",
    "kai",
    "luca",
    "finn",
    "rose",
    "ivy",
    "omar",
    "seren",
    "mila",
    "kaiya"
  ];

  const users = [];
  for (let i = 0; i < count; i++) {
    const handle = `${randomFrom(names)}${Math.floor(Math.random() * 900 + 100)}`;
    users.push({
      username: handle,
      displayName: handle.charAt(0).toUpperCase() + handle.slice(1),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
    });
  }

  return users;
}

function makeImages(count = 40) {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push({
      filename: `image_${i + 1}.jpg`,
      contentType: "image/jpeg",
      length: Math.floor(Math.random() * 2000000) + 10000,
      uploadDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30))
    });
  }

  return images;
}

function makePosts(users, count = 50) {
  const sampleTexts = [
    "Loving the new features!",
    "Sunset by the lake was beautiful today.",
    "Can anyone recommend a good coffee spot?",
    "Throwback to last summer.",
    "Working on a side project—so excited to share soon.",
    "This recipe changed my life.",
    "Music recommendations please!",
    "Just finished a great book.",
    "Weekend vibes.",
    "Who else loves coding at 2am?",
    "Pet tax time!",
    "New blog post: tips for performance.",
    "Testing out the image upload feature.",
    "Learning something new every day.",
    "Happy to be here!",
    "City lights and late nights.",
    "Morning run done.",
    "Can't believe this view.",
    "Friday mood.",
    "Here's a quick tip: keep things simple.",
    "What should I build next?",
    "Grateful for the small things.",
    "Garden update: tomatoes are coming in!",
    "Celebrating a small win today.",
    "Designing a new UI mock.",
    "Coffee and code.",
    "Is remote work here to stay?",
    "Sharing a favorite recipe.",
    "Trying a new photo filter.",
    "Weekend getaway photos.",
    "Quick poll: cats or dogs?"
  ];

  const posts = [];
  for (let i = 0; i < count; i++) {
    const user = randomFrom(users);
    const imgChance = Math.random() < 0.5;
    posts.push({
      user: user.username,
      imgName: imgChance ? `image_${Math.floor(Math.random() * 40) + 1}.jpg` : "",
      text: randomFrom(sampleTexts),
      avatar: user.avatar,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 60))
    });
  }

  return posts;
}

async function run() {
  await mongoose.connect(DB_CONN, {});

  try {
    const users = makeUsers(40);
    const images = makeImages(40);
    const posts = makePosts(users, 50);

    // Clear collections
    await mongoose.connection.collection("users").deleteMany({});
    await mongoose.connection.collection("imagesMeta").deleteMany({});
    await Posts.deleteMany({});

    // Insert fixtures
    const usersResult = await mongoose.connection
      .collection("users")
      .insertMany(users);
    const imagesResult = await mongoose.connection
      .collection("imagesMeta")
      .insertMany(images);
    const postsResult = await Posts.insertMany(posts);

    console.log(`Inserted ${usersResult.insertedCount} users`);
    console.log(`Inserted ${imagesResult.insertedCount} images metadata`);
    console.log(`Inserted ${postsResult.length} posts`);
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Seeding complete. Disconnected.");
  }
}

run();
