export default async (req) => {
  try {

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Method not allowed"
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }


    // Read information sent by the website
    const body = await req.json();


    // Get API key from Netlify environment variable
    const apiKey = process.env.OPENAI_API_KEY;


    // Check if API key exists
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY is not available to the function."
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }


    // Send information to OpenAI
    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
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
                "You are VerifyAI, an information consistency analysis assistant. Compare Information A and Information B. Identify exact matches, formatting differences, possible spelling or typing errors, actual conflicts, and missing information. Explain the important differences clearly and briefly."
            },

            {
              role: "user",

              content: `
Information A:

${JSON.stringify(body.informationA, null, 2)}


Information B:

${JSON.stringify(body.informationB, null, 2)}
`
            }
          ]

        })
      }
    );


    // Convert OpenAI response to JSON
    const data = await response.json();


    // If OpenAI returns an error
    if (!response.ok) {

      return new Response(
        JSON.stringify({
          error:
            data.error?.message ||
            "OpenAI request failed."
        }),
        {
          status: response.status,

          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    }


    // Send AI result back to the website
    return new Response(
      JSON.stringify({
        analysis:
          data.output_text ||
          "No AI analysis was returned."
      }),
      {
        status: 200,

        headers: {
          "Content-Type": "application/json"
        }
      }
    );


  } catch (error) {

    console.error("VerifyAI error:", error);


    return new Response(
      JSON.stringify({
        error: "AI analysis failed."
      }),
      {
        status: 500,

        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }
};
