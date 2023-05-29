import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt_decode from "jwt-decode";

async function refreshAccessToken(tokenObject: any) {
  try {
    const res = await fetch("http://adonys-api_dev:3000/auth/refresh", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + tokenObject.refreshToken,
      },
    });
    console.log("res2222222:", res);
    const user = await res.json();
    console.log("user2222222:", user);
    const u = user as unknown as any;

    return {
      ...tokenObject,
      accessToken: u.accessToken,
      accessTokenExpiry: u.accessTokenExpiry,
      refreshToken: u.refreshToken,
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  debug: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[front][server]credentials:", credentials);
        // const user = { id: "1", name: "Admin", email: "admin@admin.com" };
        // return user;

        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch("http://adonys-api_dev:3000/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        console.log("res:", res);
        const user = await res.json();

        console.log("[front][server]user:", user);

        // If no error and we have user data, return it
        if (res.ok && user) {
          console.log("[front][server]retorna user");
          return user;
        }
        // Return null if user data could not be retrieved
        console.log("[front][server]retorna null");
        return null;
      },
    }),
  ],
  callbacks: {
    session: ({ session, token, user }) => {
      console.log("[front][server]SESSION:");
      console.log("[front][server]SESSION:session:", session);
      console.log("[front][server]SESSION:token:", token);
      console.log("[front][server]SESSION:user:", user);

      const u = token.user as unknown as any;

      let error = null;

      if (!token.accessToken) {
        error = token.error;
      }

      return {
        ...session,
        accessToken: token.accessToken,
        accessTokenExpiry: token.accessTokenExpiry,
        error,
        user: {
          name: u.name,
          email: u.email,
          username: u.username,
          sub: u.sub,
        },
      };
    },
    jwt: async ({ token, account, user }) => {
      console.log("[front][server]JWT:");
      console.log("[front][server]JWT:token:", token);
      console.log("[front][server]JWT:account:", account);
      console.log("[front][server]JWT:user:", user);

      if (user) {
        console.log("[front][server]JWT:Entra user");

        const u = user as unknown as any;

        var decoded = jwt_decode(u.accessToken);
        console.log("decoded:", decoded);

        token.user = decoded;
        token.accessToken = u.accessToken;
        token.accessTokenExpiry = u.accessTokenExpiry;
        token.refreshToken = u.refreshToken;
        token.error = null;

        const a: number = (token.accessTokenExpiry as number) * 1000;
        const b = 5 * 60 * 1000;
        const d = Date.now();

        console.log(a);
        console.log(b);
        console.log(d);
        console.log(a - b - d);

        const shouldRefreshTime = Math.round(a - b - d);

        console.log("shouldRefreshTime:", shouldRefreshTime);

        // If the token is still valid, just return it.
        if (shouldRefreshTime > 0) {
          console.log("Retorna el token original");
          return token;
        }

        // If the call arrives after 23 hours have passed, we allow to refresh the token.
        const newToken = await refreshAccessToken(token);
        console.log("Retorna NUEVO token");
        return newToken;
      }

      if (!token.accessToken) {
        console.log("Retorna error");
        return { ...token, error: "AccessTokenError" };
      }

      console.log("Retorna el token original");
      return token;
    },
  },
};
