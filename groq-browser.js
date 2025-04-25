export class ChatGroq {
  constructor({ model, temperature, apiKey }) {
    this.model = model;
    this.temperature = temperature;
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  }

  async call(history) {
    const messages = history.map(({ role, content }) => ({ role, content }));
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: this.temperature,
      })
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error?.message || 'Groq API error');
    }
    const data = await res.json();
    return { text: data.choices[0].message.content };
  }
}
