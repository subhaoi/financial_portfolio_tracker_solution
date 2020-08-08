import React, { Component } from 'react';
import './AddStockButtons.css';

import AddStockButton from './AddStockButton/AddStockButton';

class AddStockButtons extends Component {
    state = {
        allStocksData: {}
    }
    
    render() {
        console.log(this.props.allStocks)
        let buttons = this.props.allStocks.map(stock => {
            return <AddStockButton key={stock.symbol} stock={stock} clicked={(stock) => this.props.addStock(stock)} />
        })

        return (
            <div className='AddStockButtons'>
                {buttons}
            </div>
        )
    }
}

export default AddStockButtons;
