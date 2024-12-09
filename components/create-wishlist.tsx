"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { useWishlist } from "@/hooks/use-wishlist";
import { Label } from "./ui/label";
import type { Wishlist } from "@/types";

interface CreateWishlistProps {
  sessionId: string;
  username: string;
}

export function CreateWishlist({ sessionId }: CreateWishlistProps) {
  const { wishlist, isLoading, addUrl, deleteUrl } = useWishlist(sessionId);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const { toast } = useToast();

  const handleAddUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);
    await addUrl(newUrl);
    setNewUrl("");
    setIsAdding(false);
    toast({
      title: "Artículo añadido",
      description: "El artículo ha sido añadido a tu lista de deseos.",
    });
  };

  const isFirstLoading = isLoading && wishlist.length === 0 && !isAdding;
  const isEmpty = wishlist.length === 0 && !isFirstLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleAddUrl}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="url" className="text-md text-muted-foreground">
            URL del artículo
          </Label>
          <div className="flex gap-2">
            <Input
              id="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://articulo.mercadolibre....."
            />
            <Button type="submit" disabled={isLoading || isAdding}>
              {isLoading ? "Cargando..." : "Añadir"}
            </Button>
          </div>
        </div>
      </form>
      <BentoGrid items={wishlist} />
      {isEmpty && (
        <p className="text-muted-foreground mt-4">
          No hay artículos en tu lista de deseos
        </p>
      )}
      {isFirstLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Falsooo
          <div key={index} className="h-24 w-full bg-gray-100 animate-pulse" />
        ))}
    </motion.div>
  );
}

export default function BentoGrid({ items }: { items: Wishlist[] }) {
  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const isFeatured = index === 0;

          return (
            <div
              key={item.url}
              className={`relative rounded-xl overflow-hidden group ${
                isFeatured ? "md:col-span-2 md:row-span-2" : ""
              } border border-1 border-gray-300 shadow`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10" />

              <div className="relative aspect-[4/3] w-full h-full">
                <img
                  src={item.data.imageSrc || ""}
                  alt={item.data.title || ""}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between">
                <h3 className="font-semibold text-white text-lg md:text-xl">
                  {item.data.title}
                </h3>

                <div className="flex justify-end">
                  <span className="bg-white text-black px-3 py-1 rounded-full font-semibold shadow-md">
                    ${item.data.price}
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                <div className="text-white text-center p-4">
                  <h3 className="font-semibold text-xl mb-2">
                    {item.data.title}
                  </h3>
                  <Button
                    variant="outline"
                    className="mt-4 bg-white/10 hover:bg-white/20 border-white/20"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    Ver producto
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
