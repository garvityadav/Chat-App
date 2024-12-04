import prisma from "../config/prisma";

const main = async () => {
  try {
    //testing creating user
    const user = await prisma.user.create({
      data: {
        username: "test",
        email: "test@example.com",
        password: "secure123",
      },
    });
    console.log("User created", user);

    //test retrieve user collection
    const users = await prisma.user.findMany();
    console.log("List of users:\n", users);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
