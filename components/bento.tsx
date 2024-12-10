'use client'

import Link from 'next/link'
import type { Wishlist } from '../types'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from './ui/button'

export default function BentoGrid({
  items = [],
  loading,
}: {
  items?: (
    | (Wishlist & {
        onDelete?: (url: string) => void
      })
    | { user: string }
    | { share: () => void }
  )[]
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[...Array(6)].map((_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className={`relative rounded-xl overflow-hidden ${
              index === 0 ? 'md:col-span-2 md:row-span-2' : ''
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
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {items?.map((item, index) => {
        const isFeatured = index === 0

        if (!item) return null

        if ('share' in item) {
          return (
            <div
              key="share"
              className="flex flex-col aspect-[4/3] bg-[#FFFFCC] p-8 gap-8 border-1 flex-1 border border-yellow-200 rounded-xl shadow"
            >
              <div className="text-[72px]">🎁</div>

              <h1 className="text-3xl font-bold text-gray-900">
                Para que sepan qué regalarte
              </h1>

              <Button
                className="text-lg text-black flex items-center gap-2"
                onClick={item.share}
              >
                Compartir lista
              </Button>
            </div>
          )
        }

        if ('user' in item) {
          return (
            <div
              key="user"
              className="flex flex-col aspect-[4/3] bg-[#FFFFCC] p-8 gap-8 border-1 flex-1 border border-yellow-200 rounded-xl shadow"
            >
              <div className="text-[72px]">🎁</div>
              <h1 className="text-4xl font-bold text-gray-900">
                Wishlist de{' '}
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
                <Button className="text-lg text-black flex items-center gap-2">
                  Crear tu propia wishlist <PlusIcon className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )
        }

        return (
          <div
            key={item.url}
            className={`relative rounded-xl overflow-hidden group ${
              isFeatured ? 'md:col-span-2 md:row-span-2' : ''
            } border border-1 border-gray-300 shadow`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10" />

            <div className="relative aspect-[4/3] w-full h-full">
              <img
                src={item.data.imageSrc || ''}
                alt={item.data.title || ''}
                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
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

            {'onDelete' in item ? (
              <Button
                variant="outline"
                className="absolute top-1 right-4 mt-4 bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-500 hover:text-red-400 z-40"
                onClick={() => item.onDelete?.(item.url)}
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            ) : (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                <div className="text-white text-center p-4">
                  <h3 className="font-semibold text-xl mb-2">
                    {item.data.title}
                  </h3>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <Button
                      variant="outline"
                      className="mt-4 bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white"
                    >
                      Ver producto
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
