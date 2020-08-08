import React, { Component } from 'react';
import './MyStocks.css';
import Axios from 'axios';
import { isEqual } from 'lodash';

class MyStocks extends Component {
    state = {
        myStocks: {},
        isError: false
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isEqual(nextState, this.state)
    }

    createRows = () => {
        let rows = {};
        Object.keys(this.props.myStocks).map(row => {
            let dataRow = this.props.myStocks[row];
            rows[dataRow.symbol] = {...dataRow};
            // 2BEXLL47M5CJTGUH
            // 34BUQC6DXWG9GSAE
            Axios.get('https://cloud.iexapis.com/stable/stock/'+dataRow.symbol+'/batch?types=quote&range=1m&last=10&token=pk_054e6a13c28f4452a98176bebd09f0f7')
                .then(response => {
                    let serverData = response.data["quote"];
                    let currentClosingPrice = serverData["close"];
                    let calculateProfit = parseInt([currentClosingPrice - dataRow.closingPrice] * dataRow.numberOfShares);
                    rows[dataRow.symbol].currentClosingPrice = currentClosingPrice;
                    rows[dataRow.symbol].calculateProfit = calculateProfit;
                    this.setState({myStocks: rows})
                })
                .catch(error => {
                    console.log(error);
                    this.setState({
                        isError: true
                    })
                });
            return true;
        })
    }

    render() {
        if(Object.keys(this.props.myStocks).length > 0 && Object.keys(this.props.myStocks).length !== Object.keys(this.state.myStocks).length && this.state.isError === false) {
            this.createRows();
        }
        let rows = Object.keys(this.state.myStocks).map(stock => {
            let stockData = this.state.myStocks[stock];
            let stockRow = (
                <tr key={stockData.symbol}>
                    <td>{stockData.symbol}</td>
                    <td>{stockData.name}</td>
                    <td>{stockData.numberOfShares}</td>
                    <td>{stockData.closingPrice}</td>
                    <td>{stockData.currentClosingPrice}</td>
                    <td>{stockData.calculateProfit}</td>
                    <td><button className='StopTrackingBtn' onClick={() => this.props.stopTracking(stockData.symbol)}>Stop Tracking</button></td>
                </tr>
            )
            return stockRow;
        })
        return (
            <div className='MyStocks'>
                <div className='Header'>
                    <span className='MyStocksTitle'>My Stocks</span>
                    {/* <input type='text' className='SearchBar' placeholder='Search...' /> */}
                </div>
                <div className='Body'>
                    {
                        this.state.isError ?
                        <p>There seems to be a server issue, please try again later.</p> :
                        <table id='MyStocksTable' className='MyStocksTable'>
                            <thead>
                                <tr>
                                    <th>Stock symbol</th>
                                    <th>Stock name</th>
                                    <th>No.of shares</th>
                                    <th>Buy price</th>
                                    <th>Current price</th>
                                    <th>Profit/Loss</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        )
    }
}

export default MyStocks;