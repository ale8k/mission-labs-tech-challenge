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
  // fix typings here
  /**
   * The indexes of the shoes we wish to display, based on our current pagination
   */
  private indexesToDisplay: any = [];

  /**
   * Based on the filter, the current amount of shoes being paginated
   */
  private currentTotalAmountOfShoes: number = mockData.shoes.length;

  /**
   * Current active page number
   */
  private currentPageNumber = 1;

  /**
   * Pagination interval timer
   */
  private paginationTimer: NodeJS.Timeout = setTimeout(() => null, 0);

  constructor(props: any) {
    super(props);

    this.state = {
      filterState: 0
    };

  }

  public componentDidMount(): void {
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
      // We clear our pagination timer, and immediately restart it.
      this.clearPaginationCarouselTimer();
      this.beginPaginationCarousel(this.currentTotalAmountOfShoes);
      shoesToDisplayForPage = this.filterShoesPerPagination(this.indexesToDisplay, filteredShoeList);
    } else {
      // Again, I know this is messy but it works well enough :).
      this.currentTotalAmountOfShoes = mockData.shoes.length;
      // We clear our pagination timer, and immediately restart it.
      this.clearPaginationCarouselTimer();
      this.beginPaginationCarousel(this.currentTotalAmountOfShoes);
      shoesToDisplayForPage = this.filterShoesPerPagination(this.indexesToDisplay, mockData.shoes);
    }

    return shoesToDisplayForPage.map((shoe: any, index: number) => {
      return <ShoeTile key={shoe.id} shoeData={shoe} />;
    });

  }

  private beginPaginationCarousel(shoeTotal: number) {
    const totalPages = Math.ceil(shoeTotal / 4);

    if (totalPages !== 1) {
      this.paginationTimer = setTimeout(() => {
        if (this.currentPageNumber === totalPages)
          this.currentPageNumber = 0;
        this.currentPageNumber++;
        this.updatePagination(this.currentPageNumber);
      }, 5000);
    }

  }

  private clearPaginationCarouselTimer(): void {
    clearTimeout(this.paginationTimer);
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
    // Reset the page number state, so our carousel continues from here
    this.currentPageNumber = pageNumber;
    // Wonder if there's a better way to force the component to re-render?
    // This feels a little wrong... lol.
    this.setState({});
  }

  /**
   * Gets the indexes to be displayed for the page number clicked
   * @param pageNumber the current page the user is on/clicked
   */
  private getSpecificPageTileIndexes(pageNumber: number): number[] {
    const indexesToDisplay = [];
    let indexStartPoint = 0;

    switch (pageNumber) {
      case 1:
        indexesToDisplay.push(pageNumber - 1, 1, 2, 3);
        return indexesToDisplay;
      case 2:
        indexesToDisplay.push(pageNumber + 2, 5, 6, 7);
        return indexesToDisplay;
      default:
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

  private updateFilterStateAndPageLocation(stateNumber: number): void {
    // We reset our page number to 1, so our carousel may stop
    // in the case there is only 1 page.
    this.currentPageNumber = 1;
    this.updatePagination(1);
    // I'm aware we're performing multiple rerenders, I did look at a PureComponent
    // and ShouldComponentUpdate lifecycle method but I've already done it this way sadly,
    // I hope it's ok I've left it like this.
    this.setState({ filterState: stateNumber });
  }

  /**
   * Turn filter buttons into component Alex
   */
  public render(): any {
    return (
      <div className="App">
        <div className="filter-buttons-container">

          <div className="filter-button" onClick={() => this.updateFilterStateAndPageLocation(0)}>
            <svg height="20" width="27">
              <circle cx="10" cy="10" r="10" stroke="white" stroke-width="1" fill="white" />
            </svg>
            <span>SHOW ALL</span>
          </div>

          <div className="filter-button" onClick={() => this.updateFilterStateAndPageLocation(1)}>
            <svg height="20" width="27">
              <circle cx="10" cy="10" r="10" stroke="white" stroke-width="1" fill="#49D4B1" />
            </svg>
            <span>READY TO TRY</span>
          </div>

          <div className="filter-button" onClick={() => this.updateFilterStateAndPageLocation(2)}>
            <svg height="20" width="27">
              <circle cx="10" cy="10" r="10" stroke="black" stroke-width="1" fill="#68A9DF" />
            </svg>
            <span>ON THE WAY</span>
          </div>

          <div className="filter-button" onClick={() => this.updateFilterStateAndPageLocation(3)}>
            <svg height="20" width="27">
              <circle cx="10" cy="10" r="10" stroke="black" stroke-width="1" fill="#FD672F" />
            </svg>
            <span>IN THE QUEUE</span>
          </div>

          <div className="filter-button" onClick={() => this.updateFilterStateAndPageLocation(4)}>
            <svg height="20" width="27">
              <circle cx="10" cy="10" r="10" stroke="black" stroke-width="1" fill="#F40401" />
            </svg>
            <span>OUT OF STOCK</span>
          </div>

        </div>
        <div className="tile-container">
          {this.renderTiles(this.state.filterState)}
        </div>
        <div className="pagination-container">
          <Pagination
            pageNumber={this.currentPageNumber}
            itemAmount={this.currentTotalAmountOfShoes}
            newPaginationPage={this.updatePagination}/>
        </div>
      </div>
    );
  }

}
