import { Container } from "inversify";
import { TYPES } from "@/di/types";

// インターフェース
import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { IProductRepository } from "@/interfaces/IProductRepository";
import type { ISearchProductsService } from "@/interfaces/ISearchProductsService";
import type { IGetOrderHistoriesService } from "@/interfaces/IGetOrderHistoriesService";
import type { IGetOrderDetailsService } from "@/interfaces/IGetOrderDetailsService";
import type { IRegisterCustomerAccountService } from "@/interfaces/IRegisterCustomerAccountService";
import type { IGetProductDetailService } from "@/interfaces/IGetProductDetailService";
import type { ICartRepository } from "@/interfaces/ICartRepository";
import type { IAddToCartService } from "@/interfaces/IAddToCartService";
import type { ICartService } from "@/interfaces/ICartService";
import type { IPaymentMethodRepository } from "@/interfaces/IPaymentMethodRepository";
import type { IPurchaseConfirmService } from "@/interfaces/IPurchaseConfirmService";
import type { IPurchaseService } from "@/interfaces/IPurchaseService";
import type { ICustomerRepository } from "@/interfaces/ICustomerRepository";
import type { IOrderRepository } from "@/interfaces/IOrderRepository";


// 実装クラス
import { CategoryRepository } from "@/infrastructures/CategoryRepository";
import { ProductRepository } from "@/infrastructures/ProductRepository";
import { SearchProductsService } from "@/services/SearchProductsService";
import { GetOrderHistoriesService } from "@/services/GetOrderHistoriesService";
import { GetOrderDetailsService } from "@/services/GetOrderDetailsService";
import { OrderRepository } from "@/infrastructures/OrderRepository";
import { CustomerRepository } from "@/infrastructures/CustomerRepository";
import { RegisterCustomerAccountService } from "@/services/RegisterCustomerAccountService";
import { GetProductDetailService } from "@/services/GetProductDetailService";
import { CartRepository } from "@/infrastructures/CartRepository";
import { AddToCartService } from "@/services/AddToCartService";
import { CartService } from "@/services/CartService";
import { PaymentMethodRepository } from "@/infrastructures/PaymentMethodRepository";
import { PurchaseConfirmService } from "@/services/PurchaseConfirmService";
import { PurchaseService } from "@/services/PurchaseService";
/**
 * DIコンテナ
 *
 * インターフェースを表す識別子と、
 * 実際に使用する実装クラスを紐づける。
 */
const container = new Container();

/*
 * Repositoryの登録
 */
container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository);
container.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository);
container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository);
container.bind<ICustomerRepository>(TYPES.ICustomerRepository).to(CustomerRepository);
container.bind<ICartRepository>(TYPES.ICartRepository).to(CartRepository);
container.bind<IPaymentMethodRepository>(TYPES.IPaymentMethodRepository,).to(PaymentMethodRepository);



/*
 * Serviceの登録
 */
container.bind<ISearchProductsService>(TYPES.ISearchProductsService).to(SearchProductsService);
container.bind<IGetOrderHistoriesService>(TYPES.IGetOrderHistoriesService).to(GetOrderHistoriesService);
container.bind<IGetOrderDetailsService>(TYPES.IGetOrderDetailsService).to(GetOrderDetailsService);
container.bind<IRegisterCustomerAccountService>(TYPES.IRegisterCustomerAccountService).to(RegisterCustomerAccountService);
container.bind<IGetProductDetailService>(TYPES.IGetProductDetailService,).to(GetProductDetailService);
container.bind<IAddToCartService>(TYPES.IAddToCartService,).to(AddToCartService);
container.bind<ICartService>(TYPES.ICartService).to(CartService);
container.bind<IPurchaseConfirmService>(TYPES.IPurchaseConfirmService,).to(PurchaseConfirmService);
container.bind<IPurchaseService>(TYPES.IPurchaseService,).to(PurchaseService);

export { container };
