"use client"

import React from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "@/components/merlion/checkout-form"
import { useCartStore } from "@/lib/cart-store"
import { useRouter } from "next/navigation"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = React.useState("")
  const { items, reservationId } = useCartStore()
  const router = useRouter()

  React.useEffect(() => {
    if (items.length === 0) {
        router.push('/')
        return;
    }

    if (!reservationId) {
        // Should probably reserve first, but assuming flow guarantees reservation
        return; 
    }

    // Create PaymentIntent as soon as the page loads
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, reservationId, email: "guest@example.com" }), // Email collection needed in UI
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [items, reservationId, router])

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#C77966',
      colorBackground: '#F8F3E6',
      colorText: '#3A2A1F',
    },
  };
  const options = {
    clientSecret,
    appearance,
  }

  return (
    <div className="min-h-screen bg-nyonya-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-kopi-brown/10">
        <h1 className="font-heading text-3xl text-ui-terracotta mb-6 text-center">Checkout</h1>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  )
}
