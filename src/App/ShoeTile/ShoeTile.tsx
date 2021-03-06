import React from "react";
import { StockState } from "../enums/StockState";
import IShoe from "../interfaces/IShoe";
import "./ShoeTile.scss";

/**
 * Currently we presume all shoes come back successfully, but we would obviously
 * have a clause in a real app for bad prop data and/or have omittable interface properties
 * in our TS prop type(s)/typedef(s)
 */
export default class ShoeTile extends React.Component<IShoe, any> {

    constructor(props: { shoeData: IShoe } & any) {
        super(props);
    }

    private getStockStateClass(stockStateNumber: number): string {
        switch (stockStateNumber) {
            case StockState.ReadyToTry:
                return "ready-to-try";
            case StockState.OnTheWay:
                return "on-the-way";
            case StockState.InTheQueue:
                return "in-the-queue";
            case StockState.OutOfStock:
                return "out-of-stock";
            default:
                return "out-of-stock";
        }
    }

    public render() {
        return (
            <div className="shoe-tile">
                <div className={(this.getStockStateClass(this.props.shoeData.stockState))}></div>
                {/** Presume this would be a mock API request / static resource.
                  * We would also have a counter measure for failure requests.
                  */}
                <img className="shoe-tile-image" src={require(`../../sprites/${this.props.shoeData.id}.jpg`)}/>
                <div className="shoe-tile-primarytext">{this.props.shoeData.name}</div>
                <div className="shoe-tile-subtext">Category: <br/>{this.props.shoeData.category}</div>
                <div className="shoe-tile-subtext">Size: <br/>{this.props.shoeData.size}</div>
                <div className="shoe-tile-subtext">Colour: <br/>{this.props.shoeData.colour}</div>
                <div className="shoe-tile-initial-block">{this.props.shoeData.customerInitials}</div>
            </div>
        );
    }

}
