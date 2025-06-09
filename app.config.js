import 'dotenv/config';

export default {
  expo: {
    
    name: 'Smartbill',
    slug: 'smartbill',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.smartbill.smartbill',
    },
    android: {
      package: 'com.smartbill.smartbill',
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'READ_MEDIA_IMAGES',
      ],
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/icon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-font',
      'expo-sqlite',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiKey: process.env.API_KEY,
      eas: {
        projectId: 'f97edb25-f2fb-472c-adbf-a2add23e4c4a',
      },
    },
    doctor: {
      reactNativeDirectoryCheck: {
        listUnknownPackages: false,
      },
    },
  },
};
