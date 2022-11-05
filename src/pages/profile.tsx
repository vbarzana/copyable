// Chakra imports
import { Box, Grid } from '@chakra-ui/react'
import Layout from 'layouts/Layout'

import { NextPageWithLayout } from 'types/Layout'

// Custom components
import Banner from 'views/admin/profile/components/Banner'
import General from 'views/admin/profile/components/General'

import Projects from 'views/admin/profile/components/Projects'
import Storage from 'views/admin/profile/components/Storage'
import Upload from 'views/admin/profile/components/Upload'

// Assets
import banner from '../../public/static/img/auth/banner.png'
import avatar from '../../public/static/img/avatars/avatar4.png'

const ProfileOverview: NextPageWithLayout = () => {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '1.34fr 1fr 1.62fr',
        }}
        templateRows={{
          base: 'repeat(3, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Banner
          gridArea="1 / 1 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name="Adela Parkson"
          job="Product Designer"
          posts="17"
          followers="9.7k"
          following="274"
        />
        <Storage
          gridArea={{ base: '2 / 1 / 3 / 2', lg: '1 / 2 / 2 / 3' }}
          used={25.6}
          total={50}
        />
        <Upload
          gridArea={{
            base: '3 / 1 / 4 / 2',
            lg: '1 / 3 / 2 / 4',
          }}
          minH={{ base: 'auto', lg: '420px', '2xl': '365px' }}
          pe="20px"
          pb={{ base: '100px', lg: '20px' }}
        />
      </Grid>
      <Grid
        mb="20px"
        templateColumns={{
          base: '1fr',
          lg: 'repeat(2, 1fr)',
        }}
        templateRows={{
          base: '1fr',
          lg: '2 1fr',
          '2xl': '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Projects
          banner={banner}
          avatar={avatar}
          name="Adela Parkson"
          job="Product Designer"
          posts="17"
          followers="9.7k"
          following="274"
        />
        <General
          gridArea={{ base: '2 / 1 / 3 / 2', lg: '1 / 2 / 2 / 3' }}
          minH="365px"
          pe="20px"
        />
      </Grid>
    </Box>
  )
}

ProfileOverview.getLayout = (p) => {
  return <Layout>{p}</Layout>
}

export default ProfileOverview
