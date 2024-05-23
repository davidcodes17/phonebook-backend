import db from "../config/dbConfig";

export const checkUserExistence = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    return user;
  } else {
    return user;
  }
};

export default checkUserExistence;
