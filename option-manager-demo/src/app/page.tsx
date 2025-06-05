import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import {
  Assignment as StatusIcon,
  PriorityHigh as PriorityIcon,
  Category as ClassificationIcon,
} from '@mui/icons-material'

export default function Home() {
  const demoPages = [
    {
      title: 'Status Manager',
      description: 'Manage task statuses with drag-and-drop reordering',
      href: '/status-manager',
      icon: <StatusIcon sx={{ fontSize: 48 }} />,
      color: '#4caf50',
    },
    // {
    //   title: 'Priority Manager',
    //   description: 'Configure priority levels for tasks',
    //   href: '/priority-manager',
    //   icon: <PriorityIcon sx={{ fontSize: 48 }} />,
    //   color: '#ff9800',
    // },
    // {
    //   title: 'Classification Manager',
    //   description: 'Set up task classifications and categories',
    //   href: '/classification-manager',
    //   icon: <ClassificationIcon sx={{ fontSize: 48 }} />,
    //   color: '#9c27b0',
    // },
  ]

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}></Box>

      <Grid container spacing={4}>
        {demoPages.map((page) => (
          <Grid xs={12} sm={6} md={4} key={page.href}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition:
                  'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2, color: page.color }}>{page.icon}</Box>
                <Typography variant='h6' component='h2' gutterBottom>
                  {page.title}
                </Typography>
                <Typography variant='body2' color='textSecondary' paragraph>
                  {page.description}
                </Typography>
                <Button
                  component={Link}
                  href={page.href}
                  variant='contained'
                  fullWidth
                  sx={{
                    mt: 'auto',
                    backgroundColor: page.color,
                    '&:hover': {
                      backgroundColor: page.color,
                      filter: 'brightness(0.9)',
                    },
                  }}
                >
                  View Demo
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
