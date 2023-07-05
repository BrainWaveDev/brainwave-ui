export interface Prompt {
  id: number;
  name: string;
  description?: string;
  // Define prompt content on the server to avoid exposing it to the client
  content?: string;
}
