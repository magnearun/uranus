import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data

export const formatPrice = (price: number) => {
  //   const formatter = new Intl.NumberFormat('is-is', {
  //     style: 'currency',
  //     currency: 'ISK',
  //   });

  return `${price}`;
};

function createData(
  id: number,
  name: string,
  amount: number,
  displayAmount?: string
) {
  return { id, name, amount, displayAmount };
}

interface Props {
  price: number;
  co2: number;
  EURISKConversion: number;
}

export default function Calculator({ price, co2, EURISKConversion }: Props) {
  const priceISK = price * EURISKConversion;
  const N2 = 0.28;
  const urvinnslugjald = 3133; // ISK
  const forskraning = 17021; // ISK
  const skodun = 17959; // ISK

  const rows = [
    createData(0, 'GEO-trans', 400 * EURISKConversion),
    createData(1, 'Þóknun', 300 * EURISKConversion),
    createData(2, 'Sjófrakt (Eimskip)', 105000, formatPrice(105000)), // ISK
    createData(3, 'Tollskýrsla', 5000), // ISK
  ];

  const verdTilTolls = rows.reduce((a, b) => a + b.amount, priceISK);
  const vorugjold = (Math.max(0, co2 - 85) * verdTilTolls * N2) / 100; // ISK
  const extraVorugjold = verdTilTolls * 0.05; // ISK
  const VSK =
    (verdTilTolls + vorugjold + extraVorugjold + urvinnslugjald) * 0.24;

  const rows2 = [
    createData(0, 'Samtals vörugjöld', vorugjold, formatPrice(vorugjold)),
    createData(
      1,
      'Úrvinnslugjald',
      urvinnslugjald,
      formatPrice(urvinnslugjald)
    ),
    createData(
      2,
      'Auka 5% vörugjöld',
      extraVorugjold,
      formatPrice(extraVorugjold)
    ), // ISK
    createData(3, 'VSK 24%', VSK, formatPrice(VSK)), // ISK
    createData(
      4,
      'Forskráning og númeraplötur',
      forskraning,
      formatPrice(forskraning)
    ), // ISK
    createData(5, 'Skoðun og rammar', skodun, formatPrice(skodun)), // ISK
  ];

  function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
  }

  const heildarverd =
    verdTilTolls + vorugjold + extraVorugjold + urvinnslugjald + VSK;
  return (
    <React.Fragment>
      <Title>Reiknivél</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Upphæð</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">
                {row.displayAmount || row.amount}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>Verð til tolls</TableCell>
            <TableCell align="right">
              <b>{`${formatPrice(verdTilTolls)}`}</b>
            </TableCell>
          </TableRow>
          <TableRow />
        </TableBody>
      </Table>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Upphæð</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows2.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">
                {row.displayAmount || row.amount}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>Kostnaðarverð m/VSK</TableCell>
            <TableCell align="right">
              <b>{`${formatPrice(heildarverd)}`}</b>
            </TableCell>
          </TableRow>
          <TableRow />
        </TableBody>
      </Table>

      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
