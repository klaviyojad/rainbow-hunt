import React from 'react';
import Modal from 'react-modal'
import * as Constants from '../constants';

class ArtEntryModal extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            typeOfArt: Constants.TYPE_OF_ART_WINDOW,
            week: Constants.ALL_WEEKS[Constants.ALL_WEEKS.length - 1],
            otherValue: ""
        }
    }


    mapTypeOfArt = (typeOfArt) => {
        if (typeOfArt === Constants.TYPE_OF_ART_WINDOW)
            return "Window Art"
        if (typeOfArt === Constants.TYPE_OF_ART_SIDEWALK)
            return "Sidewalk Art"
        if (typeOfArt === Constants.TYPE_OF_ART_OUTSIDE)
            return "Outside Art"
        if (typeOfArt === Constants.TYPE_OF_ART_OTHER)
            return this.state.otherValue
    }

    onRadioChange = (e) => {
        this.setState({
            typeOfArt: e.target.value
        });
    }

    handleSubmit = (e, setIsModalOpen, addNewArtEntry) => {

        /* if (this.state.typeOfArt === "window art")
            typeOfArt = "Window Art"
        else if (this.state.typeOfArt === "sidewalk art")
            typeOfArt = "Sidewalk Art"
        else if (this.state.typeOfArt === "outside art")
            typeOfArt = "Outside Art"
        else if (this.state.typeOfArt === "other")
            typeOfArt = this.state.otherValue */

        addNewArtEntry(this.state.week, this.mapTypeOfArt(this.state.typeOfArt))

        setIsModalOpen(false)

    }

    updateSelectedValue = (e) => {
        this.setState({
            week: e.target.value
        });
    }

    updateInputValue = (e) => {
        this.setState({
            otherValue: e.target.value
        });
    }

    render() {
        Modal.setAppElement("#root")

        const { isModalOpen, setIsModalOpen, addNewArtEntry } = this.props

        return (<Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} shouldCloseOnOverlayClick={false} className="Modal"
        >
            <div className="modal-wrapper">
                <div className="modal-header">
                    <h3>New Art Project Entry</h3>
                    <span
                        className="Icon"
                        role="button"
                        aria-label="Close Modal"
                        tabIndex={0}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="square"
                            strokeLinejoin="inherit"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </span>
                </div>
                <div className="modal-body">
                    <label htmlFor="week">Theme:&nbsp;</label>

                    <select id="week" onChange={this.updateSelectedValue} value={this.state.week}>
                        {
                            Constants.ALL_WEEKS.map(week => {
                                return (
                                    <option key={`${JSON.stringify(week)}`} value={week}>{week}</option>)
                            })
                        }
                    </select>
                    <p>Type of Art:</p>
                    <ul>
                        <li>
                            <label><input type="radio" value="window art" checked={this.state.typeOfArt === "window art"}
                                onChange={this.onRadioChange} />Window Art</label>
                        </li>
                        <li>
                            <label><input type="radio" value="sidewalk art" checked={this.state.typeOfArt === "sidewalk art"}
                                onChange={this.onRadioChange} />Sidewalk Art</label>
                        </li>
                        <li>
                            <label><input type="radio" value="outside art" checked={this.state.typeOfArt === "outside art"}
                                onChange={this.onRadioChange} />Outside Art</label>
                        </li>
                        <li>
                            <label><input type="radio" value="other" checked={this.state.typeOfArt === "other"} onChange={this.onRadioChange} />Other:&nbsp;</label>
                            <input type="text" value={this.state.otherValue} onChange={this.updateInputValue} />
                        </li>
                    </ul>


                    <button type="button" className="modal-btn" onClick={(e) => this.handleSubmit(e, setIsModalOpen, addNewArtEntry)}>
                        Save
                </button>

                </div>

            </div>

        </Modal>
        )
    }
}

export { ArtEntryModal }

