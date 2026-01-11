import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-kopi-brown text-nyonya-cream p-6">
        <div className="font-heading text-2xl mb-8">Admin</div>
        <nav className="space-y-4">
          <Link href="/admin/orders" className="block hover:text-ui-terracotta">Orders</Link>
          <Link href="/admin/inventory" className="block hover:text-ui-terracotta">Inventory</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
