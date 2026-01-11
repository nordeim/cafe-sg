export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-heading mb-6">Orders</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Order list loading...</p>
        {/* Real implementation would fetch /api/v1/admin/orders */}
      </div>
    </div>
  )
}
