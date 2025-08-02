import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Stack } from '@mui/material';
import { SiGoogleads, SiFacebook, SiTiktok, SiInstagram } from 'react-icons/si';

const MobileAdsManagement: React.FC<{ activeCompany?: string }> = ({ activeCompany }) => {
  const { t } = useTranslation();

  const platforms = [
    { key: 'google', icon: <SiGoogleads size={20} />, label: t('ads.google') },
    { key: 'facebook', icon: <SiFacebook size={20} />, label: t('ads.facebook') },
    { key: 'tiktok', icon: <SiTiktok size={20} />, label: t('ads.tiktok') },
    { key: 'instagram', icon: <SiInstagram size={20} />, label: t('ads.instagram') },
  ];

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        {t('ads.title')}
      </Typography>
      <Typography variant="body2" mb={2}>
        {t('ads.subtitle')}
      </Typography>
      <Stack spacing={2}>
        {platforms.map((p) => (
          <Button key={p.key} variant="contained" fullWidth startIcon={p.icon}>
            {p.label}
          </Button>
        ))}
        <Button variant="outlined" fullWidth>
          {t('ads.createCampaign')}
        </Button>
        <Button variant="outlined" fullWidth>
          {t('ads.manageCampaigns')}
        </Button>
        <Button variant="outlined" fullWidth>
          {t('ads.optimizeCampaigns')}
        </Button>
      </Stack>
    </Box>
  );
};

export default MobileAdsManagement;
