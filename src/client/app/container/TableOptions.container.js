import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from '../components/Select'
import Button from '../components/Button'
import { socket } from '../store/socket'
import { selectOptions, getKeys } from '../services'
// action creators
import {
    changeTable,
    changeType,
    restRequest,
    restResponse
} from '../store/reducers/tableOptions'
// action keys
import {
    tables,
    RESPONSE_RESTAPI,
} from '../store/actions'
let { getTables } = tables

class Accts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            types: ["compound","local","global"],
            tables: getTables(this.props.type),
            visible: false
        }
    }

    handleTypeChange(e) {
        this.setState( { tables: getTables(e.target.value) } )
        this.props.changeType(e.target.value)
    }

    handleTableChange(e) {
        this.props.changeTable(e.target.value)
    }

    handleTableLoad( acct, type, table ) {
        this.props.restRequest( {acct, type, table} )
    }

    componentWillReceiveProps(props) {
        this.setState( {visible: props.acctsLength > 0 ? true : false} )
    }

    componentWillMount() {
        socket.on(RESPONSE_RESTAPI, (data) => {
            this.props.restResponse(data.data ? true : false)
        } )
    }

    render() {
        return(
            <div className={this.state.visible ? "tableOptions" : "hidden"} >
                <Select
                selector="type"
                prompt="Type of Table: "
                value={this.props.type}
                options={ selectOptions(this.state.types) }
                change={ this.handleTypeChange.bind(this) }
                />
                <Select
                selector="table"
                prompt="Which Table: "
                value={this.props.table}
                options={ selectOptions(this.state.tables) }
                change={ this.handleTableChange.bind(this) }
                />
                <Button
                selector="submit"
                prompt="load table"
                click={ () => { 
                    this.handleTableLoad( this.props.selectedAcct, this.props.type, this.props.table )
                }}
                />
                <p>{this.props.message}</p>
            </div>
        )
    }
}

const mapState = state => {
    return {
        type: state.tableOptions.type,
        table: state.tableOptions.table,
        message: state.tableOptions.message,
        acctsLength: getKeys(state.accts.accts),
        selectedAcct: state.accts.selectedAcct,
    }
}

const mapDispatch = dispatch => {
    return {
        changeType:  (value) => dispatch( changeType(value) ),
        changeTable: (value) => dispatch( changeTable(value) ),
        restRequest:  (data) => dispatch( restRequest(data) ),
        restResponse: (data) => dispatch( restResponse(data) ),
    }
}

export default connect(mapState, mapDispatch)(Accts)