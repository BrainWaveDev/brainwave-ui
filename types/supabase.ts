export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
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
          prompt_id: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          folder_id?: number | null
          id?: number
          model?: string | null
          name?: string
          prompt_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          folder_id?: number | null
          id?: number
          model?: string | null
          name?: string
          prompt_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_folder_id_fkey"
            columns: ["folder_id"]
            referencedRelation: "folder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_prompt_id_fkey"
            columns: ["prompt_id"]
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "document_object_id_fkey"
            columns: ["object_id"]
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "document_chunk_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "document"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "folder_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          tier: number | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          tier?: number | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          tier?: number | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prompt: {
        Row: {
          content: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          content: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          content?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      system_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
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
      count_messages: {
        Args: {
          p_user_id: string
          p_target_time: string
        }
        Returns: number
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
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
