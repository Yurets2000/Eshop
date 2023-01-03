import './App.css';
import React, {Component} from 'react';
import {constants} from './constants';
import {v4 as uuid_v4} from 'uuid';
import UserService from './services/user.service';
import Header from './components/header/header.component';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Offerings from './components/offerings/offerings.component';
import Search from './components/search/search.component';
import Footer from './components/footer/footer.component';
import {connect} from 'react-redux';
import allActions from './actions/index';
import ShoppingCart from './components/shopping-cart/shopping-cart.component';
import WishList from './components/wish-list/wish-list.component';

class App extends Component {

    constructor(props) {
        super(props);
        this.loginAnonymous = this.loginAnonymous.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        const user = this.props.user;
        if (!user || !user.id) {
            this.loginAnonymous();
        } else {
            console.log('retrieved from cache user: ' + JSON.stringify(user));
        }
    }

    loginAnonymous() {
        const anonymousUser = constants.DEFAULT_USER;
        anonymousUser.username = 'Anonymous User';
        anonymousUser.email = uuid_v4();
        anonymousUser.password = uuid_v4();
        UserService.create(anonymousUser)
            .then(response => {
                console.log('loginAnonymous: ' + JSON.stringify(response.data));
                this.props.dispatch(allActions.userActions.setUser(response.data));
            })
            .catch(e => {
                console.log(e);
            });
    }

    login(email, password) {
        UserService.findByEmailAndPassword(email, password)
            .then(response => {
                console.log('login: ' + JSON.stringify(response.data));
                this.props.dispatch(allActions.userActions.setUser(response.data));
            })
            .catch(e => {
                console.log(e);
            });
    }

    logout() {
        console.log('logout');
        this.props.dispatch(allActions.userActions.setUser(constants.DEFAULT_USER));
    }

    render() {
        return <div className="body-wrapper">
            <Router>
                <Header/>
                <main>
                    <div className="content-container">
                        <Switch>
                            <Route exact path="/">
                                <Offerings/>
                            </Route>
                            <Route path="/search">
                                <Search/>
                            </Route>
                            <Route path="/shopping-cart">
                                <ShoppingCart/>
                            </Route>
                            <Route path="/wish-list">
                                <WishList/>
                            </Route>
                        </Switch>
                    </div>
                </main>
                <Footer/>
            </Router>
        </div>
    }
}

const mapStateToProps = (state) => {
    const user = state.user;
    return {
        user
    };
}

export default connect(mapStateToProps)(App);
