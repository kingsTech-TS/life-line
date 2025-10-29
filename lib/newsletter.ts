// Newsletter subscription utilities

export async function subscribeToNewsletter(email: string, name?: string) {
  try {
    // Placeholder for newsletter API integration
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to subscribe")
    }

    return await response.json()
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    throw error
  }
}
