import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log('Creating initial users...');

    // Create admin user
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@pousada.com',
      password: 'admin',
      email_confirm: true,
      user_metadata: {
        username: 'admin',
      },
    });

    if (adminError) {
      console.error('Error creating admin:', adminError);
    } else {
      console.log('Admin user created:', adminData.user?.id);
      
      // Update admin role
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', adminData.user.id);
      
      if (roleError) {
        console.error('Error updating admin role:', roleError);
      } else {
        console.log('Admin role updated successfully');
      }
    }

    // Create regular user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'user@pousada.com',
      password: 'user',
      email_confirm: true,
      user_metadata: {
        username: 'user',
      },
    });

    if (userError) {
      console.error('Error creating user:', userError);
    } else {
      console.log('Regular user created:', userData.user?.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuários iniciais criados com sucesso',
        admin: adminData?.user?.email,
        user: userData?.user?.email,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in setup-initial-users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
