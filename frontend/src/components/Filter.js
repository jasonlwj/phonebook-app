import React from 'react'

const Filter = ({ filterValue, handleFilterValueChange }) => {
	return (
		<div>
			filter shown with <input value={filterValue} onChange={handleFilterValueChange} />	
		</div>
	)
}

export default Filter 
