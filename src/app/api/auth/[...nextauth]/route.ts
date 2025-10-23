// // In: src/app/api/auth/[...nextauth]/route.ts
// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
// })

// export { handler as GET, handler as POST }


// In: src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; // 1. Import CredentialsProvider

const handler = NextAuth({
  providers: [
    // This is your existing Google provider. It remains unchanged.
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // 2. Add the Credentials provider for email/password login
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          // You can define any fields you expect here, but they are not displayed on the form.
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            // This is where you check if the user's details are correct.
            if (!credentials) {
                return null;
            }

            // Your demo credentials logic
            const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };

            if (
              credentials.email === DEMO_CREDENTIALS.email &&
              credentials.password === DEMO_CREDENTIALS.password
            ) {
              // If the credentials are valid, return a user object.
              // This object will be stored in the session.
              return { id: "demo-user-1", name: "Demo User", email: DEMO_CREDENTIALS.email };
            }

            // If the credentials are not valid, return null.
            // NextAuth will then send an error back to the login form.
            return null;
        }
    })
  ],

  // 3. (Recommended) Point to your custom login page
  pages: {
    signIn: '/login', // Replace with the actual path to your login page
  },

  // Your existing NEXTAUTH_SECRET remains unchanged.
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };