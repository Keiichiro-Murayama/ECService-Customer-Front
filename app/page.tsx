// MenuPage.tsx
"use client";
import {
  Inbox,
  LaptopMinimalCheck,
  ReceiptText,
  User,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useHome } from "@/hooks/useHome";
import type { Product } from "@/models/Product";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function MenuPage() {
  const { products, isLoading, error } = useHome();

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました: {error.message}</div>;

  return (
    // 1. 一番外側は余白なしの div にする
    <div className="w-full">
      {/* 2. 画像は余計なマージンをつけず、w-full で配置（これでヘッダーの幅と揃います） */}
      <img
        className="w-full h-[400px] object-cover"
        src="https://ecservicestorage2026.blob.core.windows.net/photos/stationary.jpg"
        alt="トップ画像"
      />

      {/* 3. 画像より下のコンテンツ（カルーセルなど）にだけ、左右・下の余白（px-4 pb-4 pt-6など）をつける */}
      <div className="px-4 pb-4 pt-6 w-full">
        <Carousel opts={{ align: "start" }} className="w-full relative">
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem
                key={product.productUuid}
                className="pl-4 basis-1/4"
              >
                <div className="p-4 bg-white border rounded-xl shadow-sm h-full">
                  <img
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    src={product.imageUrl}
                    alt={product.productName}
                  />
                  <p className="text-black font-bold">{product.productName}</p>
                  <div className="flex items-center text-muted justify-between mt-2">
                    <p className="text-muted">{product.price}円</p>

                    <Link
                      href={`/products/detail/${product.productUuid}`}
                      className="px-3 py-1 text-sm text-primary-foreground bg-primary rounded hover:bg-primary-dark transition"
                    >
                      詳細
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-2 top-1/2" />
          <CarouselNext className="absolute right-2 top-1/2" />
        </Carousel>
      </div>
    </div>
  );
}
