
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '@/integrations/spotify/spotify';

export default function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        try {
          await getAccessToken(code);
          navigate('/dashboard');
        } catch (error) {
          console.error('Error handling Spotify callback:', error);
          navigate('/');
        }
      } else {
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
