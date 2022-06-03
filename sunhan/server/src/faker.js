import faker from "faker";
import User from "./models/users";
import Post from "./models/posts";
import seoulDate from "./utils/seoulDate";

export const generateFakeData = async (userCount) => {
  if (typeof userCount !== "number" || userCount < 1)
    throw new Error("userCount must be a positive integer");

  const user = await User.findById("6257fd6bc6fffe228368a36c");
  const posts = [];

  console.log("Preparing fake data.");

  for (let i = 0; i < userCount; i++) {
    posts.push(
      new Post({
        content: faker.lorem.sentence(),
        writer: user,
        createAt: seoulDate(),
        updateAt: seoulDate(),
      })
    );
  }

  console.log("fake data inserting to database...");

  try {
    await Post.insertMany(posts);
    console.log(`${posts.length} fake posts generated!`);
  } catch (error) {
    console.error(error);
  }
};
