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

class App extends Component {

    constructor(props) {
        super(props);
        /********Added the properties for grid table for showing the response and headers are showing**************************/
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
            paginationPageSize:100,
            rowData: [],
            startDate: moment(),
            endDate:moment(),
            date: new Date(),
            endDatePic:new Date()
        }

        this.onFind = this.onFind.bind(this)
        this.enterPressed = this.enterPressed.bind(this)
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

    /**********using finding the data based on the key enter after filled the start and end, cat and severity*******
     * **************************/
    enterPressed(event) {
        let code = event.keyCode || event.which;
        if(code === 13) {
            this.onFind()
        }
    }

    /***Using React Fetch method to fetch log response based on the selected time severity and category for
     * handling the service call to find data.
     * in log sources selected list:
     if you are choosing 4001 which fetch data from 4002 server
     if you are choosing 4002 which fetch data from 4002 and 4001 servers
     if you are choosing 4003 which fetches data from 4003,4002 and 4001 servers
     **************************************/
    onFind(){
        let url, val,mainUrl,mainurl2,mainurl3 ;
        let st = this.state.date;
        let n = st.toISOString(); //2015-08-28T10:00:00Z

        let et = this.state.endDatePic;
        let endtime = et.toISOString();
        this.setState({paginationPageSie:this.refs.pagezination.value});
        /****handling the error validations for if not selected the start and endtime log sources,page entries, severity and category*******************/
        if(this.refs.logserver.value == '4001' || this.refs.logserver.value == '4002' || this.refs.logserver.value == '4003'){
            if(this.refs.logserver.value !== '' && this.refs.cat.value != '' && this.refs.severity.value != '') {
                if(this.refs.cat.value != 'clog' && this.refs.severity.value != 'ser' && this.refs.pagezination.value !=''){
                    val = "&cat=" + this.refs.cat.value + "&prio=" + this.refs.severity.value + "&num="+this.refs.pagezination.value;
                    url = "http://localhost:" + 4001 + "/log";
                    let url2 = "http://localhost:" + 4002+ "/log";
                    let url3 = "http://localhost:" + 4003+ "/log";
                    mainUrl = url + "?startTime=" + n + "&endTime=" + endtime + val;
                    mainurl2 = url2 + "?startTime=" + n + "&endTime=" + endtime + val;
                    mainurl3 = url3 + "?startTime=" + n + "&endTime=" + endtime + val;

                    if(this.refs.logserver.value == '4001'){
                        url = "http://localhost:" + this.refs.logserver.value + "/log";
                        mainUrl = url + "?startTime=" + n + "&endTime=" + endtime + val;
                        fetch(mainUrl)
                            .then(function(response) {
                                return response.json();
                            })
                            .then(items => this.setState({ rowData: items }));

                    }
                    else if(this.refs.logserver.value == '4002'){

                        Promise.all([this.Servers(mainUrl),this.Servers(mainurl2)]).then((values)=>{
                            this.setState({rowData:values[0].concat(values[1]) });
                        })
                    }
                    else if (this.refs.logserver.value == '4003'){

                        Promise.all([this.Servers(mainUrl),this.Servers(mainurl2),this.Servers(mainurl3)]).then((values)=>{
                            this.setState({rowData:values[0].concat(values[1],values[2]) });
                        })
                    }

                }
                else{
                    alert("valid start& end time ,severity,pagination entries values and category as mandatory");
                }
            }
            else{
                alert(" severity and category as mandatory");
            }

            console.log('first'+this.state.rowData)
        }
        else{
            this.refs.logserver.value ='4001';
            alert("choose logs sources server, valid start and end time, pagination entries severity and category as mandatory");
        }
    }

     Servers = (url)=>new Promise(async(resolve, reject) =>{
        let a = await fetch(url);
        if(a){
            resolve(a.json());
        }else {
            reject(a)
        }
    });
    componentDidMount() {
/******react life cycle used here to do the service for page loading*********************************/
        fetch("http://localhost:4003/log")
            .then(function(response) {
                return response.json();
            })
            .then(items => this.setState({ rowData: items }));
    }

    render() {
        let newdata = this.state.rowData;
        console.log(newdata)
        newdata = newdata.filter(function( element ) {
            return element !== undefined;
        });
        return (
            <div className='wrapper'>
                <div>
                    <div className='parent'>

                            <select ref="logserver">
                                <option value="">Log Sources</option>
                                <option value="4001">Server 4001</option>
                                <option value="4002">Server 4002</option>
                                <option value="4003">Server 4003</option>
                            </select>


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
                            /><span>to</span>
                        </div>
                        <div className='childItems'>

                            <DateTimePicker
                                onChange={this.onChangeEd}
                                value={this.state.endDatePic}
                            />
                        </div>
                        <div className='childItems'>
                            <select ref="severity">
                                <option value="ser">Log Severity</option>
                                {newdata.map(function(log, index) {
                                    if(log.prio != undefined){
                                        return <option  key={index} value={log.prio}>{log.prio}</option>
                                    }

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
                            <button
                                onClick={e => this.onFind(e, 'time')}
                                onKeyPress={this.enterPressed.bind(this)}
                            >
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

/*****class based component to use as single component to manage data handling and html rendering with in  it********/
export default App;