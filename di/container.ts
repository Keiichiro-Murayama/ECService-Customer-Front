import { Container } from "inversify";
import { TYPES } from "@/di/types";

// インターフェース
import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { IProductRepository } from "@/interfaces/IProductRepository";
import type { ISearchProductsService } from "@/interfaces/ISearchProductsService";
import type { IGetOrderHistoriesService } from "@/interfaces/IGetOrderHistoriesService";
import type { IGetOrderDetailsService } from "@/interfaces/IGetOrderDetailsService";
import type { IRegisterCustomerAccountService } from "@/interfaces/IRegisterCustomerAccountService";

// 実装クラス
import { CategoryRepository } from "@/infrastructures/CategoryRepository";
import { ProductRepository } from "@/infrastructures/ProductRepository";
import { SearchProductsService } from "@/services/SearchProductsService";
import { GetOrderHistoriesService } from "@/services/GetOrderHistoriesService";
import { GetOrderDetailsService } from "@/services/GetOrderDetailsService";
import type { IOrderRepository } from "@/interfaces/IOrderRepository";
import { OrderRepository } from "@/infrastructures/OrderRepository";
import type { ICustomerRepository } from "@/interfaces/ICustomerRepository";
import { CustomerRepository } from "@/infrastructures/CustomerRepository";
import { RegisterCustomerAccountService } from "@/services/RegisterCustomerAccountService";

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
container
  .bind<ICategoryRepository>(TYPES.ICategoryRepository)
  .to(CategoryRepository);

container
  .bind<IProductRepository>(TYPES.IProductRepository)
  .to(ProductRepository);

container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository);
container
  .bind<ICustomerRepository>(TYPES.ICustomerRepository)
  .to(CustomerRepository);

/*
 * Serviceの登録
 */
container
  .bind<ISearchProductsService>(TYPES.ISearchProductsService)
  .to(SearchProductsService);
container
  .bind<IGetOrderHistoriesService>(TYPES.IGetOrderHistoriesService)
  .to(GetOrderHistoriesService);
container
  .bind<IGetOrderDetailsService>(TYPES.IGetOrderDetailsService)
  .to(GetOrderDetailsService);
container
  .bind<IRegisterCustomerAccountService>(TYPES.IRegisterCustomerAccountService)
  .to(RegisterCustomerAccountService);

export { container };
