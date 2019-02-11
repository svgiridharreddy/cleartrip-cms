import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UniqueData extends Component {
	render() {
		return(
				<div>
		        	<table>
		        		<tbody>
		        		{
		        			this.props.datacollection.map((item, i)=>{
		        				return (
			        					<tr key={i}>
						        			<td>{item.domain_url}</td>
						        			<td>{item.content_type}</td>
						        			<td>{item.meta_title}</td>
						        			<td><Link to={`hotels/show/uniqueData/${item.id}`}>View</Link></td>
						        		</tr>
		        					)
		        			} )
		        		}
		        		</tbody>
		        	</table>
		        </div>
			)
	}
}

export default UniqueData;