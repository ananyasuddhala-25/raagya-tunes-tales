
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');
      
      if (error) {
        console.error('Spotify authentication error:', error);
        toast({
          title: "Authentication Failed",
          description: `Spotify authentication was cancelled: ${error}`,
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }
      
      if (code) {
        try {
          console.log("Received auth code from Spotify");
          
          // Get token via Supabase Edge Function
          const { data, error } = await supabase.functions.invoke('get-spotify-token', {
            body: { authCode: code }
          });
          
          if (error || !data) {
            throw new Error(error?.message || "Failed to get Spotify token");
          }
          
          // Store the token information
          if (data.access_token) {
            const expiresAt = new Date().getTime() + (data.expires_in * 1000);
            localStorage.setItem('spotify_token', data.access_token);
            localStorage.setItem('spotify_token_expires', expiresAt.toString());
            
            if (data.refresh_token) {
              localStorage.setItem('spotify_refresh_token', data.refresh_token);
            }
            
            toast({
              title: "Spotify Connected",
              description: "Successfully connected to your Spotify account",
              variant: "default"
            });
            
            navigate('/dashboard');
          } else {
            throw new Error("Invalid token response");
          }
        } catch (error) {
          console.error('Error handling Spotify callback:', error);
          toast({
            title: "Connection Failed",
            description: "Could not connect to Spotify. Please try again.",
            variant: "destructive"
          });
          navigate('/dashboard');
        }
      } else {
        toast({
          title: "Authentication Cancelled",
          description: "Spotify authentication was cancelled or failed",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Connecting to Spotify...</h2>
        <p className="text-muted-foreground mb-6">Please wait while we complete the authentication</p>
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      </div>
    </div>
  );
}
