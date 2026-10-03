export default async (req) => {
  try {
    const body = await req.json();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Netlify.env.get("OPENAI_API_KEY")}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: `
You are VerifyAI, an information consistency analysis assistant.

Compare Information A and Information B.

Identify:
1. Exact matches
2. Formatting differences
3. Possible spelling or typing errors
4. Actual conflicts
5. Missing information

Explain the important differences clearly and briefly.

Information A:
${JSON.stringify(body.informationA)}

Information B:
${JSON.stringify(body.informationB)}
`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data }),
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
