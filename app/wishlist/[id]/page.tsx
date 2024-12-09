import { fetchMercadoLibreData } from "@/utils/fetchMercadoLibreUrl";

import { sql } from "@vercel/postgres";
import { redirect } from "next/navigation";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: user } = await params;

  console.log("Fetching wishlist for user:", user);
  const wishlistsUrls = await sql<{
    data: string[];
  }>`SELECT data FROM wishlists WHERE name = ${user}`;

  const urls: string[] = wishlistsUrls.rows[0].data;

  if (!urls || urls.length === 0) {
    redirect("/");
  }

  const wishlistsItems = await Promise.all(
    urls.map(async (url: string) => ({
      url,
      data: await fetchMercadoLibreData(url),
    }))
  );

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <nav className="mx-auto mb-8 flex max-w-7xl items-center justify-between">
        <h1 className="text-5xl font-bold text-gray-900">
          Wishlist de{" "}
          <span className="relative">
            {user}
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
        <Link
          href="/"
          className="rounded-full bg-[#FFE600] px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-[#FFD600]"
        >
          Crear tu propia wishlist
        </Link>
      </nav>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistsItems.map((wishlistItem) => (
            <a
              href={wishlistItem.url}
              key={wishlistItem.url}
              target="_blank"
              rel="noreferrer"
              className="transform transition-transform hover:scale-105"
            >
              <Card className="overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={wishlistItem.data.imageSrc || ""}
                      alt={wishlistItem.data.title || ""}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="line-clamp-2 min-h-[3rem] text-lg font-semibold text-gray-800">
                      {wishlistItem.data.title}
                    </h2>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 p-4">
                  <p className="text-xl font-bold text-[#3483FA]">
                    ${wishlistItem.data.price?.toLocaleString() || "-"}
                  </p>
                </CardFooter>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
