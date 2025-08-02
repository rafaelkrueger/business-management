import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Grid, Button, Stack } from '@mui/material';
import { SiGoogleads, SiFacebook, SiTiktok, SiInstagram } from 'react-icons/si';

const AdsManagement: React.FC<{ activeCompany?: string }> = ({ activeCompany }) => {
  const { t } = useTranslation();

  const platforms = [
    { key: 'google', icon: <SiGoogleads size={24} />, label: t('ads.google') },
    { key: 'facebook', icon: <SiFacebook size={24} />, label: t('ads.facebook') },
    { key: 'tiktok', icon: <SiTiktok size={24} />, label: t('ads.tiktok') },
    { key: 'instagram', icon: <SiInstagram size={24} />, label: t('ads.instagram') },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {t('ads.title')}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {t('ads.subtitle')}
      </Typography>
      <Grid container spacing={2} mb={4}>
        {platforms.map((p) => (
          <Grid item xs={6} md={3} key={p.key}>
            <Button variant="contained" fullWidth startIcon={p.icon}>
              {p.label}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined">{t('ads.createCampaign')}</Button>
        <Button variant="outlined">{t('ads.manageCampaigns')}</Button>
        <Button variant="outlined">{t('ads.optimizeCampaigns')}</Button>
      </Stack>
    </Box>
  );
};

export default AdsManagement;
