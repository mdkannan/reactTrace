import React from 'react';
import { Component } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import DateTimePicker from 'react-datetime-picker';
import Popup from "reactjs-popup";

import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import './App.css';

//function App() {
class App extends Component {

    constructor(props) {
        super(props);
        let date = `2015-06-26`;
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
            allLog:[],
            startDate: moment(),
            endDate:moment(),
            date: new Date(),
            endDatePic:new Date()
        }

        this.onFind = this.onFind.bind(this)
      //  this.onChange = this.onChange.bind(this)
     //   this.handleChange = this.handleChange.bind(this);
    //    this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChange = date => this.setState({ date })
    onChangeEd = endDatePic => this.setState({ endDatePic })
    handleChange(date) {
        this.setState({
            startDate: date
        })
        this.setState({
            endDate: date
        })
    }


    onFind(){
        let url, val,mainUrl;
        // console.log(this.refs.starttime.value);
        let st = this.state.date;  //2019-11-24T19:09:57.415Z
        let n = st.toISOString(); //2015-08-28T10:00:00Z //2015-08-28T10:00:00.000Z

        let et = this.state.endDatePic;
        let endtime = et.toISOString();
        this.setState({paginationPageSie:this.refs.pagezination.value});
        if(this.refs.logserver.value == '4001' || this.refs.logserver.value == '4002' || this.refs.logserver.value == '4003'){
            if(this.refs.logserver.value !== '' && this.refs.cat.value != '' && this.refs.severity.value != '') {
                if(this.refs.cat.value != 'clog' && this.refs.severity.value != 'ser'){
                    url = "http://localhost:" + this.refs.logserver.value + "/log";
                    val = "&cat=" + this.refs.cat.value + "&prio=" + this.refs.severity.value + "&num=20";
                    mainUrl = url + "?startTime=" + n + "&endTime=" + endtime + val;
                }
            }
        }
        let url2 ="http://localhost:4002/log";
        let url3 ="http://localhost:4003/log";
        let fullUrl=url+val;
        fetch(mainUrl)
            .then(function(response) {
                return response.json();
            })
            .then(items => this.setState({ rowData: items }));
        console.log('first'+this.state.rowData)
        //let mainUrl2=url2+"?startTime="+n+"&endTime="+endtime+val;
        fetch(mainUrl)
            .then(function(response) {
                return response.json();
            })
            .then(items => this.setState({ rowData: items }));
        console.log('second'+this.state.rowData)
       // let mainUrl3=url3+"?startTime="+n+"&endTime="+endtime+val;
        fetch(mainUrl)
            .then(function(response) {
                return response.json();
            })
            .then(items => this.setState({ rowData: items }));
        console.log('third'+this.state.rowData)
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
                        <div className='childItems'>
                            <select ref="logserver">
                                <option value="">Log Sources</option>
                                <option value="4001">Server 4001</option>
                                <option value="4002">Server 4002</option>
                                <option value="4003">Server 4003</option>
                            </select>
                        </div>

                        <select ref="pagezination">
                            <option value="">Entries Per Page</option>
                            <option value="50">50</option>
                            <option value="30">30</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className='parent'>
                        <div className='childItems'>

                            <DateTimePicker
                                onChange={this.onChange}
                                value={this.state.date}
                            />
                        </div>
                        <div className='childItems'>to

                            <DateTimePicker
                                onChange={this.onChangeEd}
                                value={this.state.endDatePic}
                            />
                        </div>
                        <div className='childItems'>
                            <select ref="severity">
                                <option value="ser">Log Severity</option>
                                {newdata.map(function(log, index) {
                                    return <option  key={index} value={log.prio}>{log.prio}</option>
                                })}
                            </select></div>
                        <div className='childItems'>
                            <select ref="cat">
                                <option value="clog">Log Category</option>
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