function extractTextFromResponse(response: any): string {
  if (!response.message?.content) return '{}';

  // Find the first content block that contains text
  const textBlock = response.message.content.find(
    (item: any) => item.type === 'text' && typeof item.text === 'string',
  );

  return textBlock?.text ?? '{}';
}

export { extractTextFromResponse };
