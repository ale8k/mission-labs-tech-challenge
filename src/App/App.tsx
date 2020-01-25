import React from "react";
import "./App.scss";
import mockData from "./mock-data.json";
import Pagination from "./Pagination/Pagination";
import ShoeTile from "./ShoeTile/ShoeTile";

/**
 * I'd like to note that filtering via an observable in RxJS would have
 * been much, much cleaner. We could simply pass a setState through the observable, a filter
 * on button click or pagination paging - all through a single observable. However, I wasn't
 * sure if using RxJS would be appropriate, as such I omitted using it.
 */
export default class App extends React.Component<any, any> {
  private currentAmountOfShoes: number = 0;

  constructor(props: any) {
    super(props);
    this.state = {
      filterState: 0
    };
  }

  private renderTiles(filterState: number) {
    this.currentAmountOfShoes = 0;
    if (filterState !== 0) {
      return mockData.shoes.map(shoe => {
        if (filterState === shoe.stockState) {
          this.currentAmountOfShoes += 1;
          return <ShoeTile key={shoe.id} shoeData={shoe}/>;
        }
      });
    } else {
      this.currentAmountOfShoes = mockData.shoes.length;
      return mockData.shoes.map(shoe => <ShoeTile key={shoe.id} shoeData={shoe}/>);
    }
  }

  private test() {
    console.log("hi from app comp");
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
        <Pagination itemAmount={this.currentAmountOfShoes} testFunc={this.test} />
      </div>
    );
  }

}
