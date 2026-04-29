-- Add UPDATE policy to opening_progress so upsert() can resolve conflicts.
-- Without this, POST/PUT calls fail when a row with the same
-- (user_id, opening_slug, lesson_id) already exists.

CREATE POLICY "Users can update own opening progress"
  ON public.opening_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
