/* eslint-disable jsx-a11y/anchor-is-valid */
import './header.component.css';
import logo from '../../assets/img/logo.png';
import React, {Component} from "react";
import ProductCategoriesService from '../../services/product-category.service';
import {Button} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {sort} from '../../utils/list-utils';
import {connect} from 'react-redux';
import {buildUrl, getParameterByName} from '../../utils/url-utils';

class Header extends Component {

    constructor(props) {
        super(props);
        this.buildSearchUrl = this.buildSearchUrl.bind(this);
        this.onSearchbarSubmit = this.onSearchbarSubmit.bind(this);
        this.onSearchbarInput = this.onSearchbarInput.bind(this);
        this.onSearchbarKeyPress = this.onSearchbarKeyPress.bind(this);
        this.onCategoriesSwitch = this.onCategoriesSwitch.bind(this);
        this.retrieveSearchbarText = this.retrieveSearchbarText.bind(this);
        this.retrieveProductCategories = this.retrieveProductCategories.bind(this);
        this.getTotalCount = this.getTotalCount.bind(this);
        this.getTotalPrice = this.getTotalPrice.bind(this);

        this.state = {
            isCategoriesOpen: false,
            productCategories: [],
            searchbarText: null,
        };
    }

    componentDidMount() {
        this.retrieveProductCategories();
        this.retrieveSearchbarText();
    }

    onSearchbarInput(e) {
        this.setState({
            searchbarText: e.target.value
        });
    }

    onSearchbarSubmit() {
        if (this.state.searchbarText.length === 0 || this.state.searchbarText.length >= 3) {
            window.location.href = this.buildSearchUrl(null, this.state.searchbarText);
        }
    }

    onSearchbarKeyPress(e) {
        if (e.key === 'Enter') {
            this.onSearchbarSubmit();
        }
    }

    onCategoriesSwitch(e) {
        this.setState({
            isCategoriesOpen: !this.state.isCategoriesOpen
        });
    }

    getTotalCount(user) {
        if (!user) return 0;
        return user.cart.length;
    }

    getTotalPrice(user) {
        if (!user || user.cart.length === 0) return 0;
        return user.cart
            .map(product => product.price)
            .reduce((a, b) => a + b);
    }

    buildSearchUrl(categoryId, text) {
        const queryParameters = new Map();
        queryParameters.set('text', text);
        queryParameters.set('category', categoryId);
        return buildUrl('./search', queryParameters);
    }

    retrieveSearchbarText() {
        this.setState({
           searchbarText: getParameterByName('text')
        });
    }

    retrieveProductCategories() {
        ProductCategoriesService.getAll()
            .then(response => {
                this.setState({
                    productCategories: response.data
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        const searchbarText = this.state.searchbarText;
        const buildSearchUrl = (categoryId) => {
            return this.buildSearchUrl(categoryId);
        }

        return <header>
            <div className="header-container">
                <div className="header-body">
                    <div className="logo-container">
                        <a href="./">
                            <img className="main-logo" src={logo} alt="Main Logo"/>
                        </a>
                    </div>
                    <div className="market-nav-container">
                        <div className="market-nav">
                            <div className="searchbar-container">
                                <div className="searchbar">
                                    <input value={searchbarText} minLength={3} onChange={e => this.onSearchbarInput(e)} onKeyDown={e => this.onSearchbarKeyPress(e)} type="text" className="searchbar-text" placeholder="Search"/>
                                    <button onClick={this.onSearchbarSubmit} type="submit" className="searchbar-button">
                                        <i className="fa fa-search"/>
                                    </button>
                                </div>
                            </div>
                            <ul className="market-nav-link-list">
                                <li>
                                    <a href="#">My Account</a>
                                </li>
                                <li>
                                    <a href={'./wish-list'}>Wish List</a>
                                </li>
                                <li>
                                    <a href={'./shopping-cart'}>Shopping Cart</a>
                                </li>
                                <li>
                                    <a href="#">Checkout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="personal-nav-container">
                        <div className="personal-nav">
                            <a href="#" className="my-account"><i className="fa fa-user"/></a>
                            <div id="cart-block">
                                <div id="cart-heading">
                                    <i id="cart-count"><span
                                        id="total-count">{this.getTotalCount(this.props.user)}</span></i>
                                    <a href="#" className="shopping-cart"><i
                                        className="fa fa-shopping-cart"/></a>
                                    <p><span id="total-price">{this.getTotalPrice(this.props.user)} $</span></p>
                                </div>
                                <div id="cart-content">
                                    <div id="cart-content-ajax">
                                        <div className="empty">Your shopping cart is empty!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-menu-container">
                    <div className="menu">
                        <div className="menu-head">
                            <p>Navigation</p>
                            <Button onClick={this.onCategoriesSwitch}>
                                <MenuIcon color="primary"/>
                            </Button>
                        </div>
                        <ul className={`product-categories ${this.state.isCategoriesOpen ? '' : 'hidden'}`}>
                            {
                                sort(this.state.productCategories, 'name').map(function (productCategory) {
                                    return <li key={'header_' + productCategory.id}>
                                        <a href={buildSearchUrl(productCategory.id, searchbarText)}>{productCategory.name}</a>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    }
}

const mapStateToProps = (state) => {
    const user = state.user;
    return {
        user
    };
}

export default connect(mapStateToProps)(Header);
