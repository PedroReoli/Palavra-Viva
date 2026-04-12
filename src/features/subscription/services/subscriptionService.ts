import Purchases, {
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from 'react-native-purchases';

const PREMIUM_ENTITLEMENT = 'premium';

export const subscriptionService = {
  /**
   * Busca as ofertas disponiveis (mensal, anual).
   */
  async getOfferings(): Promise<PurchasesOfferings> {
    return Purchases.getOfferings();
  },

  /**
   * Realiza a compra de um pacote.
   */
  async purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo> {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  },

  /**
   * Restaura compras anteriores.
   */
  async restorePurchases(): Promise<CustomerInfo> {
    return Purchases.restorePurchases();
  },

  /**
   * Verifica se o usuario tem o entitlement premium ativo.
   */
  async checkPremiumStatus(): Promise<boolean> {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
  },

  /**
   * Retorna informacoes completas do cliente.
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    return Purchases.getCustomerInfo();
  },
};
