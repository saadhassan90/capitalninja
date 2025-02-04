import { supabase } from "@/integrations/supabase/client";
import { RaiseFormData } from "../types/raiseTypes";
import { toast } from "sonner";
import { generateDealMemo } from "./dealMemoService";

export async function submitRaiseForm(formData: RaiseFormData, userId: string) {
  const insertData = {
    additional_fees: formData.additional_fees || null,
    asset_classes: formData.asset_classes || [],
    asset_management_fee: formData.asset_management_fee ? parseFloat(formData.asset_management_fee) : null,
    asset_management_fees_type: formData.asset_management_fees_type || null,
    audience: formData.audience || [],
    banner: formData.banner || null,
    capital_stack: formData.capital_stack || [],
    carried_interest: formData.carried_interest ? parseFloat(formData.carried_interest) : null,
    company_contact: formData.company_contact || null,
    contact_email: formData.contact_email,
    city: formData.city,
    state: formData.state,
    country: formData.country,
    domicile: formData.domicile || null,
    economic_drivers: formData.economic_drivers || [],
    equity_multiple: formData.equity_multiple ? parseFloat(formData.equity_multiple) : null,
    gp_capital: formData.gp_capital ? parseFloat(formData.gp_capital) : null,
    investment_type: formData.investment_type,
    irr_projections: formData.irr_projections ? parseFloat(formData.irr_projections) : null,
    minimum_ticket_size: formData.minimum_ticket_size ? parseFloat(formData.minimum_ticket_size) : 0,
    preferred_returns_hurdle: formData.preferred_returns_hurdle ? parseFloat(formData.preferred_returns_hurdle) : null,
    primary_contact: formData.primary_contact,
    raise_description: formData.raise_description,
    raise_name: formData.raise_name,
    raise_stage: formData.raise_stage || "Initial",
    reups: formData.reups ? parseInt(formData.reups) : null,
    risks: formData.risks || [],
    strategy: formData.strategy || [],
    target_raise: formData.target_raise ? parseFloat(formData.target_raise) : 0,
    tax_incentives: formData.tax_incentives || null,
    term_lockup: formData.term_lockup ? parseInt(formData.term_lockup) : null,
    user_id: userId
  };

  const { data: raise, error: raiseError } = await supabase
    .from('raise_equity')
    .insert(insertData)
    .select()
    .single();

  if (raiseError) throw raiseError;

  const raisesData = {
    user_id: userId,
    type: formData.type as "equity" | "debt",
    category: formData.category as "fund_direct_deal" | "startup",
    name: formData.raise_name,
    description: formData.raise_description,
    target_amount: parseFloat(formData.target_raise),
    status: 'active' as const
  };

  const { error: raisesError } = await supabase
    .from('raises')
    .insert(raisesData);

  if (raisesError) throw raisesError;

  try {
    const memo = await generateDealMemo(raise);
    if (memo) {
      const { error: updateError } = await supabase
        .from('raise_equity')
        .update({ memo })
        .eq('id', raise.id);

      if (updateError) throw updateError;
    }
  } catch (memoError) {
    console.error('Error with memo generation:', memoError);
  }

  return raise;
}