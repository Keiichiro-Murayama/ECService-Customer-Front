import { Container } from "inversify";
import { TYPES } from "@/di/types";

// インターフェース
import type { ICategoryRepository } from "@/interfaces/ICategoryRepository";
import type { IProductRepository } from "@/interfaces/IProductRepository";
import type { ISearchProductsService } from "@/interfaces/ISearchProductsService";

// 実装クラス
import { CategoryRepository } from "@/infrastructures/CategoryRepository";
import { ProductRepository } from "@/infrastructures/ProductRepository";
import { SearchProductsService } from "@/services/SearchProductsService";

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

/*
 * Serviceの登録
 */
container.bind<ISearchProductsService>(TYPES.ISearchProductsService).to(SearchProductsService);

export { container };