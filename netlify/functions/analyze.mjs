export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const body = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY is not configured." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },

      body: JSON.stringify({
        model: "gpt-5-mini",

        input: [
          {
            role: "system",
            content:
              "You are VerifyAI, an information consistency analysis assistant. Compare two sets of user-provided information. Identify exact matches, formatting differences, possible spelling or typing errors, actual conflicts, and missing information. Explain important differences clearly and briefly."
          },

          {
            role: "user",
            content: `Information A:
${JSON.stringify(body.informationA)}

Information B:
${JSON.stringify(body.informationB)}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data.error?.message || "OpenAI request failed."
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({
        analysis: data.output_text
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {

    return new Response(
      JSON.stringify({
        error: "AI analysis failed."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
