"use client"

import * as React from "react"
import { CardMerlion } from "@/components/merlion/card-merlion"
import { ButtonMerlion } from "@/components/merlion/button-merlion"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  title: string
  description: string
  price_cents: number
  sessions: Session[]
}

interface Session {
  id: string
  starts_at: string
  capacity: number
  booked_count: number
}

export default function EventsPage() {
  const [events, setEvents] = React.useState<Event[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/bookings') // BFF to backend GET /events
      .then(res => res.json())
      .then(data => {
        setEvents(data.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleBook = async (sessionId: string) => {
    // Simple prompt for MVP
    const email = prompt("Please enter your email to confirm booking:")
    if (!email) return

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, email, quantity: 1 })
      })
      
      if (res.ok) {
        alert("Booking confirmed!")
        // Refresh
        window.location.reload()
      } else {
        alert("Booking failed. Session might be full.")
      }
    } catch (e) {
      alert("Error booking session")
    }
  }

  return (
    <main className="min-h-screen bg-nyonya-cream py-32 px-4">
      <div className="max-w-[85ch] mx-auto">
        <h1 className="font-heading text-5xl text-ui-terracotta mb-8 text-center">Cultural Gatherings</h1>
        <p className="text-center text-kopi-brown mb-16 max-w-[60ch] mx-auto">
          Join us for intimate sessions celebrating the heritage of coffee and culture in Singapore.
        </p>

        {loading ? (
          <div className="text-center">Loading gatherings...</div>
        ) : (
          <div className="grid gap-8">
            {events.map(event => (
              <CardMerlion key={event.id} className="p-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div>
                    <h2 className="text-3xl font-600 text-kopi-brown mb-2">{event.title}</h2>
                    <p className="text-kopi-brown/80 mb-4">{event.description}</p>
                    <div className="text-ui-gold font-decorative text-2xl" role="text">
                      <span className="sr-only">Price: </span>
                      {event.price_cents === 0 ? "Free" : `$${(event.price_cents / 100).toFixed(2)}`}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 min-w-[200px]">
                    <h3 className="font-600 text-sm uppercase tracking-widest text-ui-blue">Upcoming Sessions</h3>
                    {event.sessions.length > 0 ? (
                      event.sessions.map(session => (
                        <div key={session.id} className="flex items-center justify-between border-b border-kopi-brown/10 pb-2">
                          <div>
                            <div className="font-600">
                              {new Date(session.starts_at).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-kopi-brown/60">
                              {new Date(session.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <ButtonMerlion 
                            variant="secondary" 
                            size="sm"
                            disabled={session.booked_count >= session.capacity}
                            aria-label={
                              session.booked_count >= session.capacity
                                ? `${event.title} session is full`
                                : `Book ${event.title} on ${new Date(session.starts_at).toLocaleDateString()} at ${new Date(session.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            }
                            onClick={() => handleBook(session.id)}
                          >
                            {session.booked_count >= session.capacity ? "Full" : "Book"}
                          </ButtonMerlion>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm italic text-kopi-brown/50">No upcoming sessions.</p>
                    )}
                  </div>
                </div>
              </CardMerlion>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
