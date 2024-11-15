import { AppBar, Toolbar, Typography } from '@mui/material'

const CustomAppBar = () => {
  return (
    <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" color="text.primary">
              DaYu: A Non-Crime Safety App
            </Typography>
          </Toolbar>
        </AppBar>
  )
}

export default CustomAppBar