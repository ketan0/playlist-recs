import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {ReactComponent as PlusCircle} from './plus-circle.svg';
import {ReactComponent as TrashCan} from './trash-2.svg';
import {ReactComponent as ThumbsUp} from './thumbs-up.svg';
import {ReactComponent as ThumbsDown} from './thumbs-down.svg';


interface TrackInfo {
    id: string;
    name: string;
    artists: string[];
    /* albumArtURL: string; */
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

function BasicTrack({ id, name, artists }: TrackInfo) {
    return (
        <div className="flex flex-col">
            {/* <p className="truncate text-2xl font-bold">{name}</p>
                <p>{artists.join(', ')}</p> */}
            <iframe title={id} src={`https://open.spotify.com/embed/track/${id}`} width="300" height="80" frameBorder="0" allow="encrypted-media" />
            {/* <audio
                controls
                src={previewURL}>
                Your browser does not support the
                <code>audio</code> element.
                </audio> */}
        </div>
    );
}

function SearchTrack({ onAdd, ...trackInfo }: SearchTrackInfo) {
    return (
        <div className="border-2 border-gray-500 rounded flex justify-between p-2 space-x-2">
            <BasicTrack { ...trackInfo } />
            <button onClick={onAdd}><PlusCircle className="stroke-current hover:text-green-500" /></button>
        </div>
    );
}

function PlaylistTrack({ onDelete, ...trackInfo }: PlaylistTrackInfo) {
    return (
        <div className="border-2 border-gray-500 rounded flex justify-between p-2 space-x-2">
            <BasicTrack { ...trackInfo }/>
            <button onClick={onDelete}><TrashCan className="stroke-current hover:text-red-500" /></button>
        </div>
    );
}

function RecommendedTrack({ onLike, onDislike, ...trackInfo }: RecommendedTrackInfo) {
    return (
        <div className="border-2 border-gray-500 rounded flex flex-col items-center p-2">
            <BasicTrack { ...trackInfo }/>
            <p className="text-center"><b>Is this a good addition to your playlist?</b></p>
            <div className="flex space-x-4 justify-center">
                <button className="border border-gray-300 rounded" onClick={onDislike}>
                    <ThumbsDown className="stroke-current hover:text-blue-500"/>
                </button>
                <button className="border border-gray-300 rounded" onClick={onLike}>
                    <ThumbsUp className="stroke-current hover:text-blue-500"/>
                </button>
            </div>
        </div>
    );
}

interface PlaylistCreationInfo {
    playlistName: string;
    playlistDescription: string;
    onNameChange: React.ChangeEventHandler<HTMLInputElement>;
    onDescriptionChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
}

function PlaylistCreation({playlistName, playlistDescription, onNameChange,
                           onDescriptionChange, onSubmit}: PlaylistCreationInfo) {
    const formIncomplete = playlistName.length === 0 || playlistDescription.length === 0
    const enabledStyles = formIncomplete ? "opacity-50" : "hover:border-blue-500 hover:text-blue-500 cursor-pointer"
    return (
        <div className="flex flex-col items-center">
            <form onSubmit={onSubmit} className="w-96 space-y-4">
                <div>
                    <p>Playlist Name:</p>
                    <input
                        className="border-2 border-gray-300 rounded"
                        type="text"
                        placeholder="Give your playlist a name"
                        value={playlistName}
                        onChange={onNameChange}
                    />
                </div>
                <div>
                    <p>Playlist Description:</p>
                    <textarea
                        name="playlist-description" id="playlist-description" rows={3} cols={50}
                        className="border-2 border-gray-300 rounded"
                        placeholder="Give a brief description of what your aims for this playlist are."
                        value={playlistDescription}
                        onChange={onDescriptionChange}
                    />
                </div>
                <input
                    className={`py-2 px-4 border-2 border-black bg-white font-semibold rounded-lg ${enabledStyles}`}
                    type="submit"
                    value="Create"
                    disabled={formIncomplete}
                />
            </form>
        </div>
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
    useEffect(() => {
        console.log(searchResults);
    }, [searchResults])

    useEffect(() => {
        console.log(tracks);
    }, [tracks])

    const handlePlaylistCreation: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setPlaylistCreated(true);
    }

    //TODO: refactor
    if (!playlistCreated) {
        return (
            <div className="App m-4">
                <h1 className="text-2xl font-semibold border-b mb-4">Playlist Recommender</h1>
                <PlaylistCreation
                    playlistName={playlistName}
                    onNameChange={e => setPlaylistName(e.target.value)}
                    playlistDescription={playlistDescription}
                    onDescriptionChange={e => setPlaylistDescription(e.target.value)}
                    onSubmit={handlePlaylistCreation}
                />
            </div>
        )
    }

    // TODO: refactor this into a component
    // const dummyTracks: TrackInfo[] = [
    //     {
    //         id: "1",
    //         name: 'Redbone',
    //         artists: ['Childish Gambino'],
    //         /* albumArtURL: 'https://i.scdn.co/image/ab67616d00004851b08b996d08001270adc8b555', */
    //         previewURL: 'too lazy for this rn',
    //     },
    //     {
    //         id: "2",
    //         name: 'IV. Sweatpants',
    //         artists: ['Childish Gambino'],
    //         /* albumArtURL: 'https://i.scdn.co/image/ab67616d00004851fce23dadb51975ebf2e9d75c', */
    //         previewURL: 'too lazy for this rn',
    //     },
    // ]

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

    const addToPlaylist = (track: TrackInfo) => () => {
        if (!tracks.includes(track)) {
            setTracks([...tracks, track])
        }
    }
    const deleteTrack = (id: string) => () => {
        setTracks(tracks.filter(track => id !== track.id))
    }
    const fetchRecommendations = async () => {
        //TODO: call [X recommendation API] on the backend
        //TODO: call get_track(id) to get extra track info
        const response = await axios.get('/recs', {
            params: {
                track_ids: tracks.map(t => t.id)
            }
        })
        setRecs(response.data.tracks);
    }

    const storeRecommendationResponse = (likedCurrentTrack: boolean) => {

    }

    const dummyAdvanceRecs = (likedCurrentTrack: boolean) => () => {
        //TODO: store like/dislike data in database
        storeRecommendationResponse(likedCurrentTrack);
        //TODO: advance to some sort of endgame state after last rec track
        if (displayedRec < recs.length - 1) {
            setDisplayedRec(displayedRec + 1);
        }
    }

    const searchIncomplete = searchText.length === 0;
    const enabledStyles = searchIncomplete ? "opacity-50" : "hover:border-blue-500 hover:text-blue-500 cursor-pointer"

    return (
        <div className="App m-4">
            <h1 className="text-2xl font-semibold border-b mb-4">Playlist Recommender</h1>
            <div className="flex justify-center space-x-16">
                <div className="w-96 space-y-4 max-h-screen">
                    <form className="space-x-2" onSubmit={fetchSearchResults}>
                        <input
                            className="border-2 border-gray-300 rounded"
                            type="text"
                            placeholder="Search for tracks"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <input
                            className={`px-2 border-2 border-black bg-white font-semibold rounded-lg ${enabledStyles}`}
                            type="submit"
                            value="Search"
                            disabled={searchIncomplete}
                        />
                    </form>
                    <div className="space-y-4 max-h-full overflow-scroll">
                        {searchResults.map(track => <SearchTrack {...track} key={track.id} onAdd={addToPlaylist(track)} />)}
                    </div>
                </div>
                <div className="w-96 space-y-4 max-h-screen">
                    <div>
                        <p>Your Playlist <b>{playlistName}</b>:</p>
                        <p><i>{playlistDescription}</i></p>
                    </div>
                    <div className="space-y-4 max-h-full overflow-scroll">
                        {tracks.map(track => <PlaylistTrack {...track} key={track.id} onDelete={deleteTrack(track.id)} />)}
                    </div>
                    <button className="border border-gray-300 rounded" onClick={fetchRecommendations}>Get Recommendations</button>
                    {recs.length > 0 && (
                        <>
                            <p>Recommended Tracks:</p>
                            <RecommendedTrack
                                {...recs[displayedRec]}
                                key={recs[displayedRec].id}
                                onLike={dummyAdvanceRecs(true)}
                                onDislike={dummyAdvanceRecs(false)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
