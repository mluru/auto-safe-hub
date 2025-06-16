export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      claim_files: {
        Row: {
          claim_id: string
          file_category: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_at: string | null
        }
        Insert: {
          claim_id: string
          file_category: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_at?: string | null
        }
        Update: {
          claim_id?: string
          file_category?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_files_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          accident_date: string
          admin_notes: string | null
          approved_amount: number | null
          claim_number: string
          created_at: string | null
          description: string
          estimated_amount: number | null
          id: string
          policy_id: string
          status: string | null
          updated_at: string | null
          uploads: Json | null
          user_id: string
        }
        Insert: {
          accident_date: string
          admin_notes?: string | null
          approved_amount?: number | null
          claim_number: string
          created_at?: string | null
          description: string
          estimated_amount?: number | null
          id?: string
          policy_id: string
          status?: string | null
          updated_at?: string | null
          uploads?: Json | null
          user_id: string
        }
        Update: {
          accident_date?: string
          admin_notes?: string | null
          approved_amount?: number | null
          claim_number?: string
          created_at?: string | null
          description?: string
          estimated_amount?: number | null
          id?: string
          policy_id?: string
          status?: string | null
          updated_at?: string | null
          uploads?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          created_at: string
          description: string | null
          discounted_price: number | null
          id: string
          image: string | null
          name: string
          price: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discounted_price?: number | null
          id?: string
          image?: string | null
          name: string
          price: number
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discounted_price?: number | null
          id?: string
          image?: string | null
          name?: string
          price?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          order_id: string
          rate_premium: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          order_id: string
          rate_premium: number
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          order_id?: string
          rate_premium?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          delivery_address: string | null
          id: string
          order_number: string | null
          phone_number: string | null
          proof_of_payment: string | null
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivery_address?: string | null
          id?: string
          order_number?: string | null
          phone_number?: string | null
          proof_of_payment?: string | null
          status?: string
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivery_address?: string | null
          id?: string
          order_number?: string | null
          phone_number?: string | null
          proof_of_payment?: string | null
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_date: string
          payment_method: string
          plan_type: string
          policy_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_date: string
          payment_method: string
          plan_type: string
          policy_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_date?: string
          payment_method?: string
          plan_type?: string
          policy_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          chassis_number: string | null
          created_at: string | null
          energy_type: string | null
          engine_model: string | null
          engine_number: string | null
          expiry_date: string
          id: string
          order_id: string | null
          owner_address: string | null
          owner_email: string | null
          owner_info: Json | null
          owner_name: string | null
          owner_phone: string | null
          policy_number: string
          policy_type: string | null
          policy_type_id: string | null
          premium: number
          property_details: string | null
          renewable: boolean | null
          risk_location: string | null
          seating_capacity: number | null
          start_date: string
          status: string | null
          tonnage: number | null
          updated_at: string | null
          user_id: string
          vehicle_category: string | null
          vehicle_info: Json | null
          vehicle_make: string
          vehicle_model: string
          vehicle_reg_number: string
          vehicle_year: number
        }
        Insert: {
          chassis_number?: string | null
          created_at?: string | null
          energy_type?: string | null
          engine_model?: string | null
          engine_number?: string | null
          expiry_date: string
          id?: string
          order_id?: string | null
          owner_address?: string | null
          owner_email?: string | null
          owner_info?: Json | null
          owner_name?: string | null
          owner_phone?: string | null
          policy_number: string
          policy_type?: string | null
          policy_type_id?: string | null
          premium: number
          property_details?: string | null
          renewable?: boolean | null
          risk_location?: string | null
          seating_capacity?: number | null
          start_date: string
          status?: string | null
          tonnage?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_category?: string | null
          vehicle_info?: Json | null
          vehicle_make: string
          vehicle_model: string
          vehicle_reg_number: string
          vehicle_year: number
        }
        Update: {
          chassis_number?: string | null
          created_at?: string | null
          energy_type?: string | null
          engine_model?: string | null
          engine_number?: string | null
          expiry_date?: string
          id?: string
          order_id?: string | null
          owner_address?: string | null
          owner_email?: string | null
          owner_info?: Json | null
          owner_name?: string | null
          owner_phone?: string | null
          policy_number?: string
          policy_type?: string | null
          policy_type_id?: string | null
          premium?: number
          property_details?: string | null
          renewable?: boolean | null
          risk_location?: string | null
          seating_capacity?: number | null
          start_date?: string
          status?: string | null
          tonnage?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_category?: string | null
          vehicle_info?: Json | null
          vehicle_make?: string
          vehicle_model?: string
          vehicle_reg_number?: string
          vehicle_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "policies_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_policy_type_id_fkey"
            columns: ["policy_type_id"]
            isOneToOne: false
            referencedRelation: "policy_types"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_types: {
        Row: {
          active: boolean | null
          base_premium: number | null
          coverage_details: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          base_premium?: number | null
          coverage_details?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          base_premium?: number | null
          coverage_details?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_claim_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_policy_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
    }
    Enums: {
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["user", "admin"],
    },
  },
} as const
