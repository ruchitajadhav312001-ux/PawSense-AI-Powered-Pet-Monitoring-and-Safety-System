import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://qyueeehoutkcujqkxicg.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dWVlZWhvdXRrY3VqcWt4aWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzUxODEsImV4cCI6MjA4Mjg1MTE4MX0._nvw-d3p_Rh6zTTJa3rgR_ae3STcCZPRkn8CfMYCdXk"
);
