
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SPOTIFY_CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID");
const SPOTIFY_CLIENT_SECRET = Deno.env.get("SPOTIFY_CLIENT_SECRET");

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
    const { authCode } = await req.json();
    
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
    console.log(`Client ID length: ${SPOTIFY_CLIENT_ID.length}`);
    console.log(`Client Secret length: ${SPOTIFY_CLIENT_SECRET.length}`);

    let tokenResponse;
    
    if (authCode) {
      // Handle user authentication flow
      const redirectUri = 'http://localhost:5173/callback'; // Update this based on your app's URL
      
      console.log("Using authorization code flow");
      const authHeader = `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`;
      console.log(`Auth header: ${authHeader.substring(0, 10)}...`);

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
      console.log(`Auth header: ${authHeader.substring(0, 10)}...`);

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
