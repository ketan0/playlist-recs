import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
const PORT = 3001;
import SpotifyWebApi from 'spotify-web-api-node';

console.log(process.env.SPOTIFY_CLIENT_ID);
console.log(process.env.SPOTIFY_CLIENT_SECRET);

//TODO: refactor this into its own class/singleton thingy
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

app.get('/', (req,res) => res.send('Express + TypeScript Server'));

const simplifyTrack = (track: SpotifyApi.TrackObjectFull) => {
  return {
    id: track.id,
    name: track.name,
    artists: track.artists.map(artist => artist.name),
    albumArtURL: track.album.images[2].url,
    previewURL: track.preview_url
  }
}

app.get('/search', async (req,res) => {
  const searchquery = req.query.searchquery;
  if (typeof searchquery == 'string') {
    try {
      const data = await spotifyApi.searchTracks(searchquery, {
        limit: 10,
        market: 'IT',
      });
      if (data.body.tracks) {
        res.send({tracks: data.body.tracks.items.map(simplifyTrack)});
      }
    } catch (err) {
      console.error(err);
    }
  }
});

const simplifySimpleTrack = (track: SpotifyApi.TrackObjectSimplified) => {
  return {
    id: track.id,
    name: track.name,
    artists: track.artists.map(artist => artist.name),
    previewURL: track.preview_url
  }
}

app.get('/recs', async (req,res) => {
  const track_ids = req.query.track_ids as string[];
  if (Array.isArray(track_ids)) { //TODO: do a proper typeguard for string[] here
    try {
      const data = await spotifyApi.getRecommendations({
        seed_tracks: track_ids
      });
      if (data.body.tracks) {
        res.send({tracks: data.body.tracks.map(simplifySimpleTrack)});
      }
    } catch (err) {
      console.error(err);
    }
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
