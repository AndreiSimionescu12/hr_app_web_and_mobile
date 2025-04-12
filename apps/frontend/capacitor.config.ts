import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ro.sistemmanagemeneangajati',
  appName: 'HR Management',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Pentru dezvoltare, folosim IP-ul mașinii din rețeaua locală
    // IP-ul tău Wi-Fi: 192.168.0.103
    url: 'http://192.168.0.103:3000',
    cleartext: true
  },
  // Ajustează statusBar pentru o experiență mai bună
  android: {
    backgroundColor: '#FFFFFF',
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: undefined,
      signingType: undefined
    }
  }
};

export default config;
