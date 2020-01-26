import React from "react";
import "./App.scss";
import mockData from "./mock-data.json";
import Pagination from "./Pagination/Pagination";
import ShoeTile from "./ShoeTile/ShoeTile";

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
 * I'd like to note that filtering via an observable in RxJS would have
 * been much, much cleaner. We could simply pass a setState through the observable, a filter
 * on button click or pagination paging - all through a single observable. However, I wasn't
 * sure if using RxJS would be appropriate, as such I omitted using it and opted for using
 * pure React :) - no libraries or plugins either.
 */
export default class App extends React.Component<any, any> {
  // fix typings here
  private indexesToDisplay: any = [];
  /**
   * Based on the filter, the current amount of shoes being paginated.
   */
  private currentTotalAmountOfShoes: number = 0;

  constructor(props: any) {
    super(props);

    this.state = {
      filterState: 0
    };
    // Initial render
    this.updatePagination(1);
  }

  /**
   * Renders, filters and paginates the tiles.
   * Logic needs breaking down, perhaps moving.
   * @param filterState the shoes stock state
   */
  private renderTiles(filterState: number) {
    // We reset this each new render, incase we change our filter.
    let shoesToDisplayForPage: any = [];

    if (filterState !== 0) {
      const filteredShoeList: any = [];
      // Filter shoes into local array
      mockData.shoes.forEach(shoe => {
        if (filterState === shoe.stockState)
          filteredShoeList.push(shoe);
      });
      // As we filter our pagination, we know the total amount of shoes.
      // Therefore we update our total amount field here, a little bit messy
      // but feels logical enough.
      this.currentTotalAmountOfShoes = filteredShoeList.length;
      shoesToDisplayForPage = this.filterShoesPerPagination(this.indexesToDisplay, filteredShoeList);
    } else {
      // Again, I know this is messy but it works well enough :).
      this.currentTotalAmountOfShoes = mockData.shoes.length;
      shoesToDisplayForPage = this.filterShoesPerPagination(this.indexesToDisplay, mockData.shoes);
    }

    return shoesToDisplayForPage.map((shoe: any, index: number) => {
      return <ShoeTile key={shoe.id} shoeData={shoe}/>;
    });

  }

  /**
   * Maps our current page indexes into a filtered paginated list
   * @param currentIndexArray the current array of indexes we wish to display
   * @param shoeArray the array to filter
   */
  private filterShoesPerPagination(currentIndexArray: any, shoeArray: any): any {
    const shoesToDisplay: any = [];
    currentIndexArray.map((shoeIndex: any) => {
      shoeArray.map((shoe: any, index: any) => {
        if (shoeIndex === index) {
          shoesToDisplay.push(shoe);
        }
      });
    });

    return shoesToDisplay;
  }

  // Lexical scoping ruined ordinary method declaration here...
  /**
   * Updates our pagination fields (indexesToDisplay) and rerenders the entire application
   * Probably need to rerender elsewhere ideally.
   */
  public updatePagination = (pageNumber: number): any => {
    this.indexesToDisplay = this.getSpecificPageTileIndexes(pageNumber);
    this.setState({});
  }

  /**
   * Gets the indexes to be displayed for the page number clicked
   * @param pageNumber the current page the user is on/clicked
   */
  private getSpecificPageTileIndexes(pageNumber: number): number[] {
    const indexesToDisplay = [];
    let indexStartPoint = 0;

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
        <Pagination itemAmount={this.currentTotalAmountOfShoes} newPaginationPage={this.updatePagination} />
      </div>
    );
  }

}
