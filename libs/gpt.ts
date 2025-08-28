import axios from 'axios';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Use this if you want to make a call to OpenAI GPT-4 for instance. userId is used to identify the user on openAI side.
export const sendOpenAi = async (
  messages: ChatMessage[],
  userId: number,
  max = 100,
  temp = 1
) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  const body = JSON.stringify({
    model: 'gpt-4',
    messages,
    max_tokens: max,
    temperature: temp,
    user: userId,
  });

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(url, body, options);

    const answer = res.data.choices[0].message.content;
    const usage = res?.data?.usage;

    return answer;
  } catch (e) {
    // Log error for production monitoring
    console.error('GPT Error: ' + e?.response?.status, e?.response?.data);
    return null;
  }
};
