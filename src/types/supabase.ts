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
            activities: {
                Row: {
                    config: Json | null
                    created_at: string | null
                    id: string
                    teacher_id: string
                    title: string
                    type: string
                }
                Insert: {
                    config?: Json | null
                    created_at?: string | null
                    id?: string
                    teacher_id: string
                    title: string
                    type: string
                }
                Update: {
                    config?: Json | null
                    created_at?: string | null
                    id?: string
                    teacher_id?: string
                    title?: string
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "activities_teacher_id_fkey"
                        columns: ["teacher_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            assignments: {
                Row: {
                    activity_id: string
                    assigned_at: string | null
                    completed_at: string | null
                    id: string
                    result_data: Json | null
                    status: string | null
                    student_id: string
                }
                Insert: {
                    activity_id: string
                    assigned_at?: string | null
                    completed_at?: string | null
                    id?: string
                    result_data?: Json | null
                    status?: string | null
                    student_id: string
                }
                Update: {
                    activity_id?: string
                    assigned_at?: string | null
                    completed_at?: string | null
                    id?: string
                    result_data?: Json | null
                    status?: string | null
                    student_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "assignments_activity_id_fkey"
                        columns: ["activity_id"]
                        isOneToOne: false
                        referencedRelation: "activities"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "assignments_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "students"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    full_name: string | null
                    id: string
                    role: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    full_name?: string | null
                    id: string
                    role?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    full_name?: string | null
                    id?: string
                    role?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            students: {
                Row: {
                    created_at: string | null
                    experimental_uuid: string | null
                    id: string
                    level: string | null
                    name: string
                    student_id: string | null
                    teacher_id: string
                    language: string | null
                    metadata: Json | null
                }
                Insert: {
                    created_at?: string | null
                    experimental_uuid?: string | null
                    id?: string
                    level?: string | null
                    name: string
                    student_id?: string | null
                    teacher_id: string
                    language?: string | null
                    metadata?: Json | null
                }
                Update: {
                    created_at?: string | null
                    experimental_uuid?: string | null
                    id?: string
                    level?: string | null
                    name?: string
                    student_id?: string | null
                    teacher_id?: string
                    language?: string | null
                    metadata?: Json | null
                }
                Relationships: [
                    {
                        foreignKeyName: "students_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "students_teacher_id_fkey"
                        columns: ["teacher_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            appointments: {
                Row: {
                    id: string
                    created_at: string | null
                    teacher_id: string
                    student_id: string | null
                    title: string
                    description: string | null
                    start_time: string
                    end_time: string
                    color: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string | null
                    teacher_id: string
                    student_id?: string | null
                    title: string
                    description?: string | null
                    start_time: string
                    end_time: string
                    color?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string | null
                    teacher_id?: string
                    student_id?: string | null
                    title?: string
                    description?: string | null
                    start_time?: string
                    end_time?: string
                    color?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "appointments_teacher_id_fkey"
                        columns: ["teacher_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "appointments_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "students"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            activity_status: "pending" | "in_progress" | "completed"
            user_role: "teacher" | "student"
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
            activity_status: ["pending", "in_progress", "completed"],
            user_role: ["teacher", "student"],
        },
    },
} as const
