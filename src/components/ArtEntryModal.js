import React from 'react';
import Modal from 'react-modal'
import { ALL_WEEKS } from '../constants';

class ArtEntryModal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            typeOfArt: "window art",
            week: ALL_WEEKS[ALL_WEEKS.length - 1],
            otherValue: ""
        }
    }

    onRadioChange = (e) => {
        this.setState({
            typeOfArt: e.target.value
        });
    }

    handleSubmit = (e, setIsModalOpen, addNewArtEntry) => {
        var typeOfArt;
        if (this.state.typeOfArt === "window art")
            typeOfArt = "Window Art"
        else if (this.state.typeOfArt === "sidewalk art")
            typeOfArt = "Sidewalk Art"
        else if (this.state.typeOfArt === "outside art")
            typeOfArt = "Outside Art"
        else if (this.state.typeOfArt === "other")
            typeOfArt = this.state.otherValue

        addNewArtEntry(this.state.week, typeOfArt)

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
                </div>
                <div className="modal-body">
                    <label for="week">Theme:&nbsp;</label>

                    <select id="week" onChange={this.updateSelectedValue} value={this.state.week}>
                        {
                            ALL_WEEKS.map(week => {
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

