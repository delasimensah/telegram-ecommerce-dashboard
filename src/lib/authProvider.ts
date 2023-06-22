import { AuthBindings } from "@refinedev/core";
import nookies from "nookies";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase/config";

const mockUsers = [
  {
    name: "John Doe",
    email: "johndoe@mail.com",
    roles: ["admin"],
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Jane Doe",
    email: "janedoe@mail.com",
    roles: ["editor"],
    avatar: "https://i.pravatar.cc/150?img=1",
  },
];

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    const token = await user.getIdToken();

    if (token) {
      nookies.set(null, "token", JSON.stringify(token), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    await signOut(auth);
    nookies.destroy(null, "token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async (ctx: any) => {
    const cookies = nookies.get(ctx);

    if (cookies["token"]) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    // const auth = nookies.get()["token"];
    // if (auth) {
    //   const parsedUser = JSON.parse(auth);
    //   return parsedUser.roles;
    // }
    return null;
  },
  getIdentity: async () => {
    // const auth = nookies.get()["auth"];
    // if (auth) {
    //   const parsedUser = JSON.parse(auth);
    //   return parsedUser;
    // }
    return null;
  },
  onError: async (error) => {
    // console.error(error.message);
    // console.log(error.message);
    return { error };
  },
};
