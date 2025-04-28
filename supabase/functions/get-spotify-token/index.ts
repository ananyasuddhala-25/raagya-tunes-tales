
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SPOTIFY_CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID") || "dd8b5d00327b4d4f802137f8c306fd53";
const SPOTIFY_CLIENT_SECRET = Deno.env.get("SPOTIFY_CLIENT_SECRET") || "2a22623b5c3241ff8780144f57643be6";

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
    console.log("Spotify token request received");
    const { authCode, refreshToken } = await req.json();
    
    // Make sure we have the credentials
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      console.error("Missing Spotify credentials");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log credential lengths for debugging
    console.log(`Client ID: ${SPOTIFY_CLIENT_ID}`);
    console.log(`Client Secret length: ${SPOTIFY_CLIENT_SECRET.length}`);

    let tokenResponse;
    
    if (refreshToken) {
      // Handle token refresh flow
      console.log("Using refresh token flow");
      const authHeader = `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`;
      
      tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authHeader
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      });
    } else if (authCode) {
      // Handle user authentication flow
      // Use the actual URL from your app
      const redirectUri = `${req.headers.get("origin")}/callback` || 'http://localhost:5173/callback'; 
      
      console.log("Using authorization code flow");
      console.log(`Redirect URI: ${redirectUri}`);
      const authHeader = `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`;
      
      tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authHeader
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri: redirectUri
        })
      });
    } else {
      // Client credentials flow for search and preview
      console.log("Using client credentials flow");
      const authHeader = `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`;
      
      tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authHeader
        },
        body: 'grant_type=client_credentials'
      });
    }

    const data = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("Error response from Spotify:", data);
      return new Response(
        JSON.stringify({ error: data.error || "Failed to get Spotify token", details: data }),
        { 
          status: tokenResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log("Successfully obtained Spotify token");
    
    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
