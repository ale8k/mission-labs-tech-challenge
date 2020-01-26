import React from "react";

export default class Pagination extends React.Component
<{ itemAmount: number , newPaginationPage: (pageNum: number) => void}> {
    constructor(props: { itemAmount: number, newPaginationPage: (pageNum: number) => void}) {
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
            <div>
                {this.getPageAmount(this.props.itemAmount).map(pageNumber => {
                    return <button onClick={() => this.props.newPaginationPage(pageNumber)}>{pageNumber}</button>;
                })}
            </div>
        );
    }
}
