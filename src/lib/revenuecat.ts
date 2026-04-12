import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ?? '';
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? '';

/**
 * Inicializa o RevenueCat SDK.
 * Chamar uma unica vez no startup do app (ex: _layout.tsx).
 */
export async function initRevenueCat() {
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;

  if (!apiKey) {
    console.warn('[RevenueCat] API key nao configurada para', Platform.OS);
    return;
  }

  Purchases.configure({ apiKey });
}

/**
 * Vincula o usuario autenticado ao RevenueCat.
 * Chamar apos login/registro.
 */
export async function identifyUser(userId: string) {
  await Purchases.logIn(userId);
}

/**
 * Desvincula o usuario (logout).
 */
export async function resetUser() {
  await Purchases.logOut();
}
