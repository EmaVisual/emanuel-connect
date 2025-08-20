export const SpotifyEmbed = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
        Music is Life
      </h3>
      <div className="rounded-xl overflow-hidden shadow-lg">
        <iframe 
          data-testid="embed-iframe" 
          style={{ borderRadius: '12px' }} 
          src="https://open.spotify.com/embed/playlist/1tmQXj1yGVS30jdgia5678?utm_source=generator" 
          width="100%" 
          height="352" 
          frameBorder="0" 
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};