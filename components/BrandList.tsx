'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { fetchBrands, deleteBrand, type Brand } from '../app/store/slices/brandsSlice';
import { BrandForm } from './BrandForm';
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import styles from './BrandList.module.css';

export function BrandList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.brands);
  const [editing, setEditing] = useState<Brand | null>(null);

  useEffect(() => { dispatch(fetchBrands()); }, [dispatch]);

  return (
    <div className={styles.container}>
      <h2>Додати бренд</h2>
      <BrandForm onSaved={() => dispatch(fetchBrands())} />

      <h2>Список брендів</h2>
      {loading && <p>Завантаження…</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && items.length === 0 && <p>Поки що немає жодного бренду.</p>}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Назва</TableCell>
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.name}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => setEditing(brand)}>Редагувати</Button>
                  <Button size="small" color="error" onClick={() => dispatch(deleteBrand(brand.id))}>Видалити</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {editing && (
        <div className={styles.editBox}>
          <h2>Редагувати бренд: {editing.name}</h2>
          <BrandForm initialData={editing} onSaved={() => { setEditing(null); dispatch(fetchBrands()); }} />
        </div>
      )}
    </div>
  );
}
