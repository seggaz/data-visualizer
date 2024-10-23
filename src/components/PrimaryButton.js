import { Button } from '@mui/material'
import { styled } from '@mui/system'

const PrimaryButton = styled(Button)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#003366',
	color: '#FFFFFF',
	padding: '12px 24px',
	'&:hover': {
		backgroundColor: theme.palette.mode === 'dark' ? '#82b1ff' : '#00284D',
	},
}))

export default PrimaryButton
