export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_forecasts: {
        Row: {
          category: string | null
          collection_id: string | null
          confidence_score: number | null
          created_at: string | null
          forecast_basis: string | null
          generated_by_model: string | null
          id: string
          predicted_demand_units: number | null
          season_insights: string | null
        }
        Insert: {
          category?: string | null
          collection_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          forecast_basis?: string | null
          generated_by_model?: string | null
          id?: string
          predicted_demand_units?: number | null
          season_insights?: string | null
        }
        Update: {
          category?: string | null
          collection_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          forecast_basis?: string | null
          generated_by_model?: string | null
          id?: string
          predicted_demand_units?: number | null
          season_insights?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_forecasts_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_stages: {
        Row: {
          comments: string | null
          created_at: string | null
          decision: string | null
          design_id: string
          id: string
          reviewed_at: string | null
          reviewer_id: string | null
          stage_name: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          decision?: string | null
          design_id: string
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          stage_name?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          decision?: string | null
          design_id?: string
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          stage_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_stages_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_stages_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bom_items: {
        Row: {
          created_at: string | null
          id: string
          is_available: boolean | null
          material_name: string | null
          material_type: string | null
          production_order_id: string
          quantity_available: number | null
          quantity_required: number | null
          supplier_name: string | null
          unit: string | null
          unit_cost: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          material_name?: string | null
          material_type?: string | null
          production_order_id: string
          quantity_available?: number | null
          quantity_required?: number | null
          supplier_name?: string | null
          unit?: string | null
          unit_cost?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          material_name?: string | null
          material_type?: string | null
          production_order_id?: string
          quantity_available?: number | null
          quantity_required?: number | null
          supplier_name?: string | null
          unit?: string | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bom_items_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          asset_urls: string[] | null
          budget: number | null
          campaign_type: string | null
          channels: string[] | null
          collection_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          asset_urls?: string[] | null
          budget?: number | null
          campaign_type?: string | null
          channels?: string[] | null
          collection_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          asset_urls?: string[] | null
          budget?: number | null
          campaign_type?: string | null
          channels?: string[] | null
          collection_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          actual_launch_date: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          season: string | null
          status: string | null
          target_launch_date: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          actual_launch_date?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          season?: string | null
          status?: string | null
          target_launch_date?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          actual_launch_date?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          season?: string | null
          status?: string | null
          target_launch_date?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      designs: {
        Row: {
          ai_prompt: string | null
          approval_status: string | null
          approved_at: string | null
          category: string | null
          collection_id: string | null
          created_at: string | null
          description: string | null
          designer_id: string | null
          file_url: string | null
          id: string
          is_ai_generated: boolean | null
          product_copy: Json | null
          rejection_reason: string | null
          sku_code: string | null
          synced_at: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          version_number: number | null
          website_sync_status: string | null
        }
        Insert: {
          ai_prompt?: string | null
          approval_status?: string | null
          approved_at?: string | null
          category?: string | null
          collection_id?: string | null
          created_at?: string | null
          description?: string | null
          designer_id?: string | null
          file_url?: string | null
          id?: string
          is_ai_generated?: boolean | null
          product_copy?: Json | null
          rejection_reason?: string | null
          sku_code?: string | null
          synced_at?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          version_number?: number | null
          website_sync_status?: string | null
        }
        Update: {
          ai_prompt?: string | null
          approval_status?: string | null
          approved_at?: string | null
          category?: string | null
          collection_id?: string | null
          created_at?: string | null
          description?: string | null
          designer_id?: string | null
          file_url?: string | null
          id?: string
          is_ai_generated?: boolean | null
          product_copy?: Json | null
          rejection_reason?: string | null
          sku_code?: string | null
          synced_at?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          version_number?: number | null
          website_sync_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designs_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "designs_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      distributor_orders: {
        Row: {
          actual_delivery: string | null
          created_at: string | null
          design_id: string | null
          distributor_id: string
          expected_delivery: string | null
          id: string
          notes: string | null
          order_date: string | null
          order_number: string | null
          quantity_delivered: number | null
          quantity_ordered: number | null
          shipping_address: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery?: string | null
          created_at?: string | null
          design_id?: string | null
          distributor_id: string
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number?: string | null
          quantity_delivered?: number | null
          quantity_ordered?: number | null
          shipping_address?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery?: string | null
          created_at?: string | null
          design_id?: string | null
          distributor_id?: string
          expected_delivery?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number?: string | null
          quantity_delivered?: number | null
          quantity_ordered?: number | null
          shipping_address?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distributor_orders_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distributor_orders_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          collection_id: string | null
          content: string | null
          created_at: string | null
          id: string
          sender_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          collection_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          sender_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          collection_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          related_id: string | null
          related_table: string | null
          title: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          related_id?: string | null
          related_table?: string | null
          title?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          related_id?: string | null
          related_table?: string | null
          title?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      production_orders: {
        Row: {
          completion_percentage: number | null
          created_at: string | null
          current_stage: string | null
          delay_flag: boolean | null
          delay_reason: string | null
          design_id: string | null
          due_date: string | null
          factory_id: string | null
          id: string
          notes: string | null
          order_number: string | null
          priority: string | null
          quantity: number | null
          updated_at: string | null
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string | null
          current_stage?: string | null
          delay_flag?: boolean | null
          delay_reason?: string | null
          design_id?: string | null
          due_date?: string | null
          factory_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string | null
          priority?: string | null
          quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string | null
          current_stage?: string | null
          delay_flag?: boolean | null
          delay_reason?: string | null
          design_id?: string | null
          due_date?: string | null
          factory_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string | null
          priority?: string | null
          quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_orders_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_profile_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_marketing_manager: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "marketing_manager"
        | "designer"
        | "factory"
        | "distributor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "marketing_manager",
        "designer",
        "factory",
        "distributor",
      ],
    },
  },
} as const
