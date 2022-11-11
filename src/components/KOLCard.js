import React from 'react'
import { Card, CardActions, CardContent, Typography, Button } from '@mui/material'

const KOLCard = (props) => {
  const first = props.first_name
  const last = props.last_name
  const npi = props.npi

  return (
    <Card sx={{ maxWidth: 400, mb: 2 }}>
      <CardContent>
        <Typography>
          NPI Number: {npi}
        </Typography>
        <Typography>
          {first} {last}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => props.action(first, last, npi)}>Add To List</Button>
      </CardActions>
    </Card>
  )
}

export default KOLCard