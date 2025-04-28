
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '@/integrations/spotify/spotify';
import { toast } from '@/hooks/use-toast';

export default function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        try {
          const token = await getAccessToken(code);
          if (token) {
            toast({
              title: "Spotify Connected",
              description: "Successfully connected to your Spotify account",
              variant: "default"
            });
          } else {
            throw new Error("Failed to get token");
          }
          navigate('/dashboard');
        } catch (error) {
          console.error('Error handling Spotify callback:', error);
          toast({
            title: "Connection Failed",
            description: "Could not connect to Spotify. Please try again.",
            variant: "destructive"
          });
          navigate('/');
        }
      } else {
        toast({
          title: "Authentication Cancelled",
          description: "Spotify authentication was cancelled or failed",
          variant: "default"
        });
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Connecting to Spotify...</h2>
        <p className="text-muted-foreground">Please wait while we complete the authentication</p>
      </div>
    </div>
  );
}
