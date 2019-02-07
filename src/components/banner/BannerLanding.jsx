import React,{Component} from 'react'
import FlightSchedule from './Flights/FlightSchedule'
import HotelsBanner from './Hotels/HotelsBanner'
import CollectionBanner from './Collection/CollectionBanner'
import TrainsBanner from './Trains/TrainsBanner'
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import './Banner.css'
class BannerLanding extends Component{
	constructor(props){
		super(props)
		this.state={
			banner_type:''
		}
		this.handleChange = this.handleChange.bind(this)
	}
	handleChange(e){
		this.setState({
			banner_type: e.target.value
		})
	}
	render(){
		const banner_type = this.state.banner_type
		return(
			<div>
		{/*	
			<select  onChange={this.handleChange} >
			<option value="Flights" name="Flights">Flights</option>
			<option value="Hotels" name="Hotels">Hotels</option>
			<option value="Trains" name="Trains">Trains</option>
			<option value="Collection" name="Collection">Collection</option>
			</select>
			 {banner_type === 'Trains'  || banner_type == 'Hotels' ?(banner_type === 'Trains' ? <TrainsBanner /> : <HotelsBanner />) :(banner_type === 'Collection' ? <CollectionBanner /> : <FlightSchedule />)}
		*/}
			<FlightSchedule />
			</div>
			)
	}
}
export default BannerLanding