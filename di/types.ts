/**
 * DIコンテナ用の識別子（Symbol）定義
 */
export const TYPES = {
  // インフラストラクチャ層
  ICategoryRepository: Symbol.for("ICategoryRepository"),
  ICustomerRepository: Symbol.for("ICustomerRepository"),
  IOrderRepository: Symbol.for("IOrderRepository"),
  IPaymentMethodRepository: Symbol.for("IPaymentMethodRepository"),
  IProductRepository: Symbol.for("IProductRepository"),
  ICartRepository: Symbol.for("ICartRepository"),
  // サービス層
  ISearchProductsService: Symbol.for("ISearchProductsService"),
  IGetOrderHistoriesService: Symbol.for("IGetOrderHistoriesService"),
  IGetOrderDetailsService: Symbol.for("IGetOrderDetailsService"),
  IRegisterCustomerAccountService: Symbol.for("IRegisterCustomerAccountService",),
  IGetProductDetailService: Symbol.for("IGetProductDetailService",),
  IAddToCartService: Symbol.for("IAddToCartService",),
  ICartService: Symbol.for("ICartService"),
  IPurchaseConfirmService: Symbol.for("IPurchaseConfirmService",),
  IPurchaseService: Symbol.for("IPurchaseService",),
} as const;
