import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import PrimaryButton from './PrimaryButton'
import { styled } from '@mui/system'

const UploadBox = styled(Box)(({ theme }) => ({
	border: '2px dashed #0056A2',
	padding: '20px',
	textAlign: 'center',
	backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#F1F1F1',
	color: theme.palette.mode === 'dark' ? '#FFF' : '#003366',
	cursor: 'pointer',
}))

function FileUpload({ onFileUpload }) {
	const [fileName, setFileName] = useState('')

	const handleFileChange = event => {
		const file = event.target.files[0]
		if (file) {
			setFileName(file.name) // Set the name of the selected file
			const reader = new FileReader()
			reader.onload = () => {
				onFileUpload(reader.result) // Call the parent handler with file content
			}
			reader.readAsText(file) // Read file content as text (for CSV)
		}
	}

	const handleDrop = event => {
		event.preventDefault()
		const file = event.dataTransfer.files[0]
		if (file) {
			setFileName(file.name)
			const reader = new FileReader()
			reader.onload = () => {
				onFileUpload(reader.result)
			}
			reader.readAsText(file)
		}
	}

	const handleDragOver = event => {
		event.preventDefault() // Prevent default to allow drop
	}

	return (
		<UploadBox onDrop={handleDrop} onDragOver={handleDragOver}>
			<Typography variant='h6'>Drag & Drop area</Typography>
			<Typography variant='body2'>or</Typography>
			<PrimaryButton component='label'>
				Choose File
				<input type='file' hidden onChange={handleFileChange} />
			</PrimaryButton>
			{fileName && (
				<Typography variant='body2' sx={{ marginTop: '10px' }}>
					Selected file: {fileName}
				</Typography>
			)}
			<Typography variant='body2' sx={{ marginTop: '10px' }}>
				Supported formats: CSV, Excel, JSON
			</Typography>
		</UploadBox>
	)
}

export default FileUpload
