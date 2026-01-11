"use client"

import * as React from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { ButtonMerlion } from "./button-merlion"

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          break
        case "processing":
          setMessage("Your payment is processing.")
          break
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
    })

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An error occurred")
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <ButtonMerlion disabled={isLoading || !stripe || !elements} id="submit" className="w-full">
        {isLoading ? <div className="spinner" id="spinner">Processing...</div> : "Pay now"}
      </ButtonMerlion>
      {message && <div id="payment-message" className="text-red-500 text-sm text-center">{message}</div>}
    </form>
  )
}
