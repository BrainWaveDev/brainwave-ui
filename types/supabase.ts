export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      document: {
        Row: {
          id: number
          metadata: Json
          name: string
          object_id: string
          owner: string
        }
        Insert: {
          id?: number
          metadata: Json
          name: string
          object_id: string
          owner: string
        }
        Update: {
          id?: number
          metadata?: Json
          name?: string
          object_id?: string
          owner?: string
        }
      }
      document_chunk: {
        Row: {
          content: string
          document_id: number
          embedding: string
          id: string
        }
        Insert: {
          content: string
          document_id: number
          embedding: string
          id?: string
        }
        Update: {
          content?: string
          document_id?: number
          embedding?: string
          id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_storage_item: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      hello_world: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_document_chunks: {
        Args: {
          user_id: string
          embedding: string
          match_threshold: number
          match_count: number
          min_content_length: number
        }
        Returns: {
          document_owner: string
          document_name: string
          content: string
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
