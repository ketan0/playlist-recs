import axios from 'axios';
import React, { useState } from 'react';

interface TrackInfo {
    id: string;
    name: string;
    artists: string[];
    albumArtURL: string;
    previewURL: string;
    //TODO: audio preview??
}

interface SearchTrackInfo extends TrackInfo  {
    onAdd: React.MouseEventHandler<HTMLElement>;
}

interface PlaylistTrackInfo extends TrackInfo  {
    onDelete: React.MouseEventHandler<HTMLElement>;
}

interface RecommendedTrackInfo extends TrackInfo  {
    onLike: React.MouseEventHandler<HTMLElement>;
    onDislike: React.MouseEventHandler<HTMLElement>;
}

function SearchTrack({ id, name, artists, previewURL, albumArtURL, onAdd }: SearchTrackInfo) {
    return (
        <div className="border-2 border-gray-500 rounded flex justify-between">
            <div className="flex">
                <img
                    src={albumArtURL}
                    alt={`${name} - ${artists.join(', ')} album art`}
                    width="64"
                    height="64"
                />
                <div className="flex flex-col">
                    <p>
                        {name} - {artists.join(', ')}
                    </p>
                    <iframe title={id} src={`https://open.spotify.com/embed/track/${id}`} width="300" height="80" frameBorder="0" allowTransparency={true} allow="encrypted-media" />
                    {/* <audio
                        controls
                        src={previewURL}>
                        Your browser does not support the
                        <code>audio</code> element.
                        </audio> */}
                </div>
            </div>
            <button className="text-green-400" onClick={onAdd}>+</button>
        </div>
    );
}
function PlaylistTrack({ id, name, artists, previewURL, albumArtURL, onDelete }: PlaylistTrackInfo) {
    return (
        <div className="border-2 border-gray-500 rounded flex justify-between">
            <div className="flex">
            <img
                src={albumArtURL}
                alt={`${name} - ${artists.join(', ')} album art`}
                width="64"
                height="64"
            />
            <div className="flex flex-col">
                <p>
                    {name} - {artists.join(', ')}
                </p>
                <iframe title={id} src={`https://open.spotify.com/embed/track/${id}`} width="300" height="80" frameBorder="0" allowTransparency={true} allow="encrypted-media" />
                {/* <audio
                    controls
                    src={previewURL}>
                    Your browser does not support the
                    <code>audio</code> element.
                    </audio> */}
            </div>
            </div>
            <button className="text-red-400" onClick={onDelete}>Delete</button>
        </div>
    );
}

function RecommendedTrack({ id, name, artists, albumArtURL, onLike, onDislike }: RecommendedTrackInfo) {
    console.log('art URL: ' + albumArtURL)
    return (
        <div className="border-2 border-gray-500 rounded flex flex-col items-center">
            {/* <img
                src={albumArtURL}
                alt={`${name} - ${artists.join(', ')} album art`}
                width="200"
                height="200"
                /> */}
            <iframe title={id} src={`https://open.spotify.com/embed/track/${id}`} width="300" height="80" frameBorder="0" allowTransparency={true} allow="encrypted-media" />
            <p>
                {name} - {artists.join(', ')}
            </p>
            <p><b>Is this a good addition to your playlist?</b></p>
            <div className="flex space-x-4">
                <button className="border border-gray-300 rounded" onClick={onDislike}>👎</button>
                <button className="border border-gray-300 rounded" onClick={onLike}>👍</button>
            </div>
        </div>
    );
}

interface PlaylistCreationInfo {
    playlistName: string;
    playlistDescription: string;
    onNameChange: React.ChangeEventHandler<HTMLInputElement>;
    onDescriptionChange: React.ChangeEventHandler<HTMLInputElement>;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
}

function PlaylistCreation({playlistName, playlistDescription, onNameChange,
                           onDescriptionChange, onSubmit}: PlaylistCreationInfo) {
    return (
        <form onSubmit={onSubmit}>
            <p>Playlist Name:</p>
            <input
                className="border-2 border-gray-300 rounded"
                type="text"
                placeholder="Give your playlist a name."
                value={playlistName}
                onChange={onNameChange}
            />
            <p>Playlist Description:</p>
            <input
                className="border-2 border-gray-300 rounded"
                type="text"
                placeholder="Give a brief description of what your aims for this playlist are."
                value={playlistDescription}
                onChange={onDescriptionChange}
            />
            <input type="submit" value="Submit" />
        </form>
    )
}

function App() {
    //TODO: decompose into Search, Playlist, Recommendations, etc. + put in individual files
    const [playlistCreated, setPlaylistCreated] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const [tracks, setTracks] = useState<TrackInfo[]>([]);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState<TrackInfo[]>([]);
    const [recs, setRecs] = useState<TrackInfo[]>([]);
    const [displayedRec, setDisplayedRec] = useState(0);

    const handlePlaylistCreation: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setPlaylistCreated(true);
    }

    if (!playlistCreated) {
        return (
            <PlaylistCreation
                playlistName={playlistName}
                onNameChange={e => setPlaylistName(e.target.value)}
                playlistDescription={playlistDescription}
                onDescriptionChange={e => setPlaylistDescription(e.target.value)}
                onSubmit={handlePlaylistCreation}
            />
        )
    }
    //TODO: refactor this into a component
    const dummyTracks: TrackInfo[] = [
        {
            id: "1",
            name: 'Redbone',
            artists: ['Childish Gambino'],
            albumArtURL: 'https://i.scdn.co/image/ab67616d00004851b08b996d08001270adc8b555',
            previewURL: 'too lazy for this rn',
        },
        {
            id: "2",
            name: 'IV. Sweatpants',
            artists: ['Childish Gambino'],
            albumArtURL: 'https://i.scdn.co/image/ab67616d00004851fce23dadb51975ebf2e9d75c',
            previewURL: 'too lazy for this rn',
        },
    ]

    const fetchSearchResults: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('/search', {
                params: {
                    searchquery: searchText,
                }
            })
            /* console.log(response); */
            setSearchResults(response.data.tracks);
        } catch (error) {
            console.error(error);
        }
    }
    const addToPlaylist = (track: TrackInfo) => {
        // TODO: duplicate detection
        setTracks([...tracks, track])
    }
    const deleteTrack = (id: string) => () => {
        setTracks(tracks.filter(track => id !== track.id))
    }
    const fetchRecommendations = async () => {
        //TODO: call [X recommendation API] on the backend
        //TODO: call get_track(id) to get extra track info
        console.log('this happening')
        const response = await axios.get('/recs', {
            params: {
                track_ids: tracks.map(t => t.id)
            }
        })
        setRecs(response.data.tracks);
    }
    const dummyAdvanceRecs = () => {
        //TODO: parametrize w/ like/dislike
        //TODO: store like/dislike data in database
        //TODO: advance to some sort of endgame state
        if (displayedRec < recs.length - 1) {
            setDisplayedRec(displayedRec + 1);
        }
    }

    return (
        <div className="App">
            <h1 className="text-xl border-b">Playlist Recommender</h1>
            <div className="flex justify-around">
                <div>
                    <form onSubmit={fetchSearchResults}>
                        <input
                            className="border-2 border-gray-300 rounded"
                            type="text"
                            placeholder="Search for tracks"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <input type="submit" value="Submit" />
                    </form>
            {searchResults.map(track => <SearchTrack {...track} key={track.id} onAdd={() => addToPlaylist(track)} />)}
                </div>
                <div>
                    <p>Your Playlist <b>{playlistName}</b>:</p>
                    <p><i>{playlistDescription}</i></p>
                    {tracks.map(track => <PlaylistTrack {...track} key={track.id} onDelete={deleteTrack(track.id)} />)}
                    <button onClick={fetchRecommendations}>Get Recommendations</button>
                    {recs.length > 0 && (
                        <>
                            <p>Recommended Tracks:</p>
                            <RecommendedTrack
                                {...recs[displayedRec]}
                                key={recs[displayedRec].id}
                                onLike={dummyAdvanceRecs}
                                onDislike={dummyAdvanceRecs}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
