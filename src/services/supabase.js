
import { createClient } from '@supabase/supabase-js'
export const supabaseUrl = 'https://pfqftttjuxrgmsbpmfsf.supabase.co'
const supabaseKey = "sb_publishable_yTq1IDuR6xjowszRMtQ9ug_QtaGyLX2"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;