"use client"

import * as React from "react"
import { ButtonMerlion } from "./button-merlion"
import { cn } from "@/lib/utils"

export function NewsletterForm() {
  const [email, setEmail] = React.useState("")
  const [consent, setConsent] = React.useState(false)
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!consent) {
      setMessage("Please confirm your consent to join the manuscript.")
      setStatus("error")
      return
    }

    setStatus("loading")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent_marketing: true }),
      })

      if (!res.ok) throw new Error("Subscription failed")

      setStatus("success")
      setMessage("Welcome to the inner circle. Check your inbox.")
      setEmail("")
      setConsent(false)
    } catch (error) {
      setStatus("error")
      setMessage("Unable to seal your subscription. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto text-left">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your illuminated email address..."
            className="w-full px-4 py-3 bg-white border border-kopi-brown/20 rounded-md focus:outline-none focus:border-ui-terracotta font-body text-kopi-brown placeholder:text-kopi-brown/40"
            required
          />
        </div>
        
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 accent-ui-terracotta"
          />
          <label htmlFor="consent" className="text-sm text-kopi-brown/80 leading-tight">
            I consent to receiving the Merlion Brews manuscript and understand my data will be handled according to the Personal Data Protection Act.
          </label>
        </div>

        <ButtonMerlion 
          type="submit" 
          disabled={status === "loading"}
          className="w-full"
        >
          {status === "loading" ? "Sealing..." : "Seal Your Subscription"}
        </ButtonMerlion>

        {message && (
          <p className={cn(
            "text-sm text-center mt-2",
            status === "error" ? "text-red-600" : "text-ui-terracotta"
          )}>
            {message}
          </p>
        )}
      </div>
    </form>
  )
}
