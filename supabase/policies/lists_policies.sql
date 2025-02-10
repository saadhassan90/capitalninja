
-- Enable RLS
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting lists
CREATE POLICY "Users can view their own lists" ON public.lists
  FOR SELECT
  USING (auth.uid() = created_by);

-- Create policy for inserting lists
CREATE POLICY "Users can create lists" ON public.lists
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Create policy for updating lists
CREATE POLICY "Users can update their own lists" ON public.lists
  FOR UPDATE
  USING (auth.uid() = created_by);

-- Create policy for deleting lists
CREATE POLICY "Users can delete their own lists" ON public.lists
  FOR DELETE
  USING (auth.uid() = created_by);
