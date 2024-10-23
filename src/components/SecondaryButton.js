import { Button } from '@mui/material'
import { styled } from '@mui/system'

const SecondaryButton = styled(Button)(({ theme }) => ({
	backgroundColor: '#FFD700',
	color: '#000000',
	padding: '8px 16px',
	fontSize: 'calc(10px + (14 - 10) * ( (100vw - 480px) / ( 1024 - 480) ))',
	'&:hover': {
		backgroundColor: '#E6B800',
	},
}))

export default SecondaryButton
