import React, { Component } from 'react';
import firebase from './firebase'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import './ArtProjectMap.css'
import { ArtEntryModal } from './components'
import * as Constants from './constants'
import Moment from 'moment';


const artProjectDbRef = firebase.database().ref('/')

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
        active: Constants.ALL_OPTIONS,
        isModalOpen: false,
        modalLng: null,
        modalLat: null

    }

    updateStateWithNewArtEntry(artEntry) {

        const newState = [...this.state.artEntries, artEntry];
        this.setState({
            artEntries: newState
        })
    }

    addNewArtEntry = (week, typeOfArt) => {
        const itemRef = firebase.database().ref('/');
        const artEntry = {
            "Timestamp": Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            "Type of Art": typeOfArt,
            "Week": week,
            "lat": this.state.modalLat,
            "lng": this.state.modalLng
        };
        itemRef.push(artEntry);

        this.updateStateWithNewArtEntry(artEntry)
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
                        if (count === total) {


                            this.setState({ isLoadedData: true })

                        }
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
                                if (count === total) {
                                    this.setState({ isLoadedData: true })

                                }

                            })

                    }

                    return true
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


    setIsModalOpen = (isModalOpen) => {
        this.setState({ isModalOpen })
    }



    render() {

        const { selectedArtEntry, active, isModalOpen } = this.state;

        const options = [
            ...Constants.ALL_OPTIONS,
            Constants.ALL_OPTIONS,
        ]
        const renderOptions = (option, i) => {
            return (
                <label key={i} className="toggle-container">
                    <input onChange={() => { this.setState({ active: option }) }} checked={JSON.stringify(active) === JSON.stringify(option)} name="toggle" type="radio" />
                    <div className="toggle txt-s py3 toggle--active-white">{(Array.isArray(option)) ? 'all' : option}</div>
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
                    mapStyle={"mapbox://styles/jaddsky/ck97hlbf3077h1iqaeu26gyh8"}
                    onClick={(e) => {
                        this.setState({
                            "modalLat": e.lngLat[1],
                            "modalLng": e.lngLat[0],
                            "isModalOpen": true
                        })
                    }
                    }>
                    {this.state.artEntries.map(artEntry => (
                        artEntry.lat && artEntry.lng && (
                            <Marker key={`${JSON.stringify(artEntry)}`} latitude={artEntry.lat} longitude={artEntry.lng}>
                                <button className="marker-btn" onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({
                                        selectedArtEntry: artEntry
                                    })
                                }}>

                                    {
                                        Constants.RECORDS.map(record => {
                                            if (artEntry.Week === record.week && active.includes(record.option))
                                                return (<img key={`${JSON.stringify(artEntry)}${JSON.stringify(record)}`} src={record.image} alt={record.alt} />)
                                            return null;
                                        }

                                        )
                                    }
                                    {/*  {artEntry.Week === Constants.WEEK_RAINBOWS && active.includes(Constants.OPTION_RAINBOWS) &&
                                        (<img src={rainbow} alt="Rainbow Icon" />)}
                                    {artEntry.Week === Constants.WEEK_PLANTS && active.includes(Constants.OPTION_PLANTS) &&
                                        (<img src={plant} alt="Plant Icon" />)}
                                    {artEntry.Week === Constants.WEEK_SKIES && active.includes(Constants.OPTION_SKY) &&
                                        (<img src={sky} alt="Sky Icon" />)} */}
                                </button>
                            </Marker>)

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




                </ReactMapGL>
                <ArtEntryModal isModalOpen={isModalOpen} setIsModalOpen={this.setIsModalOpen} addNewArtEntry={this.addNewArtEntry} />

            </div>
        )

    }



}

export { ArtProjectMap }