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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          cover_image_url: string | null
          created_at: string
          currency: string
          description: string | null
          description_en: string | null
          id: string
          is_published: boolean
          is_subscription: boolean
          level: Database["public"]["Enums"]["cefr_level"]
          price_cents: number
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          description_en?: string | null
          id?: string
          is_published?: boolean
          is_subscription?: boolean
          level: Database["public"]["Enums"]["cefr_level"]
          price_cents?: number
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          description_en?: string | null
          id?: string
          is_published?: boolean
          is_subscription?: boolean
          level?: Database["public"]["Enums"]["cefr_level"]
          price_cents?: number
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string
          created_at: string
          id: string
          source: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          source?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          is_free_preview: boolean
          is_published: boolean
          module_id: string
          notes: string | null
          notes_en: string | null
          sort_order: number
          title: string
          title_en: string | null
          updated_at: string
          youtube_url: string | null
          youtube_video_id: string | null
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean
          is_published?: boolean
          module_id: string
          notes?: string | null
          notes_en?: string | null
          sort_order?: number
          title: string
          title_en?: string | null
          updated_at?: string
          youtube_url?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean
          is_published?: boolean
          module_id?: string
          notes?: string | null
          notes_en?: string | null
          sort_order?: number
          title?: string
          title_en?: string | null
          updated_at?: string
          youtube_url?: string | null
          youtube_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          description_en: string | null
          id: string
          sort_order: number
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          sort_order?: number
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          sort_order?: number
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          body: string
          body_en: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          is_published: boolean
          published_at: string
          slug: string
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          body: string
          body_en?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          published_at?: string
          slug: string
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          body_en?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          published_at?: string
          slug?: string
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          preferred_language: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          preferred_language?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      can_access_lesson: { Args: { _lesson_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lesson_catalog: {
        Args: { _course_id: string }
        Returns: {
          duration_minutes: number
          id: string
          is_free_preview: boolean
          module_id: string
          sort_order: number
          title: string
          title_en: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "student"
      cefr_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
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
      app_role: ["admin", "student"],
      cefr_level: ["A1", "A2", "B1", "B2", "C1", "C2"],
    },
  },
} as const
