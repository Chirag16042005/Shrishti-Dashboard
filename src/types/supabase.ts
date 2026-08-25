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
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          company_name: string | null
          theme: string | null
          notifications_enabled: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          company_name?: string | null
          theme?: string | null
          notifications_enabled?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          company_name?: string | null
          theme?: string | null
          notifications_enabled?: boolean
        }
      }
      clients: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          company: string | null
          email: string | null
          phone: string | null
          gst: string | null
          address: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          company?: string | null
          email?: string | null
          phone?: string | null
          gst?: string | null
          address?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          company?: string | null
          email?: string | null
          phone?: string | null
          gst?: string | null
          address?: string | null
          notes?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          client_id: string
          brand_name: string | null
          service: string
          description: string | null
          status: 'Planning' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled'
          start_date: string | null
          end_date: string | null
          project_value: number
          amount_received: number
          priority: 'Low' | 'Medium' | 'High'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          client_id: string
          brand_name?: string | null
          service: string
          description?: string | null
          status?: 'Planning' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled'
          start_date?: string | null
          end_date?: string | null
          project_value?: number
          amount_received?: number
          priority?: 'Low' | 'Medium' | 'High'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          client_id?: string
          brand_name?: string | null
          service?: string
          description?: string | null
          status?: 'Planning' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled'
          start_date?: string | null
          end_date?: string | null
          project_value?: number
          amount_received?: number
          priority?: 'Low' | 'Medium' | 'High'
          notes?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          project_id: string
          amount: number
          payment_date: string
          status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          project_id: string
          amount: number
          payment_date?: string
          status?: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid'
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          project_id?: string
          amount?: number
          payment_date?: string
          status?: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid'
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
