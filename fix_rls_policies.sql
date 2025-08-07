-- Add INSERT policies for both tables
CREATE POLICY "Allow public insert access" ON public.competitors
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert access" ON public.my_place
    FOR INSERT WITH CHECK (true);

-- Also add UPDATE and DELETE policies just in case
CREATE POLICY "Allow public update access" ON public.competitors
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON public.competitors
    FOR DELETE USING (true);

CREATE POLICY "Allow public update access" ON public.my_place
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON public.my_place
    FOR DELETE USING (true);