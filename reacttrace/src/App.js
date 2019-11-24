import React from 'react';
import { Component } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './App.css';

//function App() {
class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {headerName: "Date", field: "time"},
                {headerName: "IP", field: "ip"},
                {headerName: "Severity", field: "prio"},
                {headerName: "Category", field: "cat"},
                {headerName: "Event", field: "event"},
                {headerName: "Action", field: "action"},
                {headerName: "Message", field: "message"},
            ],
            paginationPageSize:50,
            rowData: [],
            allLog:[]
        }

        this.onFind = this.onFind.bind(this)
    }

    onFind(){
        console.log(this.refs.endtime.value);
        this.setState({paginationPageSie:this.refs.pagezination.value});
        //http://localhost:12345/log?startTime=2015-08-28T10:
        // 00:00Z&endTime=2015-08-28T11:00:00Z&cat=OSPF&prio=3&num=40
        let url="http://localhost:4001/log";
        let url2 ="http://localhost:4002/log";
        let url3 ="http://localhost:4003/log";
        let val ="&cat="+this.refs.cat.value+"&prio="+this.refs.severity.value+"&num=20";
        //2015-08-28T10:59:53Z
        let fullUrl=url+val;
       // fetch(url+"?startTime=2015-08-28T10:\n" +
       //     "00:00Z&endTime=2015-08-28T11:00:00Z&cat=OSPF&prio=3&num=30")
        fetch(url+"?startTime=2015-08-28T10:\n" +
            "00:00Z&endTime=2015-08-28T11:00:00Z"+val)
            .then(function(response) {
                return response.json();
            })
            .then(items => this.setState({ rowData: items }));


        Promise.all([
            fetch(url+"?startTime=2015-08-28T10:\n" +
                "00:00Z&endTime=2015-08-28T11:00:00Z"+val),
            fetch(url2+"?startTime=2015-08-28T10:\n" +
                "00:00Z&endTime=2015-08-28T11:00:00Z"+val),
            fetch(url3+"?startTime=2015-08-28T10:\n" +
                "00:00Z&endTime=2015-08-28T11:00:00Z"+val)
        ]).then(allResponses => {
            const response1 = allResponses[0]
            const response2 = allResponses[1]
            const response3 = allResponses[2]


        //    this.setState({ rowData: allArr })


        })
    }


    componentDidMount() {

        fetch("http://localhost:4003/log")
            .then(function(response) {
                return response.json();
            })
            .then(items => this.setState({ rowData: items }));
    }

    render() {
        let newdata = this.state.rowData;
        console.log(newdata)
        return (
            <div className='wrapper'>
                <div>
                    <div className='parent'>
                        <div className='childItems'>Log Sources</div>
                        <select ref="pagezination">
                            <option value="">Entries Per Page</option>
                            <option value="50">50</option>
                            <option value="30">30</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className='parent'>
                        <div className='childItems'>
                            <select ref="starttime">
                                <option>Start Date</option>
                                {newdata.map(function(log, index) {
                                    return <option  key={index} value={log.time}>{log.time}</option>
                                })}
                            </select>
                        </div>
                        <div className='childItems'>to
                            <select ref="endtime">
                                <option>end</option>
                                {newdata.map(function(log, index) {
                                    return <option  key={index} value={log.time}>{log.time}</option>
                                })}
                            </select></div>
                        <div className='childItems'>
                            <select ref="severity">
                                <option>Log Severity</option>
                                {newdata.map(function(log, index) {
                                    return <option  key={index} value={log.prio}>{log.prio}</option>
                                })}
                            </select></div>
                        <div className='childItems'>
                            <select ref="cat">
                                <option>Log Category</option>
                                {newdata.map(function(log, index) {
                                    return <option  key={index} value={log.cat}>{log.cat}</option>
                                })}
                            </select></div>
                        <div className='childItems'>
                            <select ref="eventlog">
                                <option>log event</option>
                                {newdata.map(function(log, index) {
                                    return <option  key={index} value={log.event}>{log.event}</option>
                                })}
                            </select>
                        </div>
                        <div className='childItems'>
                            <select ref="actionlog">
                                <option>log action</option>
                                {newdata.map(function(log, index) {
                                    return <option  key={index} value={log.action}>{log.action}</option>
                                })}
                            </select>
                        </div>
                        <div className='childItems'>
                            <select ref="ip">
                                <option>LogIp</option>
                                {newdata.map(function(log, index) {
                                    return <option  key={index} value={log.ip}>{log.ip}</option>
                                })}
                            </select></div>
                        <div className='childItems'>
                            <button onClick={e => this.onFind(e, 'time')}>
                            find
                        </button>
                        </div>
                    </div>
                </div>
                <div
                    className="ag-theme-balham"
                    style={{ height: '600px', width: '100%' }}
                >
                    <AgGridReact
                        enableSorting={true}
                        enableFilter={true}
                        pagination={true}
                        columnDefs={this.state.columnDefs}
                    paginationPageSize={this.state.paginationPageSize}
                        rowData={this.state.rowData}>
                    </AgGridReact>
                </div>
            </div>
        );
    }
}

export default App;