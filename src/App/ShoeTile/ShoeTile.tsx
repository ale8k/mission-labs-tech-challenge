import React from "react";
import "./ShoeTile.scss";

/**
 * Please note, I typically place enums/interfaces in separate files.
 * However, for this test it feels unncessary.
 */
enum StockState {
    ReadyToTry = 1,
    OnTheWay,
    InTheQueue,
    OutOfStock
}

interface IShoe {
    shoeData: {
        id: number;
        name: string;
        category: string;
        size: string;
        colour: string;
        stockState: number;
        customerInitials: string;
    };
}

/**
 * Currently we presume all shoes come back successfully, but we would obviously
 * have a clause in a real app for bad prop data and/or have omittable interface properties
 * in our TS prop type(s)
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
                <img src={require(`../../sprites/${this.props.shoeData.id}.jpg`)} width={"50px"}/>
                <div>{this.props.shoeData.name}</div>
                <div>{this.props.shoeData.category}</div>
                <div>{this.props.shoeData.size}</div>
                <div>{this.props.shoeData.customerInitials}</div>
            </div>
        );
    }

}
