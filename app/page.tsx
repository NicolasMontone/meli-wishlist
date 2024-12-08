import { CreateWishlist } from '@/components/create-wishlist'

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-primary">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary-foreground">
            Mi Lista de Deseos
          </h1>
        </div>
      </nav>
      <main className="container mx-auto p-4 space-y-8">
        <CreateWishlist />
      </main>
    </div>
  )
}
