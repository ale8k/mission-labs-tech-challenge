import React from "react";
import "./Pagination.scss";

export default class Pagination extends React.Component
<{ pageNumber: number, itemAmount: number , newPaginationPage: (pageNum: number) => void}> {
    constructor(props: { pageNumber: number, itemAmount: number, newPaginationPage: (pageNum: number) => void}) {
        super(props);
    }

    private getPageAmount(itemAmount: number): number[] {
        const amountArr = [];
        let pageNumber = 0;
        for (let i = 0; i < (Math.ceil(itemAmount / 4)); i++) {
            amountArr.push(++pageNumber);
        }
        return amountArr;
    }

    public render() {
        return (
            <div className="pagination-container">
                <div className="pagination-button-container">
                {this.getPageAmount(this.props.itemAmount).map((pageNumber, i) => {
                    return <div
                        className={pageNumber === this.props.pageNumber ? "pagination-button active" : "pagination-button"}
                        key={i}
                        onClick={() => this.props.newPaginationPage(pageNumber)}>
                    </div>;
                })}
                </div>
                <div className="page-counter">
                    {this.props.pageNumber}
                    |
                    {Math.ceil(this.props.itemAmount / 4)}
                </div>
            </div>
        );
    }
}
