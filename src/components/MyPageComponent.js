import React, { Component } from 'react';
import {
    TabContent, TabPane, Nav, NavItem, NavLink
} from 'reactstrap';
import classnames from 'classnames';
import Datetime from 'react-datetime';
import OneDay from './OneDayComponent';
import Period from './PeriodComponent';
import MyList from './MyList';
import cookie from '../shared/common';

export default class MyPage extends Component {
    constructor(props) {
        super(props);
        const userInfo = sessionStorage.getItem('userInfo') || cookie.getCookie('userInfo');
        this.toggle = this.toggle.bind(this);
        if (userInfo) {
            this.state = {
                activeTab: '1',
                selectedDate: new Date(),
                firstPage: 1,
                currentPage: 0,
                prevPage: 0,
                nextPage: 0,
                lastPage: 0,
                pageIdx: [],
                userInfo: userInfo
            };
        } else {
            this.state = {
                activeTab: '1',
                selectedDate: new Date(),
                firstPage: 1,
                currentPage: 0,
                prevPage: 0,
                nextPage: 0,
                lastPage: 0,
                pageIdx: []
            };
        }

    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        var yesterday = Datetime.moment().subtract(1, 'day');
        var valid = function (current) {
            return current.isAfter(yesterday);
        };

        return (
            <div className="m-5">
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                            userinfo={this.state.userInfo}
                        >
                            One Day Schedule
            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                            userinfo={this.state.userInfo}
                        >
                            Long Period Schedule
            </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                            userinfo={this.state.userInfo}
                        >
                            My Schedules
            </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <OneDay valid={valid} />
                    </TabPane>
                    <TabPane tabId="2">
                        <Period valid={valid} />
                    </TabPane>
                    <TabPane tabId="3">
                        <MyList />
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}
