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
      direct_investments: {
        Row: {
          company_name: string | null
          deal_date: string | null
          deal_size: number | null
          limited_partner_id: number
        }
        Insert: {
          company_name?: string | null
          deal_date?: string | null
          deal_size?: number | null
          limited_partner_id: number
        }
        Update: {
          company_name?: string | null
          deal_date?: string | null
          deal_size?: number | null
          limited_partner_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_di_lp"
            columns: ["limited_partner_id"]
            isOneToOne: false
            referencedRelation: "limited_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_commitments: {
        Row: {
          commitment: number | null
          commitment_date: string | null
          fund_id: number | null
          fund_name: string | null
          limited_partner_id: number
        }
        Insert: {
          commitment?: number | null
          commitment_date?: string | null
          fund_id?: number | null
          fund_name?: string | null
          limited_partner_id: number
        }
        Update: {
          commitment?: number | null
          commitment_date?: string | null
          fund_id?: number | null
          fund_name?: string | null
          limited_partner_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_fc_lp"
            columns: ["limited_partner_id"]
            isOneToOne: false
            referencedRelation: "limited_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      limited_partners: {
        Row: {
          allocation_to_alternative_investments: number | null
          allocation_to_alternative_investments_percent: number | null
          aum: number | null
          cash: number | null
          cash_percent: number | null
          description: string | null
          direct_investments: number | null
          equities: number | null
          equities_percent: number | null
          fixed_income: number | null
          fixed_income_percent: number | null
          hedge_funds: number | null
          hedge_funds_percent: number | null
          hqaddress_line1: string | null
          hqaddress_line2: string | null
          hqcity: string | null
          hqcountry: string | null
          hqemail: string | null
          hqlocation: string | null
          hqphone: string | null
          hqpost_code: string | null
          hqstate_province: string | null
          id: number
          limited_partner_also_known_as: string | null
          limited_partner_former_name: string | null
          limited_partner_name: string
          limited_partner_type: string | null
          number_of_affiliated_funds: number | null
          number_of_affiliated_investors: number | null
          open_to_first_time_funds: string | null
          policy_description: string | null
          preferred_commitment_size_max: number | null
          preferred_commitment_size_min: number | null
          preferred_direct_investment_size_max: number | null
          preferred_direct_investment_size_min: number | null
          preferred_fund_type: string | null
          preferred_geography: string | null
          primary_contact: string | null
          primary_contact_email: string | null
          primary_contact_pbid: string | null
          primary_contact_phone: string | null
          primary_contact_title: string | null
          private_equity: number | null
          private_equity_percent: number | null
          real_estate: number | null
          real_estate_percent: number | null
          special_opportunities: number | null
          special_opportunities_percent: number | null
          target_alternatives_max: number | null
          target_alternatives_min: number | null
          target_private_equity_max: number | null
          target_private_equity_min: number | null
          target_real_estate_max: number | null
          target_real_estate_min: number | null
          target_special_opportunities_max: number | null
          target_special_opportunities_min: number | null
          total_commitments_in_debt_funds: number | null
          total_commitments_in_energy_funds: number | null
          total_commitments_in_fofs_and2nd: number | null
          total_commitments_in_infrastructure: number | null
          total_commitments_in_other_funds: number | null
          total_commitments_in_pefunds: number | null
          total_commitments_in_refunds: number | null
          total_commitments_in_vcfunds: number | null
          website: string | null
          year_founded: number | null
        }
        Insert: {
          allocation_to_alternative_investments?: number | null
          allocation_to_alternative_investments_percent?: number | null
          aum?: number | null
          cash?: number | null
          cash_percent?: number | null
          description?: string | null
          direct_investments?: number | null
          equities?: number | null
          equities_percent?: number | null
          fixed_income?: number | null
          fixed_income_percent?: number | null
          hedge_funds?: number | null
          hedge_funds_percent?: number | null
          hqaddress_line1?: string | null
          hqaddress_line2?: string | null
          hqcity?: string | null
          hqcountry?: string | null
          hqemail?: string | null
          hqlocation?: string | null
          hqphone?: string | null
          hqpost_code?: string | null
          hqstate_province?: string | null
          id: number
          limited_partner_also_known_as?: string | null
          limited_partner_former_name?: string | null
          limited_partner_name: string
          limited_partner_type?: string | null
          number_of_affiliated_funds?: number | null
          number_of_affiliated_investors?: number | null
          open_to_first_time_funds?: string | null
          policy_description?: string | null
          preferred_commitment_size_max?: number | null
          preferred_commitment_size_min?: number | null
          preferred_direct_investment_size_max?: number | null
          preferred_direct_investment_size_min?: number | null
          preferred_fund_type?: string | null
          preferred_geography?: string | null
          primary_contact?: string | null
          primary_contact_email?: string | null
          primary_contact_pbid?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          private_equity?: number | null
          private_equity_percent?: number | null
          real_estate?: number | null
          real_estate_percent?: number | null
          special_opportunities?: number | null
          special_opportunities_percent?: number | null
          target_alternatives_max?: number | null
          target_alternatives_min?: number | null
          target_private_equity_max?: number | null
          target_private_equity_min?: number | null
          target_real_estate_max?: number | null
          target_real_estate_min?: number | null
          target_special_opportunities_max?: number | null
          target_special_opportunities_min?: number | null
          total_commitments_in_debt_funds?: number | null
          total_commitments_in_energy_funds?: number | null
          total_commitments_in_fofs_and2nd?: number | null
          total_commitments_in_infrastructure?: number | null
          total_commitments_in_other_funds?: number | null
          total_commitments_in_pefunds?: number | null
          total_commitments_in_refunds?: number | null
          total_commitments_in_vcfunds?: number | null
          website?: string | null
          year_founded?: number | null
        }
        Update: {
          allocation_to_alternative_investments?: number | null
          allocation_to_alternative_investments_percent?: number | null
          aum?: number | null
          cash?: number | null
          cash_percent?: number | null
          description?: string | null
          direct_investments?: number | null
          equities?: number | null
          equities_percent?: number | null
          fixed_income?: number | null
          fixed_income_percent?: number | null
          hedge_funds?: number | null
          hedge_funds_percent?: number | null
          hqaddress_line1?: string | null
          hqaddress_line2?: string | null
          hqcity?: string | null
          hqcountry?: string | null
          hqemail?: string | null
          hqlocation?: string | null
          hqphone?: string | null
          hqpost_code?: string | null
          hqstate_province?: string | null
          id?: number
          limited_partner_also_known_as?: string | null
          limited_partner_former_name?: string | null
          limited_partner_name?: string
          limited_partner_type?: string | null
          number_of_affiliated_funds?: number | null
          number_of_affiliated_investors?: number | null
          open_to_first_time_funds?: string | null
          policy_description?: string | null
          preferred_commitment_size_max?: number | null
          preferred_commitment_size_min?: number | null
          preferred_direct_investment_size_max?: number | null
          preferred_direct_investment_size_min?: number | null
          preferred_fund_type?: string | null
          preferred_geography?: string | null
          primary_contact?: string | null
          primary_contact_email?: string | null
          primary_contact_pbid?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          private_equity?: number | null
          private_equity_percent?: number | null
          real_estate?: number | null
          real_estate_percent?: number | null
          special_opportunities?: number | null
          special_opportunities_percent?: number | null
          target_alternatives_max?: number | null
          target_alternatives_min?: number | null
          target_private_equity_max?: number | null
          target_private_equity_min?: number | null
          target_real_estate_max?: number | null
          target_real_estate_min?: number | null
          target_special_opportunities_max?: number | null
          target_special_opportunities_min?: number | null
          total_commitments_in_debt_funds?: number | null
          total_commitments_in_energy_funds?: number | null
          total_commitments_in_fofs_and2nd?: number | null
          total_commitments_in_infrastructure?: number | null
          total_commitments_in_other_funds?: number | null
          total_commitments_in_pefunds?: number | null
          total_commitments_in_refunds?: number | null
          total_commitments_in_vcfunds?: number | null
          website?: string | null
          year_founded?: number | null
        }
        Relationships: []
      }
      list_investors: {
        Row: {
          created_at: string
          investor_id: number
          list_id: string
        }
        Insert: {
          created_at?: string
          investor_id: number
          list_id: string
        }
        Update: {
          created_at?: string
          investor_id?: number
          list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_investors_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "limited_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_investors_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
