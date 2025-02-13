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
      activity_logs: {
        Row: {
          action_type: string
          created_at: string
          description: string
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          description: string
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          changes: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          admin_id: string
          changes?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["admin_role"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
        }
        Relationships: []
      }
      campaign_logs: {
        Row: {
          campaign_id: string
          error_message: string | null
          id: string
          investor_id: number
          sent_at: string
          status: string
        }
        Insert: {
          campaign_id: string
          error_message?: string | null
          id?: string
          investor_id: number
          sent_at?: string
          status: string
        }
        Update: {
          campaign_id?: string
          error_message?: string | null
          id?: string
          investor_id?: number
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_logs_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "limited_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          failed_sends: number | null
          id: string
          list_id: string | null
          name: string
          raise_id: string | null
          scheduled_for: string | null
          sent_at: string | null
          source_list_id: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          subject: string
          successful_sends: number | null
          total_recipients: number | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          failed_sends?: number | null
          id?: string
          list_id?: string | null
          name: string
          raise_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          source_list_id?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subject: string
          successful_sends?: number | null
          total_recipients?: number | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          failed_sends?: number | null
          id?: string
          list_id?: string | null
          name?: string
          raise_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          source_list_id?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          subject?: string
          successful_sends?: number | null
          total_recipients?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_raise_id_fkey"
            columns: ["raise_id"]
            isOneToOne: false
            referencedRelation: "raises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_source_list_id_fkey"
            columns: ["source_list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
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
      email_accounts: {
        Row: {
          created_at: string | null
          daily_limit: number | null
          domain_id: string
          email: string
          id: string
          instantly_account_id: string | null
          status: string
          updated_at: string | null
          user_id: string
          warmup_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          daily_limit?: number | null
          domain_id: string
          email: string
          id?: string
          instantly_account_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          warmup_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          daily_limit?: number | null
          domain_id?: string
          email?: string
          id?: string
          instantly_account_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          warmup_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "email_accounts_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "email_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      email_domains: {
        Row: {
          created_at: string | null
          domain_name: string
          id: string
          instantly_domain_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          domain_name: string
          id?: string
          instantly_domain_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          domain_name?: string
          id?: string
          instantly_domain_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      exports: {
        Row: {
          created_at: string
          created_by: string | null
          file_path: string | null
          id: string
          name: string
          records: number | null
          status: string
          team_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_path?: string | null
          id?: string
          name: string
          records?: number | null
          status?: string
          team_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_path?: string | null
          id?: string
          name?: string
          records?: number | null
          status?: string
          team_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exports_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_members"
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
      instantly_integrations: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      instantly_settings: {
        Row: {
          agency_email: string
          api_key: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          agency_email: string
          api_key: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          agency_email?: string
          api_key?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      investor_contacts: {
        Row: {
          company_id: number
          created_at: string
          email: string | null
          first_name: string
          id: string
          is_primary_contact: boolean | null
          last_name: string
          linkedin_url: string | null
          notes: string | null
          phone: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          company_id: number
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          is_primary_contact?: boolean | null
          last_name: string
          linkedin_url?: string | null
          notes?: string | null
          phone?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: number
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          is_primary_contact?: boolean | null
          last_name?: string
          linkedin_url?: string | null
          notes?: string | null
          phone?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_contacts_company_id_fkey"
            columns: ["company_id"]
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
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          type?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      master_leads: {
        Row: {
          company_name: string
          confidence_score: number | null
          created_at: string
          enriched_data: Json | null
          id: string
          last_validated_at: string | null
          matched_fields: Json | null
          matched_limited_partner_id: number | null
          matching_method: string | null
          original_upload_id: string | null
          raw_data: Json
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          company_name: string
          confidence_score?: number | null
          created_at?: string
          enriched_data?: Json | null
          id?: string
          last_validated_at?: string | null
          matched_fields?: Json | null
          matched_limited_partner_id?: number | null
          matching_method?: string | null
          original_upload_id?: string | null
          raw_data: Json
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          company_name?: string
          confidence_score?: number | null
          created_at?: string
          enriched_data?: Json | null
          id?: string
          last_validated_at?: string | null
          matched_fields?: Json | null
          matched_limited_partner_id?: number | null
          matching_method?: string | null
          original_upload_id?: string | null
          raw_data?: Json
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_leads_matched_limited_partner_id_fkey"
            columns: ["matched_limited_partner_id"]
            isOneToOne: false
            referencedRelation: "limited_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "master_leads_original_upload_id_fkey"
            columns: ["original_upload_id"]
            isOneToOne: false
            referencedRelation: "user_uploaded_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          investor_updates: boolean | null
          marketing_updates: boolean | null
          security_alerts: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          investor_updates?: boolean | null
          marketing_updates?: boolean | null
          security_alerts?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          investor_updates?: boolean | null
          marketing_updates?: boolean | null
          security_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company_description: string | null
          company_name: string | null
          company_website: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          invited_by_team_id: string | null
          last_name: string | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          raising_amount: number | null
          raising_description: string | null
          raising_stage: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company_description?: string | null
          company_name?: string | null
          company_website?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          invited_by_team_id?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          raising_amount?: number | null
          raising_description?: string | null
          raising_stage?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company_description?: string | null
          company_name?: string | null
          company_website?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          invited_by_team_id?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          raising_amount?: number | null
          raising_description?: string | null
          raising_stage?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_invited_by_team_id_fkey"
            columns: ["invited_by_team_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      raise_equity: {
        Row: {
          additional_fees: string | null
          asset_classes: Database["public"]["Enums"]["asset_class_type"][]
          asset_management_fee: number | null
          asset_management_fees_type: string | null
          audience: string[]
          banner: string | null
          capital_stack: string[]
          carried_interest: number | null
          city: string
          close_date: string | null
          company_contact: string | null
          contact_email: string
          country: string
          created_at: string | null
          domicile: string | null
          economic_drivers: string[] | null
          equity_multiple: number | null
          first_close: string | null
          gp_capital: number | null
          id: string
          investment_type: string
          irr_projections: number | null
          memo: string | null
          minimum_ticket_size: number
          preferred_returns_hurdle: number | null
          primary_contact: string
          raise_description: string
          raise_name: string
          raise_open_date: string | null
          raise_stage: string
          reups: number | null
          risks: string[] | null
          state: string
          strategy: string[] | null
          target_raise: number
          tax_incentives: string | null
          term_lockup: number | null
          user_id: string
        }
        Insert: {
          additional_fees?: string | null
          asset_classes: Database["public"]["Enums"]["asset_class_type"][]
          asset_management_fee?: number | null
          asset_management_fees_type?: string | null
          audience: string[]
          banner?: string | null
          capital_stack: string[]
          carried_interest?: number | null
          city: string
          close_date?: string | null
          company_contact?: string | null
          contact_email: string
          country: string
          created_at?: string | null
          domicile?: string | null
          economic_drivers?: string[] | null
          equity_multiple?: number | null
          first_close?: string | null
          gp_capital?: number | null
          id?: string
          investment_type: string
          irr_projections?: number | null
          memo?: string | null
          minimum_ticket_size: number
          preferred_returns_hurdle?: number | null
          primary_contact: string
          raise_description: string
          raise_name: string
          raise_open_date?: string | null
          raise_stage: string
          reups?: number | null
          risks?: string[] | null
          state: string
          strategy?: string[] | null
          target_raise: number
          tax_incentives?: string | null
          term_lockup?: number | null
          user_id: string
        }
        Update: {
          additional_fees?: string | null
          asset_classes?: Database["public"]["Enums"]["asset_class_type"][]
          asset_management_fee?: number | null
          asset_management_fees_type?: string | null
          audience?: string[]
          banner?: string | null
          capital_stack?: string[]
          carried_interest?: number | null
          city?: string
          close_date?: string | null
          company_contact?: string | null
          contact_email?: string
          country?: string
          created_at?: string | null
          domicile?: string | null
          economic_drivers?: string[] | null
          equity_multiple?: number | null
          first_close?: string | null
          gp_capital?: number | null
          id?: string
          investment_type?: string
          irr_projections?: number | null
          memo?: string | null
          minimum_ticket_size?: number
          preferred_returns_hurdle?: number | null
          primary_contact?: string
          raise_description?: string
          raise_name?: string
          raise_open_date?: string | null
          raise_stage?: string
          reups?: number | null
          risks?: string[] | null
          state?: string
          strategy?: string[] | null
          target_raise?: number
          tax_incentives?: string | null
          term_lockup?: number | null
          user_id?: string
        }
        Relationships: []
      }
      raises: {
        Row: {
          category: Database["public"]["Enums"]["investment_category"]
          created_at: string
          description: string | null
          id: string
          memo: string | null
          name: string
          pitch_deck_url: string | null
          status: string | null
          target_amount: number | null
          type: Database["public"]["Enums"]["raise_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["investment_category"]
          created_at?: string
          description?: string | null
          id?: string
          memo?: string | null
          name: string
          pitch_deck_url?: string | null
          status?: string | null
          target_amount?: number | null
          type: Database["public"]["Enums"]["raise_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["investment_category"]
          created_at?: string
          description?: string | null
          id?: string
          memo?: string | null
          name?: string
          pitch_deck_url?: string | null
          status?: string | null
          target_amount?: number | null
          type?: Database["public"]["Enums"]["raise_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      request_logs: {
        Row: {
          client_ip: string
          id: number
          request_time: string | null
        }
        Insert: {
          client_ip: string
          id?: number
          request_time?: string | null
        }
        Update: {
          client_ip?: string
          id?: number
          request_time?: string | null
        }
        Relationships: []
      }
      team_export_limits: {
        Row: {
          created_at: string
          id: string
          monthly_limit: number
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          monthly_limit?: number
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          monthly_limit?: number
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_export_limits_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          role: string
          status: string
          team_member_id: string | null
          token: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          role: string
          status?: string
          team_member_id?: string | null
          token?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          role?: string
          status?: string
          team_member_id?: string | null
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_members_profiles"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_active: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_active?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_active?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_uploaded_leads: {
        Row: {
          column_mapping: Json | null
          created_at: string
          error_message: string | null
          id: string
          matched_rows: number | null
          original_filename: string
          processed_status: string | null
          raw_data: Json
          total_rows: number | null
          upload_date: string
          user_id: string
        }
        Insert: {
          column_mapping?: Json | null
          created_at?: string
          error_message?: string | null
          id?: string
          matched_rows?: number | null
          original_filename: string
          processed_status?: string | null
          raw_data: Json
          total_rows?: number | null
          upload_date?: string
          user_id: string
        }
        Update: {
          column_mapping?: Json | null
          created_at?: string
          error_message?: string | null
          id?: string
          matched_rows?: number | null
          original_filename?: string
          processed_status?: string | null
          raw_data?: Json
          total_rows?: number | null
          upload_date?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_company_similarity: {
        Args: {
          name1: string
          name2: string
        }
        Returns: number
      }
      check_admin_status: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          user_ip: string
          rate_limit_seconds?: number
          max_requests?: number
        }
        Returns: boolean
      }
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
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_team_member: {
        Args: {
          user_id: string
        }
        Returns: boolean
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
      admin_role: "super_admin" | "admin" | "support"
      asset_class_type:
        | "Real Estate"
        | "Private Equity"
        | "Private Credit"
        | "Energy"
        | "Infrastructure"
        | "Venture Capital"
        | "Startups"
        | "Other"
        | "Fund of Funds"
        | "Special Opportunities"
        | "Private Debt"
        | "Natural Resources"
        | "Secondaries"
        | "Co-Investment"
        | "Impact Investing"
      campaign_status:
        | "draft"
        | "scheduled"
        | "sending"
        | "completed"
        | "failed"
      geographic_region_type:
        | "North America - US"
        | "North America - Canada"
        | "North America - Mexico"
        | "North America - Caribbean"
        | "Europe - UK"
        | "Europe - Western"
        | "Europe - Eastern"
        | "Europe - Nordic"
        | "MENA - GCC"
        | "MENA - North Africa"
        | "MENA - Levant"
        | "Africa - Sub-Saharan"
        | "Asia - East Asia"
        | "Asia - South Asia"
        | "Asia - Southeast Asia"
        | "Asia - Central Asia"
        | "South America - Brazil"
        | "South America - Southern Cone"
        | "South America - Andean"
        | "Other - Pacific"
        | "Other - Global"
      investment_category: "fund_direct_deal" | "startup"
      raise_type: "equity" | "debt"
      subscription_plan: "free" | "basic" | "outreach" | "enterprise"
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
