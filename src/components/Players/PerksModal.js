import React from 'react';
import {connect} from "react-redux";
import Modal from 'react-modal';

import { applyPerkUsageAction } from "../../store/attackModifierDecks";
import { perksForClass } from "../../lib/classes";
import minusOneCard from "../AttackModifierDecks/-1.jpg";
import minusOneItemIcon from "../AttackModifierDecks/minusOneItemIcon.svg";

import "./PerksModal.css";

class PerksModalComponent extends React.Component {
    constructor(props) {
        super(props);

        // taken from https://github.com/reactjs/react-modal/tree/v3.1.11#examples
        /*
        this.customStyles = {
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)'
              }
        };
        */

        this.customStyles = {
            content: {
                top:"112px",
                left:"50%",
                transform             : 'translateX(-45%)',
                position:"absolute",
                width:"60%",
            }
        }

        this.state = {
            perkUsage: props.initialPerkUsage,
            minusOneCards: props.initialMinusOneCards,
        };
    }

    togglePerk(i, j) {
        this.setState({
            perkUsage: [
                ...this.state.perkUsage.slice(0, i),
                [
                    ...this.state.perkUsage[i].slice(0, j),
                    !this.state.perkUsage[i][j],
                    ...this.state.perkUsage[i].slice(j + 1),
                ],
                ...this.state.perkUsage.slice(i + 1),
            ],
        });
    }

    setMinusOneCards(minusOneCards) {
        this.setState({
            minusOneCards,
        });
    }

    applyPerks() {
        this.props.applyPerks(this.state.perkUsage, this.state.minusOneCards);
        this.props.onClose();
    }

    render() {
        //return (<Modal isOpen contentLabel="Perks" className={{ base:"test", }}>
        return (<Modal isOpen contentLabel="Perks" style={this.customStyles}>
            <h2 className="PerksModal--Title">{this.props.class} Perks</h2>
            <div className="PerksModal--Perks">
                {this.state.perkUsage.map((pu, i) => {
                    const description = perksForClass(this.props.class)[i].description;
                    return (<div key={i} className="PerksModal--Perk">
                        {pu.map((u, j) => <input key={j} className="PerksModal--perk--checkbox" type="checkbox" checked={u} onChange={() => this.togglePerk(i, j)} />)}
                        <label className="PerksModal--Perk--Name">{description}</label>
                    </div>);
                })}
            </div>
            <div>
                <h3 className="PerksModal--Title">Add <img className="PerksModal--CardIcon" src={minusOneCard} alt="-1 card"/></h3>
                <div className="PerksModal--MinusOne--Container">
                    <img className="PerksModal--ItemIcon" src={minusOneItemIcon} alt="-1"/>
                    x
                    <select className="PerksModal--MinusOne--Select" value={this.state.minusOneCards} onChange={(event) => this.setMinusOneCards(parseInt(event.target.value, 10))}>
                        {new Array(8).fill().map((_, i) => {
                            return <option key={i-2} value={i-2}>{i-2}</option>
                        })}
                    </select>
                </div>
            </div>
            <div className="PerksModal--Buttons--Description">Applying these cards will reset and reshuffle your deck</div>
            <div className="PerksModal--Buttons--Container">
                <button onClick={() => this.props.onClose()}>Cancel</button>
                <button onClick={() => this.applyPerks()}>Apply</button>
            </div>
        </Modal>);
    }
}

export const PerksModal = connect(
    (state, ownProps) => {
        return {
            initialPerkUsage: state.attackModifierDecks[ownProps.name].perkUsage,
            initialMinusOneCards: state.attackModifierDecks[ownProps.name].minusOneCards,
            class: state.players.players[ownProps.name].class,
        };
    },
    (dispatch, ownProps) => {
        return {
            applyPerks: (perkUsage, minusOneCards) => applyPerkUsageAction(dispatch, ownProps.name, perkUsage, minusOneCards),
        };
    }
)(PerksModalComponent);
