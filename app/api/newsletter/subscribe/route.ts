// Newsletter subscription endpoint

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    // Validate email
    if (!email || !email.includes("@")) {
      return Response.json({ error: "Invalid email" }, { status: 400 })
    }

    // TODO: Integrate with Mailchimp or Brevo
    // This is a placeholder that logs the subscription
    console.log("[Newsletter] New subscription:", { email, name })

    return Response.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
        email,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Newsletter] Error:", error)
    return Response.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
