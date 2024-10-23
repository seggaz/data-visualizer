import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const ChartTypeSelector = ({ chartType, onChartTypeChange, themeMode }) => (
	<FormControl
		fullWidth
		sx={{
			marginTop: '20px',
			backgroundColor: themeMode === 'dark' ? '#424242' : '#FFFFFF',
			borderRadius: '4px',
		}}
	>
		<InputLabel
			id='chart-type-label'
			sx={{
				color: themeMode === 'dark' ? '#FFFFFF' : '#000000',
			}}
		>
			Chart Type
		</InputLabel>
		<Select
			labelId='chart-type-label'
			value={chartType}
			onChange={onChartTypeChange}
			label='Chart Type'
			sx={{
				backgroundColor: themeMode === 'dark' ? '#424242' : '#FFFFFF',
				color: themeMode === 'dark' ? '#FFFFFF' : '#000000',
				'& .MuiSelect-icon': {
					color: themeMode === 'dark' ? '#FFFFFF' : '#000000',
				},
			}}
		>
			<MenuItem value='line'>Line Chart</MenuItem>
			<MenuItem value='bar'>Bar Chart</MenuItem>
			<MenuItem value='pie'>Pie Chart</MenuItem>
		</Select>
	</FormControl>
)

export default ChartTypeSelector
