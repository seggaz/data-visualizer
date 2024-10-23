import React, { useState, useRef } from 'react'
import { Button, Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import {
	SaveAlt,
	PictureAsPdf,
	Brightness4,
	Brightness7,
	GetApp,
} from '@mui/icons-material'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Tooltip,
	Legend,
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import PrimaryButton from './components/PrimaryButton'
import SecondaryButton from './components/SecondaryButton'
import FileUpload from './components/FileUpload'
import ChartTypeSelector from './components/ChartTypeSelector'
import C2S from 'canvas2svg'

// Register chart.js components and zoom plugin
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Tooltip,
	Legend,
	zoomPlugin
)

function App() {
	const [chartType, setChartType] = useState('')
	const [data, setData] = useState(null)
	const [, setFileContent] = useState('')
	const [themeMode, setThemeMode] = useState('light')
	const chartRef = useRef(null)

	// Access theme and breakpoint info from Material-UI
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

	// Function to handle chart type change
	const handleChartTypeChange = event => {
		setChartType(event.target.value)
	}

	// Function to handle file upload and parse CSV data
	const handleFileUpload = fileContent => {
		const parsedData = parseCSV(fileContent)
		setData(parsedData)
		setFileContent(fileContent)
	}

	// Function to parse CSV content and convert it into chart data format
	const parseCSV = fileContent => {
		const lines = fileContent.split('\n')
		const labels = lines[0].split(',')
		const dataPoints = lines.slice(1).map(line => line.split(',').map(Number))

		// Return data in a format suitable for Chart.js
		return {
			labels,
			datasets: [
				{
					label: 'My Dataset',
					data: dataPoints.flat(), // Flatten data points array for plotting
					backgroundColor: '#003366',
					borderColor: '#6b6a6a',
					borderWidth: 2,
				},
			],
		}
	}

	// Handle chart generation once a chart type and data are selected
	const handleGenerateChart = () => {
		if (!chartType) {
			alert('Please select a chart type first.')
			return
		}

		if (!data) {
			alert('Please upload a file first.')
			return
		}

		// Update the chart with the new data
		setData(data)
	}

	// Function to render the selected chart type
	const renderChart = () => {
		if (!data) return null

		// Options for the chart, including zoom and pan features
		const options = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				zoom: {
					pan: {
						enabled: true,
						mode: 'x',
					},
					zoom: {
						wheel: {
							enabled: true,
						},
						pinch: {
							enabled: true,
						},
						mode: 'x',
					},
				},
			},
		}

		// Switch between chart types based on the selected type
		switch (chartType) {
			case 'line':
				return <Line data={data} options={options} ref={chartRef} />
			case 'bar':
				return <Bar data={data} options={options} ref={chartRef} />
			case 'pie':
				return <Pie data={data} options={options} ref={chartRef} />
			default:
				return null
		}
	}

	// Toggle between light and dark themes
	const handleThemeSwitch = () => {
		setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'))
	}

	// Export the chart as a PNG image
	const handleExportPNG = async () => {
		if (!chartRef.current) {
			alert('The diagram is not available for export!')
			return
		}
		const chartCanvas = chartRef.current.canvas
		const canvas = await html2canvas(chartCanvas)
		const link = document.createElement('a')
		link.href = canvas.toDataURL('image/png')
		link.download = 'chart.png'
		link.click()
	}

	// Export the chart as a PDF
	const handleExportPDF = async () => {
		if (!chartRef.current) {
			alert('The diagram is not available for export!')
			return
		}
		const chartCanvas = chartRef.current.canvas
		const canvas = await html2canvas(chartCanvas)
		const imgData = canvas.toDataURL('image/png')
		const pdf = new jsPDF()
		pdf.addImage(imgData, 'PNG', 10, 10, 180, 160)
		pdf.save('chart.pdf')
	}

	// Export the chart as an SVG
	const handleExportSVG = () => {
		if (!chartRef.current) {
			alert('The diagram is not available for export!')
			return
		}

		const chartInstance = chartRef.current

		if (!chartInstance) {
			alert('Chart instance is not available!')
			return
		}

		const c2s = new C2S(chartInstance.width, chartInstance.height) // Initialize canvas2svg
		chartInstance.ctx = c2s
		chartInstance.update()

		const svg = c2s.getSerializedSvg()
		const link = document.createElement('a')
		link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
		link.download = 'chart.svg'
		link.click()

		chartInstance.ctx = chartRef.current.canvas.getContext('2d')
		chartInstance.update()
	}

	// Reset the chart data and selections
	const handleReset = () => {
		setData(null)
		setFileContent('')
		setChartType('')
	}

	return (
		<Box
			sx={{
				padding: '20px',
				backgroundColor: themeMode === 'dark' ? '#121212' : '#ffffff',
				minHeight: '100vh',
				color: themeMode === 'dark' ? '#ffffff' : '#000000',
			}}
		>
			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography variant='h4' sx={{ marginBottom: '20px' }}>
					Data Visualizer Tool
				</Typography>
				<Button
					startIcon={themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
					onClick={handleThemeSwitch}
				>
					{themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
				</Button>
			</Box>
			<FileUpload onFileUpload={handleFileUpload} />{' '}
			{/* Pass the file upload handler */}
			<ChartTypeSelector
				chartType={chartType}
				onChartTypeChange={handleChartTypeChange}
				themeMode={themeMode}
			/>
			<PrimaryButton sx={{ marginTop: '20px' }} onClick={handleGenerateChart}>
				Generate Chart
			</PrimaryButton>
			<Box sx={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
				<SecondaryButton onClick={handleExportPNG} startIcon={<SaveAlt />}>
					Export PNG
				</SecondaryButton>
				<SecondaryButton onClick={handleExportPDF} startIcon={<PictureAsPdf />}>
					Export PDF
				</SecondaryButton>
				<SecondaryButton onClick={handleExportSVG} startIcon={<GetApp />}>
					Export SVG
				</SecondaryButton>
				<SecondaryButton onClick={handleReset}>Reset</SecondaryButton>
			</Box>
			<Box sx={{ marginTop: '40px', height: isMobile ? '300px' : '500px' }}>
				{renderChart()}
			</Box>
		</Box>
	)
}

export default App
