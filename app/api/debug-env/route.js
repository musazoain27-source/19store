import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return NextResponse.json({
    supabaseUrlIsSet: !!url,
    supabaseUrlPreview: url ? url.slice(0, 30) + '...' : '(not set)',
    supabaseUrlHasRestPath: url.includes('/rest/'),
    serviceRoleKeyIsSet: !!key,
    serviceRoleKeyLength: key.length,
    serviceRoleKeyPreview: key ? key.slice(0, 12) + '...' : '(not set)',
    willUseSupabase: !!(url && key),
    nodeEnv: process.env.NODE_ENV,
  });
}
