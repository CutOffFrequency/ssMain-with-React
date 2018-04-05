import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select } from '../components'
import { socket } from '../store/socket'
// library
import {
    selectOptions,
    getKeys,
    isTrue,
    isVisible
} from '../services'
// action creators
import {
    // accts
    restRes,
    changeSelect,
    cacheTable,
    // dataTable
    renderTable,
} from '../store/reducers'
// action keys
import { RESPONSE_RESTAPI } from '../store/actions/'

class AcctsContainer extends Component {
    constructor(props) {
        super(props)
    }
    componentWillMount() {
        socket.on(RESPONSE_RESTAPI, (data) => {
            let payload = {
                acct: data.acct,
                resTable: data.table,
                data: JSON.parse(data.body),
                accts: this.props.accts,
                optTable: this.props.table
            }
            this.props.restRes(payload)
        })
    }

    handleSelectChange(e) {
        this.props.changeSelect(e.target.value)
    }

    render() {
        let numAccts = getKeys(this.props.accts).length
        return(
            <div
                className={isVisible(numAccts > 1, 'accts')} >
                <Select
                    selector='accts'
                    prompt='Select an Account:'
                    value={this.props.selectValue}
                    options={ selectOptions(this.props.accts) }
                    change={ this.handleSelectChange.bind(this) } />
            </div>
        )
    }
}

const mapState = state => {
    return {
        accts: state.accts.accts,
        selectValue: state.accts.selectedAcct,
        type: state.tableOptions.type,
        table: state.tableOptions.table,
    }
}

const mapDispatch = dispatch => {
    return {
        changeSelect: (value) => { dispatch( changeSelect(value) ) },
        restRes: (payload) => { dispatch( restRes(payload)) }
    }
}

export default connect(mapState, mapDispatch)(AcctsContainer)