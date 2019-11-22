import React from 'react';
import { Component } from "react";
import './App.css';

//function App() {
    class App extends Component {
        constructor(props) {
            super(props);
            this.state = { data: [] };
            this.onSort = this.onSort.bind(this)
        }

        componentDidMount() {
            fetch("http://localhost:4002/log")
                .then(function(response) {
                    return response.json();
                })
                .then(items => this.setState({ data: items }));
        }

        onSort(event, sortKey){
            /*
            assuming your data is something like
            [
              {accountname:'foo', negotiatedcontractvalue:'bar'},
              {accountname:'monkey', negotiatedcontractvalue:'spank'},
              {accountname:'chicken', negotiatedcontractvalue:'dance'},
            ]
            */
            const data = this.state.data;
            data.sort((a ,b) => a[sortKey].localeCompare(b[sortKey]))
            this.setState({data})
        }

        render() {
            var newdata = this.state.data;
            console.log(newdata);
            return ( <table className="m-table">
                <thead>
                <tr>
                    <th  onClick={e => this.onSort(e, 'time')}>Date</th>
                    <th  onClick={e => this.onSort(e, 'ip')} >IP</th>
                    <th  onClick={e => this.onSort(e, 'prio')}>Severity</th>
                    <th  onClick={e => this.onSort(e, 'cat')}>Category</th>
                    <th  onClick={e => this.onSort(e, 'event')}>Event</th>
                    <th  onClick={e => this.onSort(e, 'action')}>Action</th>
                    <th >Message</th>
                </tr>
                </thead>
                <tbody>
                {newdata.map(function(log, index) {
                    return (
                        <tr key={index} data-item={log}>
                            <td data-title="time">{log.time}</td>
                            <td data-title="ip">{log.ip}</td>
                            <td data-title="priority">{log.prio}</td>
                            <td data-title="category">{log.cat}</td>
                            <td data-title="event">{log.event}</td>
                            <td data-title="action">{log.action}</td>
                            <td data-title="message">{log.message}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>);
        }
}

export default App;
