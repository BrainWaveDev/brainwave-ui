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
      conversation: {
        Row: {
          created_at: string | null
          folder_id: number | null
          id: number
          model: string | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          folder_id?: number | null
          id?: number
          model?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          folder_id?: number | null
          id?: number
          model?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
      }
      document: {
        Row: {
          date_uploaded: string | null
          id: number
          metadata: Json
          name: string
          object_id: string
          owner: string
          parse_attempts: number | null
          status: Database["public"]["Enums"]["document_status_enum"] | null
          status_message:
            | Database["public"]["Enums"]["document_status_message"]
            | null
        }
        Insert: {
          date_uploaded?: string | null
          id?: number
          metadata: Json
          name: string
          object_id: string
          owner: string
          parse_attempts?: number | null
          status?: Database["public"]["Enums"]["document_status_enum"] | null
          status_message?:
            | Database["public"]["Enums"]["document_status_message"]
            | null
        }
        Update: {
          date_uploaded?: string | null
          id?: number
          metadata?: Json
          name?: string
          object_id?: string
          owner?: string
          parse_attempts?: number | null
          status?: Database["public"]["Enums"]["document_status_enum"] | null
          status_message?:
            | Database["public"]["Enums"]["document_status_message"]
            | null
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
      folder: {
        Row: {
          created_at: string | null
          id: number
          name: string
          updated_ad: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string
          updated_ad?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          updated_ad?: string | null
          user_id?: string
        }
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: number
          created_at: string | null
          id: number
          index: number
          role: string
          user_id: string
        }
        Insert: {
          content?: string | null
          conversation_id: number
          created_at?: string | null
          id?: number
          index: number
          role: string
          user_id?: string
        }
        Update: {
          content?: string | null
          conversation_id?: number
          created_at?: string | null
          id?: number
          index?: number
          role?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_document_status:
        | {
            Args: {
              document_id: number
              parse_attempts: number
            }
            Returns: undefined
          }
        | {
            Args: {
              document_id: number
              parse_attempts: number
              document_name: string
            }
            Returns: undefined
          }
      delete_documents: {
        Args: {
          ids: number[]
        }
        Returns: string
      }
      delete_storage_item: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      hello: {
        Args: {
          json_input: Json
        }
        Returns: string
      }
      insert_document_chunks: {
        Args: {
          chunks: Json
        }
        Returns: Json
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_document_chunks:
        | {
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
        | {
            Args: {
              user_id: string
              min_content_length: number
              match_threshold: number
              match_count: number
              embedding: string
              search_space: number[]
            }
            Returns: {
              document_owner: string
              document_name: string
              content: string
              similarity: number
            }[]
          }
      reparse_file_request: {
        Args: {
          document_id: number
        }
        Returns: undefined
      }
      replace_document_chunks: {
        Args: {
          chunks: Json
        }
        Returns: Json
      }
      set_document_status:
        | {
            Args: {
              doc_id: number
              s: string
            }
            Returns: undefined
          }
        | {
            Args: {
              doc_id: number
              s: Database["public"]["Enums"]["document_status_enum"]
            }
            Returns: undefined
          }
        | {
            Args: {
              s: string
            }
            Returns: undefined
          }
      update_document_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      document_status_enum: "Parsed" | "Parsing" | "Error"
      document_status_message:
        | "The document is currently being parsed"
        | "The document was fully parsed"
        | "An error occured while parsing the document"
        | "The document has an invalid file type"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
