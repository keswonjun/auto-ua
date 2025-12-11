'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { fetchCars, deleteCar, type Car } from '../app/store/slices/carsSlice';
import { fetchBrands } from '../app/store/slices/brandsSlice';
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import styles from './CarList.module.css';

export function CarList() {
  const dispatch = useAppDispatch();
  const { items: cars, loading, error } = useAppSelector((s) => s.cars);

  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCars());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Авто</h2>
        <Link href="/cars/new">
          <Button variant="contained" color="primary" size="small">
            Додати авто
          </Button>
        </Link>
      </div>

      {loading && <p>Завантаження…</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && cars.length === 0 && <p>Немає жодного авто.</p>}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Бренд</TableCell>
              <TableCell>Модель</TableCell>
              <TableCell>Рік</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.map((car: Car) => (
              <TableRow key={car.id}>
                <TableCell>{car.brand?.name}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>{car.price} $</TableCell>
                <TableCell align="right">
                  <Link href={`/cars/${car.id}`}>
                    <Button size="small">Редагувати</Button>
                  </Link>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => dispatch(deleteCar(car.id))}
                  >
                    Видалити
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
