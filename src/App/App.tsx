import React from "react";
import "./App.scss";
import mockData from "./mock-data.json";
import Pagination from "./Pagination/Pagination";
import ShoeTile from "./ShoeTile/ShoeTile";

/**
 * I'd like to note that filtering via an observable in RxJS would have
 * been much, much cleaner. We could simply pass a setState through the observable, a filter
 * on button click or pagination paging - all through a single observable. However, I wasn't
 * sure if using RxJS would be appropriate, as such I omitted using it and opted for using
 * pure React :) - no libraries or plugins either.
 */
export default class App extends React.Component<any, any> {
  private currentAmountOfShoes: number = 0;
  private currentPage: number = 1;
  private currentFilteredShoes: any = [];

  constructor(props: any) {
    super(props);

    this.currentFilteredShoes = mockData.shoes;

    this.state = {
      filterState: 0
    };

    // this.test.bind(this);
  }

  private idk(index: number) {
    // 1 = 4 / 0 - 3
    // 2 = 8 / 4 - 7

  }

  private renderTiles(filterState: number) {
    this.currentAmountOfShoes = 0;
    if (filterState !== 0) {
      return this.currentFilteredShoes.map((shoe: any, index: number) => {
        if (filterState === shoe.stockState) {
          console.log(index);
          return <ShoeTile key={shoe.id} shoeData={shoe}/>;
        }
      });
    } else {
      // Ew, gotta do this better. Just ew, ew ew ew ewwwwwwwwww.
      this.currentAmountOfShoes = mockData.shoes.length;
      this.currentFilteredShoes = mockData.shoes;

      return this.currentFilteredShoes.map((shoe: any, index: number) => {
          return <ShoeTile key={shoe.id} shoeData={shoe}/>;
      });

    }
  }

  // Lexical scoping ruined ordinary method declaration here...
  public updatePagination = (pageNumber: number): any => {
    this.currentPage = pageNumber;

    /**
     * Pagination pattern example:
     * 0  // 1 -- -1  // Doesn't apply, edge case
     * 4  // 2 -- +2  // Doesn't apply, edge case
     * 8  // 3 -- +5  // 3 -1 1 times = 2, 1 * 2 = 2 + 3 = 5, 5 + 3 = 8
     * 12 // 4 -- +8  // 4 -1 2 times = 2, 2 * 2 = 4 + 4 = 8, 8 + 4 = 12
     * 16 // 5 -- +11 // 5 -1 3 times = 2, 3 * 2 = 6 + 5 = 11, 11 + 5 = 16
     * 20 // 6 -- +14 // 6 -1 4 times = 2, 4 * 2 = 8 + 6 = 14, 14 + 6 = 20 -- end number is index starting point :).
     * 24 // 7 -- +17 // 7 -1 5 times = 2, 5 * 2 = 10 + 7 = 17, 17 + 7 = 24
     * 28 // 8 -- +20 // 8 -1 6 times = 2, 6 * 2 = 12 + 8 = 20, 20 + 8 = 28
     * 32 // 9 -- +23 //
     */

    const indexesToDisplay = [];
    let indexStartPoint = 0;

    /**
     * The initial pages 1 and 2 don't follow the conventional pattern of the rest of the pages,
     * hence they're hard coded. Refer to pagination pattern above :).
     */
    // change this to switch statement, its ugly as fuck
    if (pageNumber === 1) {
      indexesToDisplay.push(pageNumber - 1, 1, 2, 3);
      return indexesToDisplay;
    } else if (pageNumber === 2) {
      indexesToDisplay.push(pageNumber + 2, 5, 6, 7);
      return indexesToDisplay;
    } else {
      let localMultiplier = 0;
      for (let i = 2; i < pageNumber; i++) {
        localMultiplier++;
      }
      indexStartPoint = (localMultiplier * 2) + (pageNumber * 2);

      for (let i = 0; i < 4; i++) {
        indexesToDisplay.push(indexStartPoint);
        indexStartPoint++;
      }
      console.log(indexesToDisplay);
      return indexesToDisplay;

    }

  }

  /**
   * Turn filter buttons into component Alex
   */
  public render(): any {
    return (
      <div className="App">
        <div className="filter-buttons">
          <button onClick={() => this.setState({filterState: 0})}>show all</button>
          <button onClick={() => this.setState({filterState: 1})}>ready</button>
          <button onClick={() => this.setState({filterState: 2})}>on the way</button>
          <button onClick={() => this.setState({filterState: 3})}>in the queue</button>
          <button onClick={() => this.setState({filterState: 4})}>out of stock</button>
        </div>
        {this.renderTiles(this.state.filterState)}
        <Pagination itemAmount={this.currentAmountOfShoes} newPaginationPage={this.updatePagination} />
      </div>
    );
  }

}
