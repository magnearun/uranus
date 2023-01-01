import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { formatPrice } from '../src/utils/formatters';

// Generate Order Data

function createData(
  id: number,
  name: string,
  amount: number,
  displayAmount?: string
) {
  return { id, name, amount, displayAmount };
}

interface Props {
  price: number | undefined;
  co2: number | undefined;
  EURISKConversion: number | undefined;
  electric: boolean;
}

export default function Calculator({
  price,
  co2,
  EURISKConversion = 140,
  electric,
}: Props) {
  const priceISK = (price || 0)  * EURISKConversion;
  const N2 = 0.28;
  const urvinnslugjald = 3133; // ISK
  const forskraning = 17021; // ISK
  const skodun = 17959; // ISK

  const rows = [
    createData(
      0,
      'GEO-trans',
      400 * EURISKConversion,
      formatPrice(400 * EURISKConversion, 'ISK', true)
    ),
    createData(
      1,
      'Þóknun',
      300 * EURISKConversion,
      formatPrice(300 * EURISKConversion, 'ISK', true)
    ),
    createData(
      2,
      'Sjófrakt (Eimskip)',
      105000,
      formatPrice(105000, 'ISK', true)
    ), // ISK
    createData(3, 'Tollskýrsla', 5000), // ISK
  ];

  const verdTilTolls = rows.reduce((a, b) => a + b.amount, priceISK);
  const vorugjold = (Math.max(0, (co2 || 0) - 85) * verdTilTolls * N2) / 100; // ISK
  const extraVorugjold = verdTilTolls * 0.05; // ISK
  const VSK =
    (verdTilTolls + vorugjold + extraVorugjold + urvinnslugjald) * 0.24;

  const VSKElectric =
    Math.max(0, verdTilTolls + extraVorugjold - 5500000) * 0.24;
  const rows2 = [
    createData(
      0,
      'Vörugjöld',
      vorugjold + extraVorugjold,
      formatPrice(vorugjold + extraVorugjold, 'ISK', true)
    ),
    createData(
      1,
      'Úrvinnslugjald',
      urvinnslugjald,
      formatPrice(urvinnslugjald, 'ISK', true)
    ),
    createData(
      4,
      'Forskráning og skoðun',
      forskraning + skodun,
      formatPrice(forskraning + skodun, 'ISK', true)
    ), // ISK
    createData(
      3,
      'VSK',
      VSK,
      formatPrice(electric ? VSKElectric : VSK, 'ISK', true)
    ), // ISK
  ];

  function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
  }

  const heildarverd =
    verdTilTolls +
    vorugjold +
    extraVorugjold +
    urvinnslugjald +
    forskraning +
    skodun +
    (electric ? VSKElectric : VSK);
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
              <b>{`${formatPrice(verdTilTolls, 'ISK', true)}`}</b>
            </TableCell>
          </TableRow>
          <TableRow />
        </TableBody>
      </Table>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Önnur gjöld</TableCell>
            <TableCell align="right"></TableCell>
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
            <TableCell>
              <b>Kostnaðarverð m/VSK</b>
            </TableCell>
            <TableCell align="right">
              <b>{`${formatPrice(heildarverd, 'ISK', true)}`}</b>
            </TableCell>
          </TableRow>
          <TableRow />
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
