// components/SpaceAnimation.jsx
import React from 'react';
import { Box } from '@mui/material';
import { RocketLaunch } from '@mui/icons-material';

const SpaceAnimation = () => {
  return (
    <>
      {/* Foguete com movimentação direcional como um foguete real */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          animation: 'rocketFlight 25s linear infinite',
          '@keyframes rocketFlight': {
            '0%': { transform: 'translate(0%, 0%) rotate(45deg)', opacity: 1 },
            '20%': { transform: 'translate(20vw, 10vh) rotate(60deg)' },
            '40%': { transform: 'translate(40vw, 25vh) rotate(75deg)' },
            '60%': { transform: 'translate(60vw, 45vh) rotate(80deg)' },
            '80%': { transform: 'translate(80vw, 70vh) rotate(90deg)' },
            '100%': { transform: 'translate(100vw, 100vh) rotate(100deg)', opacity: 0 },
          },
        }}
      >
        <RocketLaunch
          sx={{
            fontSize: 100,
            color: 'rgba(255,255,255,0.95)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: 0,
            width: 120,
            height: 20,
            borderRadius: '50%',
            filter: 'blur(5px)',
            transform: 'rotate(-45deg)',
            transformOrigin: 'left center',
          }}
        />
      </Box>

      {/* Estrelas com efeito de paralaxe */}
      {[...Array(30)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: `${Math.random() * 95}%`,
            left: `${Math.random() * 95}%`,
            width: 2 + Math.random() * 2,
            height: 2 + Math.random() * 2,
            borderRadius: '50%',
            backgroundColor: 'white',
            opacity: 0.5,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            '@keyframes twinkle': {
              '0%, 100%': { opacity: 0.3 },
              '50%': { opacity: 1 },
            },
          }}
        />
      ))}

      {/* Satélite orbitando com flare */}
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          left: '5%',
          animation: 'satelliteOrbit 25s linear infinite',
          '@keyframes satelliteOrbit': {
            '0%': {
              transform: 'rotate(0deg) translateX(180px) rotate(0deg)',
              opacity: 0,
            },
            '10%': { opacity: 1 },
            '90%': { opacity: 1 },
            '100%': {
              transform: 'rotate(360deg) translateX(180px) rotate(-360deg)',
              opacity: 0,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 15,
              height: 5,
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              boxShadow: '0 0 6px rgba(255,255,255,0.5)',
            }}
          />
          <Box
            sx={{
              width: 25,
              height: 10,
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: '50%',
              ml: 0.5,
              boxShadow: '0 0 4px rgba(255,255,255,0.4)',
            }}
          />
        </Box>
      </Box>

      {/* Planeta 3D com anéis girando */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-60px',
          right: '-60px',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #0d47a1, #000)',
          boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '180%',
            height: '15px',
            background: 'rgba(255,255,255,0.05)',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            borderRadius: '50%',
            animation: 'spinRing 20s linear infinite',
          },
          '@keyframes spinRing': {
            from: { transform: 'translate(-50%, -50%) rotate(0deg)' },
            to: { transform: 'translate(-50%, -50%) rotate(360deg)' },
          },
        }}
      />
    </>
  );
};

export default SpaceAnimation;
