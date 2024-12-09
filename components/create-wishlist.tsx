"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { useWishlist } from "@/hooks/use-wishlist";
import { Label } from "./ui/label";
import type { Wishlist } from "@/types";
import { Loader, Loader2Icon, PlusIcon, ShoppingBag } from "lucide-react";
import Link from "next/link";

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
      <form onSubmit={handleAddUrl} className="mt-4">
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
            <Button
              className="w-[120px]"
              type="submit"
              disabled={isLoading || isAdding}
            >
              <span className="flex items-center gap-3">
                Añadir{" "}
                {isLoading ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <PlusIcon className="w-4 h-4" />
                )}
              </span>
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
      {isFirstLoading && <BentoGrid loading items={[]} />}
    </motion.div>
  );
}

export default function BentoGrid({
  items,
  loading,
}: {
  items: (Wishlist | { user: string })[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[...Array(6)].map((_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className={`relative rounded-xl overflow-hidden ${
              index === 0 ? "md:col-span-2 md:row-span-2" : ""
            } border border-1 border-gray-300 shadow animate-pulse `}
          >
            <div className="relative aspect-[4/3] w-full h-full bg-gray-200" />
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div className="h-6 bg-gray-300 rounded w-3/4" />
              <div className="flex justify-end">
                <div className="h-8 w-24 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {items.map((item, index) => {
        const isFeatured = index === 0;

        if ("user" in item) {
          return (
            <div
              key="user"
              className="flex flex-col aspect-[4/3] bg-[#FFFFCC] p-8 gap-8 border-1 flex-1 border border-yellow-200 rounded-xl shadow"
            >
              <h1 className="text-[72px]">🎁</h1>
              <h1 className="text-4xl font-bold text-gray-900">
                Wishlist de{" "}
                <span className="relative">
                  {item.user}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 5 Q 25 0, 50 5 T 100 5"
                      fill="none"
                      stroke="#FFE600"
                      strokeWidth="3"
                    />
                  </svg>
                </span>
              </h1>
              <Link href="/">
                <Button className="text-lg text-black flex items-center gap-2 hover:bg-black hover:text-yellow-300">
                  Crear tu propia wishlist <PlusIcon className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          );
        }

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
  );
}
