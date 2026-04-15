import 'dotenv/config';

export default {
  expo: {
    name: "Layman",
    slug: "layman",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.shreyash.laymanapp",
      infoPlist: {
        NSPhoneCallUsageDescription: "Layman uses this to let you call support directly from the Help screen.",
        LSApplicationQueriesSchemes: ["tel", "mailto"]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.shreyash.laymanapp"
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    platforms: [
      "ios",
      "android",
      "web"
    ],
    plugins: [
      "expo-font",
      "expo-web-browser"
    ],
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      NEWSDATA_API_KEY: process.env.NEWSDATA_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
    },
  },
};