import { db } from "@utils/fb-admin";
import { User } from "@utils/types";

export const createUser = async (user: User) => {
  const { id, firstName, lastName, username } = user;

  const ref = db.collection("users").doc(`${id}`);
  const doc = await ref.get();

  if (!doc.exists) {
    const userInfo = {
      id,
      firstName,
      lastName,
      username,
      chatSession: false,
    };

    await ref.set(userInfo);
  }
};
