import React, { Component } from 'react';
import firebase from './firebase'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { Modal } from './Modal';
import './ArtProjectMap.css'
import { rainbow, plant, sky } from './icons'


const artProjectDbRef = firebase.database().ref('/')


const toggleFreezeScroll = () => {
    const body = document.querySelector('body');
    if (body.style.overflow === '' || body.style.overflow === 'auto') {
        body.style.overflow = 'hidden';
    } else {
        setTimeout(() => {
            body.style.overflow = 'auto';
        }, 500);
    }
};

class ArtProjectMap extends Component {


    state = {
        isLoadedData: false,
        artEntries: [],
        viewport: {
            latitude: 42.3876,
            longitude: -71.0995,
            zoom: 12,
            width: '100vw',
            height: "100vh"
        },
        selectedArtEntry: null,
        active: ["rainbows", "plants", "sky"],
        isModalOpen: false
    }

    updateStateWithNewArtEntry(artEntry) {

        const newState = [...this.state.artEntries, artEntry];
        this.setState({
            artEntries: newState
        })
    }




    componentDidMount() {
        //ping our api endpoint
        //update our state

        artProjectDbRef.on('value', snapshot => {
            let artEntries = snapshot.val()
            const total = snapshot.numChildren()
            let count = 0;
            if (artEntries) {
                Object.entries(artEntries).map(([key, artEntry]) => {
                    if (artEntry['lat'] && artEntry['lng']) {

                        this.updateStateWithNewArtEntry(artEntry)

                        count = count + 1
                        if (count === total)
                            this.setState({ isLoadedData: true })
                    }
                    else {
                        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${artEntry['Address']}&key=${process.env.REACT_APP_GOOGLE_KEY}`)
                            .then(response => response.json())
                            .then(result => {
                                const itemRef = firebase.database().ref(`/${key}`)

                                const lat = result.results[0].geometry.location.lat
                                const lng = result.results[0].geometry.location.lng

                                itemRef.update({
                                    'lat': lat,
                                    'lng': lng
                                })

                                this.updateStateWithNewArtEntry(itemRef)

                                count = count + 1
                                if (count === total)
                                    this.setState({ isLoadedData: true })

                            })

                    }




                })



            }

        })
    }

    handleViewportChange = viewport => {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        })
    }

    /*     onSelected = (viewport, item) => {
            this.setState({ viewport });
            console.log('Selected: ', item)
        }
     */

    render() {
        const { selectedArtEntry, active } = this.state;
        const setIsModalOpen = (isModalOpen) => {
            this.setState({ isModalOpen })
        }
        const options = [["rainbows"], ["plants"], ["sky"], ["rainbows", "plants", "sky"]]
        const renderOptions = (option, i) => {
            return (
                <label key={i} className="toggle-container">
                    <input onChange={() => { this.setState({ active: option }) }} checked={JSON.stringify(active) == JSON.stringify(option)} name="toggle" type="radio" />
                    <div className="toggle txt-s py3 toggle--active-white">{(option.length === 1) ? option[0] : 'all'}</div>
                </label>
            );
        }

        if (!this.state.isLoadedData) return null;

        const { viewport } = this.state

        return (
            <div>
                <div className="toggle-group absolute top left ml12 mt12 border border--2 border--white bg-white shadow-darken10 z1">
                    {options.map(renderOptions)}
                </div>
                <ReactMapGL
                    {...viewport}
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    onViewportChange={this.handleViewportChange}

                    onClick={(e) => {

                        setIsModalOpen(true)
                    }
                    }>
                    {this.state.artEntries.map(artEntry => (
                        <Marker key={`${JSON.stringify(artEntry)}`} latitude={artEntry.lat} longitude={artEntry.lng}>
                            <button className="marker-btn" onClick={(e) => {
                                e.preventDefault();
                                this.setState({
                                    selectedArtEntry: artEntry
                                })
                            }}>

                                {artEntry.Week === "week 2 - rainbows" && active.includes('rainbows') &&
                                    (<img src={rainbow} alt="Rainbow Icon" />)}
                                {artEntry.Week === "week 1 - plants" && active.includes('plants') &&
                                    (<img src={plant} alt="Plant Icon" />)}
                                {artEntry.Week === "week 3 - skies" && active.includes('sky') &&
                                    (<img src={sky} alt="Sky Icon" />)}
                            </button>
                        </Marker>

                    ))}
                    {



                        selectedArtEntry ?
                            (<Popup latitude={selectedArtEntry.lat} longitude={selectedArtEntry.lng}
                                onClose={() => this.setState({ selectedArtEntry: null })}>
                                <h2>{selectedArtEntry.Week}</h2>
                                <p>{selectedArtEntry['Type of Art']}</p>
                                <p>{selectedArtEntry['Timestamp']}</p>
                            </Popup>) : null
                    }








                    <Modal
                        setIsModalOpen={setIsModalOpen}
                        isModalOpen={this.state.isModalOpen}
                        toggleScroll={toggleFreezeScroll}
                    >
                        <div>
                            <h3>Would you like to proceed?</h3>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <button
                                    className="cancel"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        toggleFreezeScroll();
                                    }}
                                >
                                    Cancel
            </button>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        toggleFreezeScroll();
                                    }}
                                >
                                    Yes, proceed.
            </button>
                            </div>
                        </div>
                    </Modal>

                </ReactMapGL>


            </div>
        )

    }



}

export { ArtProjectMap }