const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
    databaseUrl: process.env.NEXT_PUBLIC_DATABASE_URL!,
    authGithubId: process.env.AUTH_GITHUB_ID!,
    authGithubSecret: process.env.AUTH_GITHUB_SECRET!,
    authGoogleId: process.env.AUTH_GOOGLE_ID!,
    authGoogleSecret: process.env.AUTH_GOOGLE_SECRET!,
  },
};

export default config;
