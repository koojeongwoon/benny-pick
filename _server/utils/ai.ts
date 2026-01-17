export const parseIntent = async (ai: any, messages: any[]) => {
  // Fallback default
  const defaultIntent = {
    age: null as number | null,
    region: null as string | null,
    category: null as string | null,
  };

  try {
    // Format messages for Llama 3
    // We only need the user's messages for intent parsing, but context helps.
    // However, for intent, usually the last message is most important.
    // Let's keep it simple and just use the last message for intent parsing to avoid confusion,
    // OR we can pass the whole history if we want it to understand context like "And for me?"
    // For now, let's stick to the last message for intent to keep it robust,
    // as the system prompt is specific to extraction.
    // BUT, if the user says "28살이야" and then "서울 살아", we need history.
    // So let's pass the history but with a strong system prompt.

    const systemMessage = {
      role: "system",
      content: `You are a helpful assistant that extracts information from Korean text.
          Extract 'age' (number), 'region' (string, e.g., 서울, 경기), and 'category' (string, one of: housing, job, finance, cash, education, welfare) from the user's message.
          Return ONLY a JSON object. Do not add any explanation.
          If a field is missing, set it to null.
          
          Example:
          Input: "28살 서울 월세 지원"
          Output: {"age": 28, "region": "서울", "category": "housing"}`,
    };

    // Filter and map messages to match Llama 3 format
    const history = messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const response = await ai.run("@cf/meta/llama-3-8b-instruct", {
      messages: [systemMessage, ...history],
    });

    // Parse JSON from response
    // Llama 3 might add some text, so try to find JSON block
    const text = response.response || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { ...defaultIntent, ...parsed };
    }
    return defaultIntent;
  } catch (e) {
    console.error("AI Parse Error:", e);
    return defaultIntent;
  }
};

export const generateResponse = async (
  ai: any,
  messages: any[],
  intent: any,
  policies: any[]
) => {
  try {
    const systemPrompt = `You are 'Benny Pick', a helpful welfare policy assistant.
    Your role is to summarize the provided policies for the user.
    
    CRITICAL INSTRUCTION: YOU MUST ANSWER IN KOREAN ONLY.
    
    Guidelines:
    1. Summarize the provided policies for the user based on the matched policies.
    2. Be friendly and encouraging.
    3. If policies are found, highlight the top 1-2 most relevant ones.
    4. If no policies are found, suggest what information is missing (age, region, etc.).
    5. Keep the response concise (under 200 characters if possible, but detailed enough).
    
    Current User Intent: ${JSON.stringify(intent)}
    Matched Policies: ${JSON.stringify(policies.slice(0, 3))}`;

    // Filter and map messages to match Llama 3 format
    const history = messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));

    // Replace the last user message with an augmented one if needed,
    // OR just prepend the system prompt.
    // Llama 3 works best with System -> User -> Assistant -> User ...

    const response = await ai.run("@cf/meta/llama-3-8b-instruct", {
      messages: [{ role: "system", content: systemPrompt }, ...history],
    });

    return response.response;
  } catch (e) {
    console.error("AI Generate Error:", e);
    return "죄송합니다. AI 응답을 생성하는 중에 문제가 발생했습니다. 하지만 조건에 맞는 정책은 리포트에서 확인하실 수 있습니다.";
  }
};
