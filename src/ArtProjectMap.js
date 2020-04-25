import React, { Component } from 'react';
import firebase from './firebase'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import './ArtProjectMap.css'
import { ArtEntryModal } from './components'
import * as Constants from './constants'
import Moment from 'moment';
import 'mapbox-gl/dist/mapbox-gl.css';
import Confirm from "./Confirm"







class ArtProjectMap extends Component {

    constructor(props) {

        super(props)

        this.state = {
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

    }





    updateStateWithNewArtEntry(artEntry) {

        const newState = [...this.state.artEntries, artEntry];
        this.setState({
            artEntries: newState
        })
    }

    addNewArtEntry = (week, typeOfArt) => {



        const itemRef = firebase.database().ref('/');
        const id = itemRef.push().key;

        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.modalLng},${this.state.modalLat}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
            .then(response => response.json())
            .then(result => {

                const artEntry = {
                    "id": id,
                    "Address": result.features[0].place_name,
                    "Timestamp": Moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    "Type of Art": typeOfArt,
                    "Week": week,
                    "lat": this.state.modalLat,
                    "lng": this.state.modalLng
                };
                //itemRef.push(artEntry);
                //itemRef.push(artEntry);
                firebase.database().ref(`/${id}`).update(artEntry)

                this.updateStateWithNewArtEntry(artEntry)
            })
    }



    componentDidMount() {
        //ping our api endpoint
        //update our state

        firebase.auth().signInAnonymously().then(() => {

            firebase.database().ref('/').on('value', snapshot => {
                let artEntries = snapshot.val()
                const total = snapshot.numChildren()
                let count = 0;
                if (artEntries) {
                    Object.entries(artEntries).map(([key, artEntry]) => {
                        if (artEntry['lat'] && artEntry['lng']) {

                            artEntry['id'] = key
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
        })
    }


    handleViewportChange = viewport => {
        this.setState({
            viewport: { ...this.state.viewport, ...viewport }
        })
    }

    setIsModalOpen = (isModalOpen) => {
        this.setState({ isModalOpen })
    }

    handleDelete = () => {
        console.log("deleting item")

        const itemRef = firebase.database().ref(`/${this.state.selectedArtEntry.id}`);
        itemRef.remove();

        const newArtEntries = this.state.artEntries.filter(artEntry => artEntry.id !== this.state.selectedArtEntry.id);

        this.setState({
            artEntries: newArtEntries,
            selectedArtEntry: null
        })
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
                                </button>
                            </Marker>)

                    ))}

                    {



                        selectedArtEntry ?
                            (<Popup latitude={selectedArtEntry.lat} longitude={selectedArtEntry.lng}
                                onClose={() => this.setState({ selectedArtEntry: null })}
                                closeOnClick={false}
                                captureClick={true}>

                                <u>{selectedArtEntry.Week}</u>
                                <p>{selectedArtEntry['Address']}</p>
                                <p>{selectedArtEntry['Type of Art']}</p>
                                <p>{selectedArtEntry['Timestamp']}</p>

                                <Confirm title="Confirm" description="Are you sure?">
                                    {confirm => (
                                        <button className="marker-modal-btn" onClick={confirm(this.handleDelete)} >Delete Entry</button>
                                    )}
                                </Confirm>

                            </Popup>) : null
                    }



                </ReactMapGL>
                <ArtEntryModal isModalOpen={isModalOpen} setIsModalOpen={this.setIsModalOpen} addNewArtEntry={this.addNewArtEntry} />



            </div>
        )

    }



}

export { ArtProjectMap }